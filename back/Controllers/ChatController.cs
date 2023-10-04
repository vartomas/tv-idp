using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TV_IDP.Access.Models;
using TV_IDP.Access.Models.Chat;
using TV_IDP.Authorization;
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
        var user = HttpContext.Items["User"] as User;

        if (user == null)
        {
            return BadRequest(new { message = "Bad request" });
        }

        var channels = await _db.ChatChannels
            .Where(channel => channel.Users.Contains(user))
            .Include(x => x.Users)
            .ToListAsync();

        List<ChatChannelResponse> response = new();
        channels.ForEach(channel =>
        {
            response.Add(new ChatChannelResponse
            {
                Id = channel.Id,
                Name = channel.Name
            });
        });
        return Ok(response);
    }

    [HttpGet(nameof(GetMessages))]
    public async Task<IActionResult> GetMessages() 
    {
        var user = HttpContext.Items["User"] as User;

        if (user == null)
        {
            return BadRequest(new { message = "Bad request" });
        }

        var channels = await _db.ChatChannels
            .Where(channel => channel.Users.Contains(user))
            .Include(x => x.Messages)
            .ThenInclude(x => x.User)
            .ToListAsync();

        List<Models.Chat.ChatMessageDto> response = new();
        channels.ForEach(channel =>
        {
            var latestMessages = channel.Messages.OrderByDescending(x => x.CreatedAt).Take(30).ToList();
            latestMessages.ForEach(message => 
            {
                response.Add(new Models.Chat.ChatMessageDto
                {
                    Id = message.Id,
                    Body = message.Body,
                    Type = message.Type,
                    ChannelId = message.ChannelId,
                    Username = message.User?.Username is not null ? message.User.Username : "Anonymous"
                });
            });
        });
        return Ok(response);
    }

    [HttpPost(nameof(CreateChannel))]
    public async Task<IActionResult> CreateChannel(CreateChannelRequest request) 
    {
        var user = HttpContext.Items["User"] as User;

        if (user is null || request.Name is null)
        {
            return BadRequest(new { message = "Bad request" });
        }

        var channel = new ChatChannel
        {
            Name = request.Name,
            Users = new List<User> { user }
        };

        await _db.ChatChannels.AddAsync(channel);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Channel created", channel.Id, channel.Name });
    }

    [HttpPost(nameof(JoinChannel))]
    public async Task<IActionResult> JoinChannel(JoinChannelRequest request)
    {
        var user = HttpContext.Items["User"] as User;

        if (user is null)
        {
            return BadRequest(new { message = "Bad request" });
        }

        var channel = await _db.ChatChannels.Include(x => x.Users).FirstOrDefaultAsync(x => x.Id == request.Id);

        if (channel is null)
        {
            return BadRequest(new { message = "Channel not found" });
        }

        if (channel.Users.Contains(user))
        {
            return BadRequest(new { message = "User already in channel" });
        }

        channel.Users.Add(user);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Channel joined", channel.Id, channel.Name });
    }

    [HttpPost(nameof(LeaveChannel))]
    public async Task<IActionResult> LeaveChannel(LeaveChannelRequest request)
    {
        var user = HttpContext.Items["User"] as User;

        if (user is null)
        {
            return BadRequest(new { message = "Bad request" });
        }

        var channel = await _db.ChatChannels.Include(x => x.Users).FirstOrDefaultAsync(x => x.Id == request.Id);

        if (channel is null)
        {
            return BadRequest(new { message = "Channel not found" });
        }

        if (!channel.Users.Contains(user))
        {
            return BadRequest(new { message = "User not in channel" });
        }

        channel.Users.Remove(user);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Channel left", channel.Id, channel.Name });
    }
}