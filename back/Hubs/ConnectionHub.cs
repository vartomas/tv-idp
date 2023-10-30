using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TV_IDP.Access.Models.Chess;
using TV_IDP.Models.Chat;
using TV_IDP.Models.Hub;
using TV_IDP.Services;
using TV_IDP.Access.Models;
using TV_IDP.Access.Models.Chat;
using TV_IDP.Models.Chess;
using TV_IDP.Utils;

namespace TV_IDP.Hubs;

[Microsoft.AspNetCore.Authorization.Authorize(Policy = "SignalRJwtPolicy")]
public sealed class ConnectionHub : Hub
{
    private readonly AppDbContext _db;
    private readonly Channels _channels;
    private readonly ChessGames _chessGames;
    private readonly Connections _connections;
    private readonly IUserService _users;

    public ConnectionHub(AppDbContext db, Channels channels, ChessGames chessGames, Connections connections, IUserService users)
    {
        _db = db;
        _channels = channels;
        _chessGames = chessGames;
        _connections = connections;
        _users = users;
    }

    public override async Task OnConnectedAsync()
    {
        var user = _users.GetCurrentHubUser(Context);
        _connections.AddUser(new HubConnection()
        {
            Id = user.Id,
            Username = user.Username,
            ConnectionId = Context.ConnectionId
        });
        _channels.AddUserToChannel(21, user.Id);
        await Groups.AddToGroupAsync(Context.ConnectionId, "21");
        await Clients.Group("21").SendAsync("UserList", _channels.GetChannelUsers(21));
        var channels = await _db.ChatChannels.Where(channel => channel.Users.Contains(user)).Include(x => x.Messages).ToListAsync();
        channels.ForEach(async channel =>
        {
            _channels.AddUserToChannel(channel.Id, user.Id);
            await Groups.AddToGroupAsync(Context.ConnectionId, channel.Id.ToString());
            await Clients.Group(channel.Id.ToString()).SendAsync("ReceiveMessage", CreateChatMessage(ChatMessageType.Connected, channel.Id));
            await Clients.Group(channel.Id.ToString()).SendAsync("UserList", _channels.GetChannelUsers(channel.Id));
        });
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var user = _users.GetCurrentHubUser(Context);
        _connections.RemoveUser(Context.ConnectionId);
        _channels.RemoveUserFromChannel(21, user.Id);
        var channels = await _db.ChatChannels.Where(channel => channel.Users.Contains(user)).Include(x => x.Messages).ToListAsync();
        channels.ForEach(async channel =>
        {
            _channels.RemoveUserFromChannel(channel.Id, user.Id);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, channel.Id.ToString());
            await Clients.Group(channel.Id.ToString()).SendAsync("ReceiveMessage", CreateChatMessage(ChatMessageType.Disconnected, channel.Id));
            await Clients.Group(channel.Id.ToString()).SendAsync("UserList", _channels.GetChannelUsers(channel.Id));
        });
        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinChannel(int channelId)
    {
        var user = _users.GetCurrentHubUser(Context);
        _channels.AddUserToChannel(channelId, user.Id);
        await Groups.AddToGroupAsync(Context.ConnectionId, channelId.ToString());
        await Clients.Group(channelId.ToString()).SendAsync("ReceiveMessage", CreateChatMessage(ChatMessageType.JoinedChannel, channelId));
        await Clients.Group(channelId.ToString()).SendAsync("UserList", _channels.GetChannelUsers(channelId));
    }

