using TV_IDP.Access.Models.Chat;
using TV_IDP.Access.Models;
using Microsoft.AspNetCore.Mvc;
using TV_IDP.Models.Chat;
using TV_IDP.Services;

namespace TV_IDP.Handlers.Chat;

public class CreateChannelRequestHandler
{
    private readonly HttpContext _ctx;

    public CreateChannelRequestHandler(HttpContext ctx)
    {
        _ctx = ctx;
    }

    public async Task<IActionResult> HandleAsync(CreateChannelRequest request)
    {
        var user = _ctx.Items["User"] as User;

        if (user is null || request.Name is null)
        {
            return new BadRequestObjectResult(new { message = "Bad request" });
        }

        var db = _ctx.RequestServices.GetRequiredService<AppDbContext>();

        var channel = new ChatChannel
        {
            Name = request.Name,
            Users = new List<User> { user }
        };

        await db.ChatChannels.AddAsync(channel);
        await db.SaveChangesAsync();

        return new OkObjectResult(new { message = "Channel created", channel.Id, channel.Name });
    }   
}