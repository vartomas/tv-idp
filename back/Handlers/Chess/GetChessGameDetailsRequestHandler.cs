using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TV_IDP.Access.Models;
using TV_IDP.Services;

namespace TV_IDP.Handlers.Chess
{
    public class GetChessGameDetailsRequestHandler
    {
        private readonly HttpContext _ctx;

        public GetChessGameDetailsRequestHandler(HttpContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<IActionResult> HandleAsync(int gameId)
        {
            var db = _ctx.RequestServices.GetRequiredService<AppDbContext>();
            var chessGame = await db.ChessGames.FirstOrDefaultAsync(x => x.Id == gameId);

            if (chessGame == null)
            {
                return new BadRequestObjectResult(new { message = "Bad request" });
            }

            var currentUser = _ctx.Items["User"] as User;

            if (currentUser == null)
            {
                return new BadRequestObjectResult(new { message = "Bad request" });
            }

            var color = chessGame.WhiteUserId == currentUser.Id ? "white" : "black";

            var response = new
            {
                chessGame.Id,
                color,
            };

            return new OkObjectResult(response);
        }
    }
}
