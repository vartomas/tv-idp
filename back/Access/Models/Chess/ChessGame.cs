﻿namespace TV_IDP.Access.Models.Chess;

public class ChessGame
{
    public int Id { get; set; }

    public int WhiteUserId { get; set; }

    public int BlackUserId { get; set; }

    public int TurnUserId { get; set; }

    public int? WinnerUserId { get; set; } = null;

    public bool Completed { get; set; } = false;
}

