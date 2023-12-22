import { ChessFigure, FigurePosition } from '../chessModel';
import whitePawn from '../../../assets/figures/pawn_white.png';
import blackPawn from '../../../assets/figures/pawn_black.png';
import whiteRook from '../../../assets/figures/rook_white.png';
import blackRook from '../../../assets/figures/rook_black.png';
import whiteKnight from '../../../assets/figures/knight_white.png';
import blackKnight from '../../../assets/figures/knight_black.png';
import whiteBishop from '../../../assets/figures/bishop_white.png';
import blackBishop from '../../../assets/figures/bishop_black.png';
import whiteQueen from '../../../assets/figures/queen_white.png';
import blackQueen from '../../../assets/figures/queen_black.png';
import whiteKing from '../../../assets/figures/king_white.png';
import blackKing from '../../../assets/figures/king_black.png';

export const getImage = (figure: ChessFigure) => {
  switch (figure.type) {
    case 'Pawn':
      return figure.color === 'white' ? whitePawn : blackPawn;
    case 'Rook':
      return figure.color === 'white' ? whiteRook : blackRook;
    case 'Knight':
      return figure.color === 'white' ? whiteKnight : blackKnight;
    case 'Bishop':
      return figure.color === 'white' ? whiteBishop : blackBishop;
    case 'Queen':
      return figure.color === 'white' ? whiteQueen : blackQueen;
    case 'King':
      return figure.color === 'white' ? whiteKing : blackKing;
  }
};

export const isSamePosition = (position1: FigurePosition, position2: FigurePosition) =>
  position1[0] === position2[0] && position1[1] === position2[1];

const createFigure = (
  type: ChessFigure['type'],
  color: ChessFigure['color'],
  position: ChessFigure['position'],
  id: number,
  hasMoved: boolean,
  player: boolean
): ChessFigure => ({
  type,
  color,
  position,
  id,
  hasMoved,
  player,
});

export const startingPositions: ChessFigure[] = [
  createFigure('Rook', 'white', ['a', 1], 1, false, true),
  createFigure('Knight', 'white', ['b', 1], 2, false, true),
  createFigure('Bishop', 'white', ['c', 1], 3, false, true),
  createFigure('Queen', 'white', ['d', 1], 4, false, true),
  createFigure('King', 'white', ['e', 1], 5, false, true),
  createFigure('Bishop', 'white', ['f', 1], 6, false, true),
  createFigure('Knight', 'white', ['g', 1], 7, false, true),
  createFigure('Rook', 'white', ['h', 1], 8, false, true),
  createFigure('Pawn', 'white', ['a', 2], 9, false, true),
  createFigure('Pawn', 'white', ['b', 2], 10, false, true),
  createFigure('Pawn', 'white', ['c', 2], 11, false, true),
  createFigure('Pawn', 'white', ['d', 2], 12, false, true),
  createFigure('Pawn', 'white', ['e', 2], 13, false, true),
  createFigure('Pawn', 'white', ['f', 2], 14, false, true),
  createFigure('Pawn', 'white', ['g', 2], 15, false, true),
  createFigure('Pawn', 'white', ['h', 2], 16, false, true),
  createFigure('Rook', 'black', ['a', 8], 17, false, false),
  createFigure('Knight', 'black', ['b', 8], 18, false, false),
  createFigure('Bishop', 'black', ['c', 8], 19, false, false),
  createFigure('Queen', 'black', ['d', 8], 20, false, false),
  createFigure('King', 'black', ['e', 8], 21, false, false),
  createFigure('Bishop', 'black', ['f', 8], 22, false, false),
  createFigure('Knight', 'black', ['g', 8], 23, false, false),
  createFigure('Rook', 'black', ['h', 8], 24, false, false),
  createFigure('Pawn', 'black', ['a', 7], 25, false, false),
  createFigure('Pawn', 'black', ['b', 7], 26, false, false),
  createFigure('Pawn', 'black', ['c', 7], 27, false, false),
  createFigure('Pawn', 'black', ['d', 7], 28, false, false),
  createFigure('Pawn', 'black', ['e', 7], 29, false, false),
  createFigure('Pawn', 'black', ['f', 7], 30, false, false),
  createFigure('Pawn', 'black', ['g', 7], 31, false, false),
  createFigure('Pawn', 'black', ['h', 7], 32, false, false),
];
