using Microsoft.AspNetCore.SignalR;
using TV_IDP.Access.Models;
using TV_IDP.Authorization;
using TV_IDP.Models;
using TV_IDP.Services;

namespace TV_IDP.Hubs;

[Microsoft.AspNetCore.Authorization.Authorize(Policy = "SignalRJwtPolicy")]
public sealed class ChatHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var user = Context.GetHttpContext()?.Items["User"] as User;

        if (user != null) 
        { 
            var chatUser = new ChatUser() 
            {
                Id = user.Id, 
                Username = user.Username, 
                ConnectionId = Context.ConnectionId
            };
            Console.Out.WriteLine(chatUser.Id);
            Console.Out.WriteLine(chatUser.Username);
            Console.Out.WriteLine(chatUser.ConnectionId);
        }

        await Clients.Others.SendAsync("UserConnected", $"{user?.Username} has connected");
        await base.OnConnectedAsync();
    }

    public async Task NewMessage(string message) =>
        await Clients.All.SendAsync("ReceiveMessage", message);
}