    public async Task LeaveChannel(int channelId)
    {
        var user = _users.GetCurrentHubUser(Context);
        _channels.RemoveUserFromChannel(channelId, user.Id);
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, channelId.ToString());
        await Clients.Group(channelId.ToString()).SendAsync("ReceiveMessage", CreateChatMessage(ChatMessageType.LeftChannel, channelId));
        await Clients.Group(channelId.ToString()).SendAsync("UserList", _channels.GetChannelUsers(channelId));
    }

    public async Task NewMessage(string message, int channelId)
    {
        await Clients.Group(channelId.ToString()).SendAsync("ReceiveMessage", CreateChatMessage(ChatMessageType.UserMessage, channelId, message));
    }

    public ChatMessageDto CreateChatMessage(ChatMessageType type, int channelId, string message = "")
    {
        var user = _users.GetCurrentHubUser(Context);
        var newMessage = type switch
        {
            ChatMessageType.UserMessage => message,
            ChatMessageType.Connected => $"{user.Username} has connected",
            ChatMessageType.Disconnected => $"{user.Username} has disconnected",
            ChatMessageType.JoinedChannel => $"{user.Username} has joined the channel",
            ChatMessageType.LeftChannel => $"{user.Username} has left the channel",
            _ => throw new Exception("Invalid message type"),
        };

        var messageType = type == ChatMessageType.UserMessage ? "message" : "info";

        var chatMessage = new ChatMessage { Body = newMessage, ChannelId = channelId, UserId = user.Id, Type = messageType, CreatedAt = DateTime.Now };
        _db.ChatMessages.Add(chatMessage);
        _db.SaveChanges();

        return new ChatMessageDto()
        {
            Id = chatMessage.Id,
            Username = user.Username,
            Body = newMessage,
            Type = messageType,
            ChannelId = channelId,
        };
    }

    // chess games

    public async Task InviteForChessGame(int opponentId)
    {
        var currentUser = _users.GetCurrentHubUser(Context);
        var opponentUser = await _db.Users.FindAsync(opponentId);

        if (opponentUser is null || currentUser is null)
        {
            throw new Exception("User not found");
        }

        User[] users = { currentUser, opponentUser };
        User randomUser = users[new Random().Next(users.Length)];

        var chessGame = new ChessGame()
        {
            WhiteUserId = randomUser.Id,
            BlackUserId = users[0].Id == randomUser.Id ? users[1].Id : users[0].Id
        };

        await _db.ChessGames.AddAsync(chessGame);
        await _db.SaveChangesAsync();

        var opponentConnectionId = _connections.GetConnections().Find((user) => user.Id == opponentId)?.ConnectionId;

        if (opponentConnectionId is null)
        {
            throw new Exception("User not connected");
        }

        var inviteMessage = new
        {
            chessGame.Id,
            InvitedBy = currentUser.Username
        };

        await Clients.Client(opponentConnectionId).SendAsync("ReceiveChessGameInvite", inviteMessage);
    }

    public async Task AcceptGameInvite(int gameId)
    {
        var currentUser = _users.GetCurrentHubUser(Context);
        var chessGame = await _db.ChessGames.FindAsync(gameId);

        if (chessGame is null || currentUser is null)
        {
            throw new Exception("User or game not found");
        }

        var opponentConnectionId = _connections.GetConnections().Find((user) => currentUser.Id == chessGame.WhiteUserId ? user.Id == chessGame.BlackUserId : user.Id == chessGame.WhiteUserId)?.ConnectionId;

        if (opponentConnectionId is null)
        {
            throw new Exception("User not connected");
        }

        await Clients.Client(opponentConnectionId).SendAsync("ReceiveChessGameAccept", chessGame.Id);

        var liveGame = new LiveChessGame()
        {
            Id = chessGame.Id,
            WhiteUserId = chessGame.WhiteUserId,
            BlackUserId = chessGame.BlackUserId,
            TurnUserId = chessGame.WhiteUserId
        };

        _chessGames.AddGame(liveGame);

        var gameConnectionIds = _connections.GetConnections().FindAll((user) => user.Id == chessGame.WhiteUserId || user.Id == chessGame.BlackUserId).Select((user) => user.ConnectionId).ToList();

        gameConnectionIds.ForEach(async (connectionId) =>
        {
            await Clients.Client(connectionId).SendAsync("ReceiveGameStart", new
            {
                liveGame.Id,
                CurrentTurn = _connections.GetConnectedUser(connectionId)?.Id == liveGame.TurnUserId
            });
        });
    }

    public async Task MakeMove(int gameId, ChessMoveDto move)
    {
        Console.WriteLine(gameId);
        Console.Write(move);

        try
        {
            var currentUser = _users.GetCurrentHubUser(Context);
            var chessGame = _chessGames.GetGame(gameId);
            var opponentConnectionId = _connections.GetUserConnectionId(chessGame.WhiteUserId == currentUser.Id ? chessGame.BlackUserId : chessGame.WhiteUserId);
            Console.WriteLine("opponentConnectionId", opponentConnectionId);
            await Clients.Client(opponentConnectionId).SendAsync("ReceiveOpponentMove", move);
        }
        catch (CustomException ex)
        {
            Console.WriteLine(ex.ToString());
        }
    }
}