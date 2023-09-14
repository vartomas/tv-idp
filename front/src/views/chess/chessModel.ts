export type FigureType = 'Pawn' | 'Rook' | 'Knight' | 'Bishop' | 'Queen' | 'King';

export type FigureColor = 'white' | 'black';

export type BoardColumn = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';

export type BoardRow = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type FigurePosition = [BoardColumn, BoardRow];

export interface ChessFigure {
  type: FigureType;
  color: FigureColor;
  position: FigurePosition;
  id: number;
  hasMoved: boolean;
  player: boolean;
}
