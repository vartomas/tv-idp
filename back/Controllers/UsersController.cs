﻿namespace TV_IDP.Controllers;

using Microsoft.AspNetCore.Mvc;
using TV_IDP.Authorization;
using TV_IDP.Services;
using TV_IDP.Models.Auth;
using TV_IDP.Access.Models;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _users;

    public UsersController(IUserService users)
    {
        _users = users;
    }

    [AllowAnonymous]
    [HttpPost(nameof(Register))]
    public async Task<IActionResult> Register(AuthRequest request)
    {
        var response = await _users.Create(request);
        if (response == null)
        {
            return BadRequest(new { message = "Username already exists" });
        }

        var option = new CookieOptions
        {
            Expires = DateTime.Now.AddDays(7)
        };
        Response.Cookies.Append("token", response.Token, option);

        return Ok(new { response.Id, response.Username });
    }

    [AllowAnonymous]
    [HttpPost(nameof(Login))]
    public async Task<IActionResult> Login(AuthRequest request)
    {
        var response = await _users.LogIn(request);
        if (response == null)
            return BadRequest(new { message = "Username or password is incorrect" });

        var option = new CookieOptions
        {
            Expires = DateTime.Now.AddDays(7)
        };
        Response.Cookies.Append("token", response.Token, option);

        return Ok(new { response.Id, response.Username });
    }

    [HttpGet(nameof(Check))]
    public IActionResult Check()
    {
        var user = HttpContext.Items["User"];
        var res = new { ((User)user!).Id, ((User)user!).Username };
        return Ok(res);
    }
}
