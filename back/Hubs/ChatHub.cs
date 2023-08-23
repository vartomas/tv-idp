using Microsoft.AspNetCore.SignalR;

namespace TV_IDP.Hubs;

public sealed class ChatHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        await Clients.All.SendAsync("UserConnected", $"{Context.ConnectionId} has connected");
        await base.OnConnectedAsync();
    }

    public async Task NewMessage(string message) =>
        await Clients.All.SendAsync("ReceiveMessage", message);
}