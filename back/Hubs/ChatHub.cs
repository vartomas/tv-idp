using Microsoft.AspNetCore.SignalR;
using TV_IDP.Access.Models;
using TV_IDP.Models;

namespace TV_IDP.Hubs;

[Microsoft.AspNetCore.Authorization.Authorize(Policy = "SignalRJwtPolicy")]
public sealed class ChatHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var user = GetUser();
        HubConnections.AddUser(new HubConnection()
        {
            Id = user.Id,
            Username = user.Username,
            ConnectionId = Context.ConnectionId
        });
        HubChannels.AddUserToChannel(0, user.Id);
        await Groups.AddToGroupAsync(Context.ConnectionId, "main");
        await Clients.Group("main").SendAsync("ReceiveMessage", CreateChatMessage(MessageType.Connected, "main"));
        await Clients.Group("main").SendAsync("UserList", GetChannelUsers(0));
        user.Channels.ForEach(async channel =>
        {
            HubChannels.AddUserToChannel(channel.Id, user.Id);
            await Groups.AddToGroupAsync(Context.ConnectionId, channel.Id.ToString());
            await Clients.Group(channel.Id.ToString()).SendAsync("ReceiveMessage", CreateChatMessage(MessageType.Connected, channel.Id.ToString()));
            await Clients.Group(channel.Id.ToString()).SendAsync("UserList", GetChannelUsers(channel.Id));
        });
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var user = GetUser();
        HubConnections.RemoveUser(Context.ConnectionId);
        await Clients.Group("main").SendAsync("ReceiveMessage", CreateChatMessage(MessageType.Disconnected, "main"));
        await Clients.Group("main").SendAsync("UserList", GetChannelUsers(0));
        user.Channels.ForEach(async channel =>
        {
            HubChannels.RemoveUserFromChannel(channel.Id, user.Id);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, channel.Id.ToString());
            await Clients.Group(channel.Id.ToString()).SendAsync("ReceiveMessage", CreateChatMessage(MessageType.Disconnected, channel.Id.ToString()));
            await Clients.Group(channel.Id.ToString()).SendAsync("UserList", GetChannelUsers(channel.Id));
        });
        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinChannel(int channelId)
    {
        var user = GetUser();
        HubChannels.AddUserToChannel(channelId, user.Id);
        await Groups.AddToGroupAsync(Context.ConnectionId, channelId.ToString());
        await Clients.Group(channelId.ToString()).SendAsync("ReceiveMessage", CreateChatMessage(MessageType.JoinedChannel, channelId.ToString()));
        await Clients.Group(channelId.ToString()).SendAsync("UserList", GetChannelUsers(channelId));
    }

    public async Task LeaveChannel(int channelId)
    {
        var user = GetUser();
        HubChannels.RemoveUserFromChannel(channelId, user.Id);
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, channelId.ToString());
        await Clients.Group(channelId.ToString()).SendAsync("ReceiveMessage", CreateChatMessage(MessageType.LeftChannel, channelId.ToString()));
        await Clients.Group(channelId.ToString()).SendAsync("UserList", GetChannelUsers(channelId));
    }

    public async Task NewMessage(string message, string channelId)
    {
        await Clients.Group(channelId.ToString()).SendAsync("ReceiveMessage", CreateChatMessage(MessageType.UserMessage, channelId, message));
    }

    public User GetUser()
    {
        if (Context.GetHttpContext()?.Items["User"] is not User user)
        {
            throw new Exception("User not found");
        }

        return user;
    }

    public Message CreateChatMessage(MessageType type, string channelId, string message = "")
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

        var chatMessage = new Message()
        {
            Username = user.Username,
            Body = newMessage,
            Type = type == MessageType.UserMessage ? "message" : "info",
            Id = Guid.NewGuid(),
            ChannelId = channelId
        };

        return chatMessage;
    }

    public List<ConnectedUser> GetChannelUsers(int channelId)
    {
        var connections = HubConnections.GetConnections();
        if (channelId == 0)
        {
            return connections.Select(user => new ConnectedUser() { Id = user.Id, Username = user.Username }).ToList();
        }

        var userIds = HubChannels.GetUsersInChannel(channelId);
        return connections.FindAll(connection => userIds.Contains(connection.Id)).Select(user => new ConnectedUser() { Id = user.Id, Username = user.Username }).ToList();
    }
}