namespace TV_IDP.Authorization;

using TV_IDP.Services;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;

    public JwtMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context, IUserService userService, IJwt jwt)
    {
        var token = context.Request.Cookies["token"];
        var userId = jwt.ValidateJwtToken(token);
        if (userId != null)
        {
            context.Items["User"] = await userService.GetById(userId.Value);
        }

        await _next(context);
    }
}