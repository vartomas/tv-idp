using Microsoft.AspNetCore.SignalR;
using TV_IDP.Access.Models;
using TV_IDP.Models;

namespace TV_IDP.Hubs;

[Microsoft.AspNetCore.Authorization.Authorize(Policy = "SignalRJwtPolicy")]
public sealed class ChatHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var user = Context.GetHttpContext()?.Items["User"] as User;
        var chatMessage = new ChatMessage()
        {
            Username = user.Username,
            Message = $"{user?.Username} has connected",
            Type = "info"
        };
        await Clients.Others.SendAsync("ReceiveMessage", chatMessage);
        await base.OnConnectedAsync();
    }

    public async Task NewMessage(string message)
    {
        var user = Context.GetHttpContext()?.Items["User"] as User;

        var chatMessage = new ChatMessage()
        {
            Username = user.Username,
            Message = message,
            Type = "message"
        };

        await Clients.All.SendAsync("ReceiveMessage", chatMessage);
    }
}