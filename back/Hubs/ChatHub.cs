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
        HubConnections.AddUser(new HubConnection() { Id = user.Id, Username = user.Username, ConnectionId = Context.ConnectionId });
        await Groups.AddToGroupAsync(Context.ConnectionId, "main");
        await Clients.Group("main").SendAsync("ReceiveMessage", CreateChatMessage(MessageType.Connected, "main"));
        user.Channels.ForEach(async channel => await Groups.AddToGroupAsync(Context.ConnectionId, channel.Id.ToString()));
        user.Channels.ForEach(async channel =>
        {
            await Clients.Group(channel.Id.ToString()).SendAsync("ReceiveMessage", CreateChatMessage(MessageType.Connected, channel.Id.ToString()));
        });
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var user = GetUser();
        HubConnections.RemoveUser(Context.ConnectionId);
        await Clients.Group("main").SendAsync("ReceiveMessage", CreateChatMessage(MessageType.Disconnected, "main"));
        user.Channels.ForEach(async channel =>
        {
        await Clients.Group(channel.Id.ToString()).SendAsync("ReceiveMessage", CreateChatMessage(MessageType.Disconnected, channel.Id.ToString()));
        });
        await base.OnDisconnectedAsync(exception);
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

        if (type == MessageType.Connected || type == MessageType.Disconnected)
        {
            var connectedUsers = HubConnections.GetConnections();
            chatMessage.ConnectedUsers = connectedUsers.Select(user => user.Username).ToList();
        }

        return chatMessage;
    }
}