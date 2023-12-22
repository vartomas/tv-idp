using TV_IDP.Models.Chess;
using TV_IDP.Utils;

namespace TV_IDP.Services;

public sealed class ChessGames
{
    private static readonly Dictionary<int, LiveChessGame> games = new();

    public void AddGame(LiveChessGame game)
    {
        lock (games)
        {
            if (games.ContainsKey(game.Id))
            {
                throw new CustomException("Game already started");
            }

            games.Add(game.Id, game);
        }
    }

    public void RemoveGame(LiveChessGame game)
    {
        lock (games)
        {
            if (!games.ContainsKey(game.Id))
            {
                throw new CustomException("Game not found");
            }

            games.Remove(game.Id);
        }
    }

    public LiveChessGame GetGame(int id)
    {
        lock (games)
        {
            if (!games.ContainsKey(id))
            {
                throw new CustomException("Game not found");
            }

            return games[id];
        }
    }
}