using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TV_IDP.Access.Models;
using TV_IDP.Models.Chat;
using TV_IDP.Services;

namespace TV_IDP.Handlers.Chat;

public class JoinChannelRequestHandler
{
    private readonly HttpContext _ctx;

    public JoinChannelRequestHandler(HttpContext ctx)
    {
        _ctx = ctx;
    }

    public async Task<IActionResult> HandleAsync(JoinChannelRequest request)
    {
        var user = _ctx.Items["User"] as User;

        if (user is null)
        {
            return new BadRequestObjectResult(new { message = "Bad request" });
        }

        var db = _ctx.RequestServices.GetRequiredService<AppDbContext>();

        var channel = await db.ChatChannels.Include(x => x.Users).FirstOrDefaultAsync(x => x.Id == request.Id);

        if (channel is null)
        {
            return new BadRequestObjectResult(new { message = "Bad request" });
        }

        if (channel.Users.Contains(user))
        {
            return new BadRequestObjectResult(new { message = "Bad request" });
        }

        channel.Users.Add(user);
        await db.SaveChangesAsync();

        return new OkObjectResult(new { message = "Channel joined", channel.Id, channel.Name });
    }   
}

