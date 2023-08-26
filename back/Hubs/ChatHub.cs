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
        HubConnections.AddUser(user.Username);
        await Clients.All.SendAsync("ReceiveMessage", CreateChatMessage(ChatMessageType.Connected));
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var user = GetUser();
        HubConnections.RemoveUser(user.Username);
        await Clients.All.SendAsync("ReceiveMessage", CreateChatMessage(ChatMessageType.Disconnected));
        await base.OnDisconnectedAsync(exception);
    }

    public async Task NewMessage(string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", CreateChatMessage(ChatMessageType.UserMessage, message));
    }

    public User GetUser()
    {
        if (Context.GetHttpContext()?.Items["User"] is not User user)
        {
            throw new Exception("User not found");
        }

        return user;
    }

    public ChatMessage CreateChatMessage(ChatMessageType type, string message = "")
    {
        var user = GetUser();
        var newMessage = type switch
        {
            ChatMessageType.UserMessage => message,
            ChatMessageType.Connected => $"{user.Username} has connected",
            ChatMessageType.Disconnected => $"{user.Username} has disconnected",
            _ => throw new Exception("Invalid message type"),
        };

        var chatMessage = new ChatMessage()
        {
            Username = user.Username,
            Message = newMessage,
            Type = type == ChatMessageType.UserMessage ? "message" : "info",
            Id = Guid.NewGuid()
        };

        if (type == ChatMessageType.Connected | type == ChatMessageType.Disconnected)
        {
            chatMessage.ConnectedUsers = HubConnections.GetConnections();
        }

        return chatMessage;
    }
}