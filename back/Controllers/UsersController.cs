namespace TV_IDP.Controllers;
using Microsoft.AspNetCore.Mvc;
using TV_IDP.Authorization;
using TV_IDP.Services;
using TV_IDP.Models;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [AllowAnonymous]
    [HttpPost(nameof(Register))]
    public IActionResult Register(UserDto request)
    {
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var response = _userService.Create(request);

        if (response == null)
            return BadRequest(new { message = "Username already exists" });

        return Ok(response);
    }

    [AllowAnonymous]
    [HttpPost(nameof(Login))]
    public IActionResult Login(UserDto request)
    {
        var response = _userService.LogIn(request);

        if (response == null)
            return BadRequest(new { message = "Username or password is incorrect" });

        return Ok(response);
    }
}
