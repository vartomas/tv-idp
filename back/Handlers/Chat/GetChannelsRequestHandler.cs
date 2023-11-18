using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TV_IDP.Access.Models;
using TV_IDP.Models.Chat;
using TV_IDP.Services;

namespace TV_IDP.Handlers.Chat;

public class GetChannelsRequestHandler
{
    private readonly HttpContext _ctx;

    public GetChannelsRequestHandler(HttpContext ctx)
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
            .Include(x => x.Users)
            .ToListAsync();

        List<ChatChannelResponse> result = new();
        channels.ForEach(channel =>
        {
            result.Add(new ChatChannelResponse
            {
                Id = channel.Id,
                Name = channel.Name
            });
        });

        return new OkObjectResult(result);
    }
}

