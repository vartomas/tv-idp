export type FigureType = 'Pawn' | 'Rook' | 'Knight' | 'Bishop' | 'Queen' | 'King';

export type FigureColor = 'white' | 'black';

export type BoardColumn = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';

export type BoardRow = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type FigurePosition = [BoardColumn, BoardRow];

export interface FigurePositionDto {
  column: BoardColumn;
  row: BoardRow;
}

export interface ChessFigure {
  type: FigureType;
  color: FigureColor;
  position: FigurePosition;
  id: number;
  hasMoved: boolean;
  player: boolean;
}

export const columns: BoardColumn[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const rows: BoardRow[] = [8, 7, 6, 5, 4, 3, 2, 1];

export interface AvailableFigureMoves {
  moves: FigurePosition[];
  captures: FigurePosition[];
}

export interface ChessGameDto {
  id: number;
  color: 'white' | 'black';
}

export interface InviteMessage {
  id: number;
  invitedBy: string;
}

export interface FigureMove {
  from: FigurePosition;
  to: FigurePosition;
}

export interface FigureMoveDto {
  from: FigurePositionDto;
  to: FigurePositionDto;
}

export interface GameStartMessage {
  id: number;
  currentTurn: boolean;
}
