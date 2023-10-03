using Microsoft.AspNetCore.SignalR;
using TV_IDP.Services;

namespace TV_IDP.Hubs;

[Microsoft.AspNetCore.Authorization.Authorize(Policy = "SignalRJwtPolicy")]
public sealed class ChessHub : Hub
{
    private readonly AppDbContext _context;

    public ChessHub(AppDbContext context)
    {
        _context = context;
    }
}

