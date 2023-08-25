using Microsoft.AspNetCore.Authorization;
using TV_IDP.Services;

namespace TV_IDP.Authorization;

public class SignalRJwtAuthorizationHandler : AuthorizationHandler<SignalRJwtRequirement>
{
    private readonly IUserService _userService;
    private readonly IJwtUtils _jwtUtils;

    public SignalRJwtAuthorizationHandler(IUserService userService, IJwtUtils jwtUtils)
    {
        _userService = userService;
        _jwtUtils = jwtUtils;
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
        var userId = _jwtUtils.ValidateJwtToken(token);

        if (userId != null)
        {
            httpContext.Items["User"] = await _userService.GetById(userId.Value);
            context.Succeed(requirement);
        }
        else
        {
            context.Fail();
        }
    }
}