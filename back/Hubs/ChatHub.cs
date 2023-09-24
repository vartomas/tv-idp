using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TV_IDP.Access.Models;
using TV_IDP.Models;
using TV_IDP.Services;

namespace TV_IDP.Hubs;

[Microsoft.AspNetCore.Authorization.Authorize(Policy = "SignalRJwtPolicy")]
public sealed class ChatHub : Hub
{
    private readonly AppDbContext _context;

    public ChatHub(AppDbContext context)
    {
        _context = context;
    }

    public override async Task OnConnectedAsync()
    {
        var user = GetUser();
        HubConnections.AddUser(new HubConnection()
        {
            Id = user.Id,
            Username = user.Username,
            ConnectionId = Context.ConnectionId
        });
        HubChannels.AddUserToChannel(21, user.Id);
        await Groups.AddToGroupAsync(Context.ConnectionId, "21");
        await Clients.Group("21").SendAsync("UserList", GetChannelUsers(21));
        var channels = await _context.ChatChannels.Where(channel => channel.Users.Contains(user)).Include(x => x.Messages).ToListAsync();
        channels.ForEach(async channel =>
        {
            HubChannels.AddUserToChannel(channel.Id, user.Id);
            await Groups.AddToGroupAsync(Context.ConnectionId, channel.Id.ToString());
            await Clients.Group(channel.Id.ToString()).SendAsync("ReceiveMessage", CreateChatMessage(MessageType.Connected, channel.Id));
            await Clients.Group(channel.Id.ToString()).SendAsync("UserList", GetChannelUsers(channel.Id));
        });
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var user = GetUser();
        HubConnections.RemoveUser(Context.ConnectionId);
        HubChannels.RemoveUserFromChannel(21, user.Id);
        var channels = await _context.ChatChannels.Where(channel => channel.Users.Contains(user)).Include(x => x.Messages).ToListAsync();
        channels.ForEach(async channel =>
        {
            HubChannels.RemoveUserFromChannel(channel.Id, user.Id);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, channel.Id.ToString());
            await Clients.Group(channel.Id.ToString()).SendAsync("ReceiveMessage", CreateChatMessage(MessageType.Disconnected, channel.Id));
            await Clients.Group(channel.Id.ToString()).SendAsync("UserList", GetChannelUsers(channel.Id));
        });
        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinChannel(int channelId)
    {
        var user = GetUser();
        HubChannels.AddUserToChannel(channelId, user.Id);
        await Groups.AddToGroupAsync(Context.ConnectionId, channelId.ToString());
        await Clients.Group(channelId.ToString()).SendAsync("ReceiveMessage", CreateChatMessage(MessageType.JoinedChannel, channelId));
        await Clients.Group(channelId.ToString()).SendAsync("UserList", GetChannelUsers(channelId));
    }

    public async Task LeaveChannel(int channelId)
    {
        var user = GetUser();
        HubChannels.RemoveUserFromChannel(channelId, user.Id);
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, channelId.ToString());
        await Clients.Group(channelId.ToString()).SendAsync("ReceiveMessage", CreateChatMessage(MessageType.LeftChannel, channelId));
        await Clients.Group(channelId.ToString()).SendAsync("UserList", GetChannelUsers(channelId));
    }

    public async Task NewMessage(string message, int channelId)
    {
        await Clients.Group(channelId.ToString()).SendAsync("ReceiveMessage", CreateChatMessage(MessageType.UserMessage, channelId, message));
    }

    public async Task InviteForChessGame(int opponentId)
    {
        var currentUser = GetUser();
        var opponentUser = await _context.Users.FindAsync(opponentId);

        if (opponentUser is null || currentUser is null)
        {
            throw new Exception("User not found");
        }

        User[] users = { currentUser, opponentUser };
        User randomUser = users[new Random().Next(users.Length)];

        var chessGame = new ChessGame()
        {
            WhiteUserId = randomUser.Id,
            BlackUserId = users[0].Id == randomUser.Id ? users[1].Id : users[0].Id,
        };

        await _context.ChessGames.AddAsync(chessGame);
        await _context.SaveChangesAsync();

        await Clients.Caller.SendAsync("ReceiveChessGameInvite", chessGame.Id);
        var opponentConnectionId = HubConnections.GetConnections().Find((user) => user.Id == opponentId)?.ConnectionId;

        if (opponentConnectionId is null)
        {
            throw new Exception("User not connected");
        }

        await Clients.Client(opponentConnectionId).SendAsync("ReceiveChessGameInvite", chessGame.Id);
    }

    public User GetUser()
    {
        if (Context.GetHttpContext()?.Items["User"] is not User user)
        {
            throw new Exception("User not found");
        }

        return user;
    }

    public Message CreateChatMessage(MessageType type, int channelId, string message = "")
    {
        var user = GetUser();
        var newMessage = type switch
        {
            MessageType.UserMessage => message,
            MessageType.Connected => $"{user.Username} has connected",
            MessageType.Disconnected => $"{user.Username} has disconnected",
            MessageType.JoinedChannel => $"{user.Username} has joined the channel",
            MessageType.LeftChannel => $"{user.Username} has left the channel",
            _ => throw new Exception("Invalid message type"),
        };

        var messageType = type == MessageType.UserMessage ? "message" : "info";

        var chatMessage = new ChatMessage { Body = newMessage, ChannelId = channelId, UserId = user.Id, Type = messageType, CreatedAt = DateTime.Now };
        _context.ChatMessages.Add(chatMessage);
        _context.SaveChanges();

        return new Message()
        {
            Id = chatMessage.Id,
            Username = user.Username,
            Body = newMessage,
            Type = messageType,
            ChannelId = channelId,
        };
    }

    public ChannelUsers GetChannelUsers(int channelId)
    {
        var connections = HubConnections.GetConnections();
        if (channelId == 0)
        {
            return new ChannelUsers 
            {
                ChannelId = channelId,
                Users = connections.Select(user => new ConnectedUser() { Id = user.Id, Username = user.Username }).ToList()
            };
        }

        var userIds = HubChannels.GetUsersInChannel(channelId);
        return new ChannelUsers
        {
            ChannelId = channelId,
            Users = connections.FindAll(connection => userIds.Contains(connection.Id)).Select(user => new ConnectedUser() { Id = user.Id, Username = user.Username }).ToList()
        };
    }
}