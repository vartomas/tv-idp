import { ChessFigure, FigurePosition, columns } from '../chessModel';
import { isSamePosition } from './figure';

const figureOnNextPosition = (nextPosition: FigurePosition, figuresPositions: ChessFigure[]) =>
  figuresPositions.find((figure) => isSamePosition(figure.position, nextPosition));

const outOfBoard = (nextPosition: FigurePosition) => nextPosition[1] < 1 || nextPosition[1] > 8 || !nextPosition[0];

const getPawnMoves = (figure: ChessFigure, figuresPositions: ChessFigure[]): FigurePosition[] => {
  const [column, row] = figure.position;
  const moves: FigurePosition[] = [];

  let allowedSteps = figure.hasMoved ? 1 : 2;
  let step = 1;

  while (allowedSteps > 0) {
    const nextPosition = (figure.color === 'white' ? [column, row + step] : [column, row - step]) as FigurePosition;
    if (outOfBoard(nextPosition) || figureOnNextPosition(nextPosition, figuresPositions)) {
      break;
    }

    moves.push(nextPosition);
    allowedSteps--;
    step++;
  }

  return moves;
};

const getRookMoves = (figure: ChessFigure, figuresPositions: ChessFigure[]): FigurePosition[] => {
  const [column, row] = figure.position;
  const moves: FigurePosition[] = [];

  let upStep = 1;
  while (upStep < 8) {
    const nextPosition = [column, row + upStep] as FigurePosition;
    if (figureOnNextPosition(nextPosition, figuresPositions) || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    upStep++;
  }

  let bottomStep = 1;
  while (bottomStep < 8) {
    const nextPosition = [column, row - bottomStep] as FigurePosition;
    if (figureOnNextPosition(nextPosition, figuresPositions) || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    bottomStep++;
  }

  let colIndexForRight = columns.indexOf(column);
  while (columns[colIndexForRight]) {
    const nextPosition = [columns[colIndexForRight + 1], row] as FigurePosition;
    if (figureOnNextPosition(nextPosition, figuresPositions) || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    colIndexForRight++;
  }

  let colIndexForLeft = columns.indexOf(column);
  while (columns[colIndexForLeft]) {
    const nextPosition = [columns[colIndexForLeft - 1], row] as FigurePosition;
    if (figureOnNextPosition(nextPosition, figuresPositions) || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    colIndexForLeft--;
  }

  return moves;
};

const getKnightMoves = (figure: ChessFigure, figuresPositions: ChessFigure[]): FigurePosition[] => {
  const [column, row] = figure.position;
  const moves: FigurePosition[] = [];
  const colIndex = columns.indexOf(column);

  const position1 = [columns[colIndex + 1], row + 2] as FigurePosition;
  if (!figureOnNextPosition(position1, figuresPositions) && !outOfBoard(position1)) {
    moves.push(position1);
  }

  const position2 = [columns[colIndex - 1], row + 2] as FigurePosition;
  if (!figureOnNextPosition(position2, figuresPositions) && !outOfBoard(position2)) {
    moves.push(position2);
  }

  const position3 = [columns[colIndex + 1], row - 2] as FigurePosition;
  if (!figureOnNextPosition(position3, figuresPositions) && !outOfBoard(position3)) {
    moves.push(position3);
  }

  const position4 = [columns[colIndex - 1], row - 2] as FigurePosition;
  if (!figureOnNextPosition(position4, figuresPositions) && !outOfBoard(position4)) {
    moves.push(position4);
  }

  const position5 = [columns[colIndex + 2], row + 1] as FigurePosition;
  if (!figureOnNextPosition(position5, figuresPositions) && !outOfBoard(position5)) {
    moves.push(position5);
  }

  const position6 = [columns[colIndex + 2], row - 1] as FigurePosition;
  if (!figureOnNextPosition(position6, figuresPositions) && !outOfBoard(position6)) {
    moves.push(position6);
  }

  const position7 = [columns[colIndex - 2], row + 1] as FigurePosition;
  if (!figureOnNextPosition(position7, figuresPositions) && !outOfBoard(position7)) {
    moves.push(position7);
  }

  const position8 = [columns[colIndex - 2], row - 1] as FigurePosition;
  if (!figureOnNextPosition(position8, figuresPositions) && !outOfBoard(position8)) {
    moves.push(position8);
  }

  return moves;
};

const getBishopMoves = (figure: ChessFigure, figuresPositions: ChessFigure[]): FigurePosition[] => {
  const [column, row] = figure.position;
  const moves: FigurePosition[] = [];

  let upRightStep = 1;
  while (upRightStep < 8) {
    const nextPosition = [columns[columns.indexOf(column) + upRightStep], row + upRightStep] as FigurePosition;
    if (figureOnNextPosition(nextPosition, figuresPositions) || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    upRightStep++;
  }

  let upLeftStep = 1;
  while (upLeftStep < 8) {
    const nextPosition = [columns[columns.indexOf(column) - upLeftStep], row + upLeftStep] as FigurePosition;
    if (figureOnNextPosition(nextPosition, figuresPositions) || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    upLeftStep++;
  }

  let bottomRightStep = 1;
  while (bottomRightStep < 8) {
    const nextPosition = [columns[columns.indexOf(column) + bottomRightStep], row - bottomRightStep] as FigurePosition;
    if (figureOnNextPosition(nextPosition, figuresPositions) || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    bottomRightStep++;
  }

  let bottomLeftStep = 1;
  while (bottomLeftStep < 8) {
    const nextPosition = [columns[columns.indexOf(column) - bottomLeftStep], row - bottomLeftStep] as FigurePosition;
    if (figureOnNextPosition(nextPosition, figuresPositions) || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    bottomLeftStep++;
  }

  return moves;
};

const getQueenMoves = (figure: ChessFigure, figuresPositions: ChessFigure[]): FigurePosition[] => {
  const [column, row] = figure.position;
  const moves: FigurePosition[] = [];

  let upStep = 1;
  while (upStep < 8) {
    const nextPosition = [column, row + upStep] as FigurePosition;
    if (figureOnNextPosition(nextPosition, figuresPositions) || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    upStep++;
  }

  let bottomStep = 1;
  while (bottomStep < 8) {
    const nextPosition = [column, row - bottomStep] as FigurePosition;
    if (figureOnNextPosition(nextPosition, figuresPositions) || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    bottomStep++;
  }

  let colIndexForRight = columns.indexOf(column);
  while (columns[colIndexForRight]) {
    const nextPosition = [columns[colIndexForRight + 1], row] as FigurePosition;
    if (figureOnNextPosition(nextPosition, figuresPositions) || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    colIndexForRight++;
  }

  let colIndexForLeft = columns.indexOf(column);
  while (columns[colIndexForLeft]) {
    const nextPosition = [columns[colIndexForLeft - 1], row] as FigurePosition;
    if (figureOnNextPosition(nextPosition, figuresPositions) || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    colIndexForLeft--;
  }

  let upRightStep = 1;
  while (upRightStep < 8) {
    const nextPosition = [columns[columns.indexOf(column) + upRightStep], row + upRightStep] as FigurePosition;
    if (figureOnNextPosition(nextPosition, figuresPositions) || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    upRightStep++;
  }

  let upLeftStep = 1;
  while (upLeftStep < 8) {
    const nextPosition = [columns[columns.indexOf(column) - upLeftStep], row + upLeftStep] as FigurePosition;
    if (figureOnNextPosition(nextPosition, figuresPositions) || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    upLeftStep++;
  }

  let bottomRightStep = 1;
  while (bottomRightStep < 8) {
    const nextPosition = [columns[columns.indexOf(column) + bottomRightStep], row - bottomRightStep] as FigurePosition;
    if (figureOnNextPosition(nextPosition, figuresPositions) || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    bottomRightStep++;
  }

  let bottomLeftStep = 1;
  while (bottomLeftStep < 8) {
    const nextPosition = [columns[columns.indexOf(column) - bottomLeftStep], row - bottomLeftStep] as FigurePosition;
    if (figureOnNextPosition(nextPosition, figuresPositions) || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    bottomLeftStep++;
  }

  return moves;
};

const getKingMoves = (figure: ChessFigure, figuresPositions: ChessFigure[]): FigurePosition[] => {
  const [column, row] = figure.position;
  const moves: FigurePosition[] = [];

  const position1 = [columns[columns.indexOf(column) + 1], row + 1] as FigurePosition;
  if (!figureOnNextPosition(position1, figuresPositions) && !outOfBoard(position1)) {
    moves.push(position1);
  }

  const position2 = [columns[columns.indexOf(column) - 1], row + 1] as FigurePosition;
  if (!figureOnNextPosition(position2, figuresPositions) && !outOfBoard(position2)) {
    moves.push(position2);
  }

  const position3 = [columns[columns.indexOf(column) + 1], row - 1] as FigurePosition;
  if (!figureOnNextPosition(position3, figuresPositions) && !outOfBoard(position3)) {
    moves.push(position3);
  }

  const position4 = [columns[columns.indexOf(column) - 1], row - 1] as FigurePosition;
  if (!figureOnNextPosition(position4, figuresPositions) && !outOfBoard(position4)) {
    moves.push(position4);
  }

  const position5 = [columns[columns.indexOf(column) + 1], row] as FigurePosition;
  if (!figureOnNextPosition(position5, figuresPositions) && !outOfBoard(position5)) {
    moves.push(position5);
  }

  const position6 = [columns[columns.indexOf(column) - 1], row] as FigurePosition;
  if (!figureOnNextPosition(position6, figuresPositions) && !outOfBoard(position6)) {
    moves.push(position6);
  }

  const position7 = [columns[columns.indexOf(column)], row + 1] as FigurePosition;
  if (!figureOnNextPosition(position7, figuresPositions) && !outOfBoard(position7)) {
    moves.push(position7);
  }

  const position8 = [columns[columns.indexOf(column)], row - 1] as FigurePosition;
  if (!figureOnNextPosition(position8, figuresPositions) && !outOfBoard(position8)) {
    moves.push(position8);
  }

  return moves;
};

export const getFigureMoves = (figure: ChessFigure, figuresPositions: ChessFigure[]): FigurePosition[] => {
  switch (figure.type) {
    case 'Pawn':
      return getPawnMoves(figure, figuresPositions);
    case 'Rook':
      return getRookMoves(figure, figuresPositions);
    case 'Knight':
      return getKnightMoves(figure, figuresPositions);
    case 'Bishop':
      return getBishopMoves(figure, figuresPositions);
    case 'Queen':
      return getQueenMoves(figure, figuresPositions);
    case 'King':
      return getKingMoves(figure, figuresPositions);
  }
};
