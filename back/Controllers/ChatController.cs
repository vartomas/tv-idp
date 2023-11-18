using Microsoft.AspNetCore.Mvc;
using TV_IDP.Authorization;
using TV_IDP.Handlers.Chat;
using TV_IDP.Models.Chat;
using TV_IDP.Services;

namespace TV_IDP.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly AppDbContext _db;

    public ChatController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet(nameof(GetChannels))]
    public async Task<IActionResult> GetChannels()
    {
        var handler = new GetChannelsRequestHandler(HttpContext);
        return await handler.HandleAsync();
    }

    [HttpGet(nameof(GetMessages))]
    public async Task<IActionResult> GetMessages()
    {
        var handler = new GetMessagesRequestHandler(HttpContext);
        return await handler.HandleAsync();
    }

    [HttpPost(nameof(CreateChannel))]
    public async Task<IActionResult> CreateChannel(CreateChannelRequest request) 
    {
        var handler = new CreateChannelRequestHandler(HttpContext);
        return await handler.HandleAsync(request);
    }

    [HttpPost(nameof(JoinChannel))]
    public async Task<IActionResult> JoinChannel(JoinChannelRequest request)
    {
        var handler = new JoinChannelRequestHandler(HttpContext);
        return await handler.HandleAsync(request);
    }

    [HttpPost(nameof(LeaveChannel))]
    public async Task<IActionResult> LeaveChannel(LeaveChannelRequest request)
    {
        var handler = new LeaveChannelRequestHandler(HttpContext);
        return await handler.HandleAsync(request);
    }
}