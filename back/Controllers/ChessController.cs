using Microsoft.AspNetCore.Mvc;
using TV_IDP.Authorization;
using TV_IDP.Handlers.Chess;

namespace TV_IDP.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class ChessController : ControllerBase
{
    [HttpGet(nameof(GetChessGameDetails))]
    public async Task<IActionResult> GetChessGameDetails(int gameId)
    {
        var handler = new GetChessGameDetailsRequestHandler(HttpContext);
        return await handler.HandleAsync(gameId);
    }
}