using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TV_IDP.Access.Models;
using TV_IDP.Services;

namespace TV_IDP.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class ChessController : ControllerBase
{
    private readonly AppDbContext _context;

    public ChessController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet(nameof(GetChessGameDetails))]
    public async Task<IActionResult> GetChessGameDetails(int gameId)
    {
        var chessGame = await _context.ChessGames.FirstOrDefaultAsync(x => x.Id == gameId);

        if (chessGame == null)
        {
            return BadRequest(new { message = "Bad request" });
        }

        var currentUser = HttpContext.Items["User"] as User;

        if (currentUser == null)
        {
            return BadRequest(new { message = "Bad request" });
        }

        var color = chessGame.WhiteUserId == currentUser.Id ? "white" : "black";

        var response = new
        {
            chessGame.Id,
            color,
        };

        return Ok(response);
    }
}