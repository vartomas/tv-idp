namespace TV_IDP.Models.Chess;

public class LiveChessGame
{
    public int Id { get; set; }

    public int WhiteUserId { get; set; }

    public int BlackUserId { get; set; }

    public int TurnUserId { get; set; }
}