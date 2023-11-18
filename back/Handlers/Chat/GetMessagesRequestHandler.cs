using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TV_IDP.Access.Models;
using TV_IDP.Models.Chat;
using TV_IDP.Services;

namespace TV_IDP.Handlers.Chat;

public class GetMessagesRequestHandler
{
    private readonly HttpContext _ctx;

    public GetMessagesRequestHandler(HttpContext ctx)
    {
        _ctx = ctx;
    }

    public async Task<IActionResult> HandleAsync()
    {
        var user = _ctx.Items["User"] as User;

        if (user == null)
        {
            return new BadRequestObjectResult(new { message = "Bad request" });
        }

        var db = _ctx.RequestServices.GetRequiredService<AppDbContext>();

        var channels = await db.ChatChannels
            .Where(channel => channel.Users.Contains(user))
            .Include(x => x.Messages)
            .ThenInclude(x => x.User)
            .ToListAsync();

        List<ChatMessageDto> result = new();
        channels.ForEach(channel =>
        {
            var latestMessages = channel.Messages.OrderByDescending(x => x.CreatedAt).Take(30).ToList();
            latestMessages.ForEach(message =>
            {
                result.Add(new ChatMessageDto
                {
                    Id = message.Id,
                    Body = message.Body,
                    Type = message.Type,
                    ChannelId = message.ChannelId,
                    Username = message.User?.Username is not null ? message.User.Username : "Anonymous"
                });
            });
        });

        return new OkObjectResult(result);
    }
}

