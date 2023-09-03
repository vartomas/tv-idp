using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TV_IDP.Access.Models;
using TV_IDP.Authorization;
using TV_IDP.Models;
using TV_IDP.Services;

namespace TV_IDP.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly AppDbContext _context;

    public ChatController(IUserService userService, AppDbContext context)
    {
        _userService = userService;
        _context = context;
    }

    [HttpGet(nameof(GetChannels))]
    public async Task<IActionResult> GetChannels()
    {
        var user = HttpContext.Items["User"] as User;

        if (user == null)
        {
            return BadRequest(new { message = "Bad request" });
        }
        var channels = await _context.ChatChannels.Where(channel => channel.Users.Contains(user)).Include(x => x.Messages).ToListAsync();

        List<ChatChannelResponse> response = new();
        channels.ForEach(channel =>
        {
            response.Add(new ChatChannelResponse
            {
                Id = channel.Id,
                Name = channel.Name,
                Messages = channel.Messages
            });
        }); 

        return Ok(response);
    }

    [HttpPost(nameof(CreateChannel))]
    public async Task<IActionResult> CreateChannel(CreateChannelRequest request)
    {
        var user = HttpContext.Items["User"] as User;
        var name = request.Name;

        if (user == null || name == null)
        {
            return BadRequest(new { message = "Bad request" });
        }

        var newChannel = new ChatChannel
        {
            Name = request.Name,
            Users = new List<User> { user },
            CreatedAt = DateTime.UtcNow
        };

        await _context.ChatChannels.AddAsync(newChannel);
        await _context.SaveChangesAsync();

        var response = new ChatChannelResponse() { Id = newChannel.Id, Name = newChannel.Name };

        return Ok(response);
    }
}