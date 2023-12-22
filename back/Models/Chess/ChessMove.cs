namespace TV_IDP.Models.Chess;

public class ChessMove
{
    public required FigurePosition From { get; set; }

    public required FigurePosition To { get; set; }

    public int MoveByPlayerId { get; set; }
}