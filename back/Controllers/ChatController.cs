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
    private readonly AppDbContext _context;

    public ChatController(AppDbContext context)
    {
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

        var channels = await _context.ChatChannels
            .Where(channel => channel.Users.Contains(user))
            .Include(x => x.Messages)
            .ThenInclude(x => x.User)
            .ToListAsync();

        List<ChatChannelResponse> response = new();
        channels.ForEach(channel =>
        {
            response.Add(new ChatChannelResponse
            {
                Id = channel.Id,
                Name = channel.Name,
                Messages = channel.Messages.Select(message => new Message
                {
                    Id = message.Id,
                    Body = message.Body,
                    Type = message.Type,
                    ChannelId = message.ChannelId,
                    Username = message.User?.Username is not null ? message.User.Username : "Anonymous"
                }).ToList()
            });
        });
        return Ok(response);
    }
}