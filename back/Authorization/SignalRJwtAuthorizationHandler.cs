using Microsoft.AspNetCore.Authorization;
using TV_IDP.Services;

namespace TV_IDP.Authorization;

public class SignalRJwtAuthorizationHandler : AuthorizationHandler<SignalRJwtRequirement>
{
    private readonly IUserService _users;
    private readonly IJwt _jwt;

    public SignalRJwtAuthorizationHandler(IUserService users, IJwt jwt)
    {
        _users = users;
        _jwt = jwt;
    }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, SignalRJwtRequirement requirement)
    {
        var httpContext = context.Resource as HttpContext;
        if (httpContext == null)
        {
            context.Fail();
            return;
        }

        var token = httpContext.Request.Cookies["token"];
        var userId = _jwt.ValidateJwtToken(token);

        if (userId != null)
        {
            httpContext.Items["User"] = await _users.GetById(userId.Value);
            context.Succeed(requirement);
        }
        else
        {
            context.Fail();
        }
    }
}