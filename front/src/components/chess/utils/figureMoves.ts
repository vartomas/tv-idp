import { AvailableFigureMoves, ChessFigure, FigurePosition, columns } from '../chessModel';
import { isSamePosition } from './figure';

const figureOnNextPosition = (nextPosition: FigurePosition, figuresPositions: ChessFigure[]) =>
  figuresPositions.find((figure) => isSamePosition(figure.position, nextPosition));

const outOfBoard = (nextPosition: FigurePosition) => nextPosition[1] < 1 || nextPosition[1] > 8 || !nextPosition[0];

const getPawnMoves = (figure: ChessFigure, figuresPositions: ChessFigure[]): AvailableFigureMoves => {
  const [column, row] = figure.position;
  const moves: FigurePosition[] = [];
  const captures: FigurePosition[] = [];

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

  const rightCapturePosition = (
    figure.color === 'white'
      ? [columns[columns.indexOf(column) + 1], row + 1]
      : [columns[columns.indexOf(column) + 1], row - 1]
  ) as FigurePosition;
  const figureOnRight = figureOnNextPosition(rightCapturePosition, figuresPositions);
  if (figureOnRight && figureOnRight.color !== figure.color) {
    captures.push(rightCapturePosition);
  }

  const leftCapturePosition = (
    figure.color === 'white'
      ? [columns[columns.indexOf(column) - 1], row + 1]
      : [columns[columns.indexOf(column) - 1], row - 1]
  ) as FigurePosition;
  const figureOnLeft = figureOnNextPosition(leftCapturePosition, figuresPositions);
  if (figureOnLeft && figureOnLeft.color !== figure.color) {
    captures.push(leftCapturePosition);
  }

  return {
    moves,
    captures,
  };
};

const getRookMoves = (figure: ChessFigure, figuresPositions: ChessFigure[]): AvailableFigureMoves => {
  const [column, row] = figure.position;
  const moves: FigurePosition[] = [];
  const captures: FigurePosition[] = [];

  let upStep = 1;
  while (upStep < 8) {
    const nextPosition = [column, row + upStep] as FigurePosition;
    const figureOnPosition = figureOnNextPosition(nextPosition, figuresPositions);
    if (figureOnPosition && figureOnPosition.color !== figure.color) {
      captures.push(nextPosition);
      break;
    }

    if (figureOnPosition || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    upStep++;
  }

  let bottomStep = 1;
  while (bottomStep < 8) {
    const nextPosition = [column, row - bottomStep] as FigurePosition;
    const figureOnPosition = figureOnNextPosition(nextPosition, figuresPositions);
    if (figureOnPosition && figureOnPosition.color !== figure.color) {
      captures.push(nextPosition);
      break;
    }

    if (figureOnPosition || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    bottomStep++;
  }

  let colIndexForRight = columns.indexOf(column);
  while (columns[colIndexForRight]) {
    const nextPosition = [columns[colIndexForRight + 1], row] as FigurePosition;
    const figureOnPosition = figureOnNextPosition(nextPosition, figuresPositions);
    if (figureOnPosition && figureOnPosition.color !== figure.color) {
      captures.push(nextPosition);
      break;
    }

    if (figureOnPosition || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    colIndexForRight++;
  }

  let colIndexForLeft = columns.indexOf(column);
  while (columns[colIndexForLeft]) {
    const nextPosition = [columns[colIndexForLeft - 1], row] as FigurePosition;
    const figureOnPosition = figureOnNextPosition(nextPosition, figuresPositions);
    if (figureOnPosition && figureOnPosition.color !== figure.color) {
      captures.push(nextPosition);
      break;
    }

    if (figureOnPosition || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    colIndexForLeft--;
  }

  return {
    moves,
    captures,
  };
};

const getKnightMoves = (figure: ChessFigure, figuresPositions: ChessFigure[]): AvailableFigureMoves => {
  const [column, row] = figure.position;
  const moves: FigurePosition[] = [];
  const captures: FigurePosition[] = [];
  const colIndex = columns.indexOf(column);

  const position1 = [columns[colIndex + 1], row + 2] as FigurePosition;
  const figureOnPosition1 = figureOnNextPosition(position1, figuresPositions);
  if (figureOnPosition1 && figureOnPosition1.color !== figure.color) {
    captures.push(position1);
  }

  if (!figureOnPosition1 && !outOfBoard(position1)) {
    moves.push(position1);
  }

  const position2 = [columns[colIndex - 1], row + 2] as FigurePosition;
  const figureOnPosition2 = figureOnNextPosition(position2, figuresPositions);
  if (figureOnPosition2 && figureOnPosition2.color !== figure.color) {
    captures.push(position2);
  }

  if (!figureOnNextPosition(position2, figuresPositions) && !outOfBoard(position2)) {
    moves.push(position2);
  }

  const position3 = [columns[colIndex + 1], row - 2] as FigurePosition;
  const figureOnPosition3 = figureOnNextPosition(position3, figuresPositions);
  if (figureOnPosition3 && figureOnPosition3.color !== figure.color) {
    captures.push(position3);
  }

  if (!figureOnNextPosition(position3, figuresPositions) && !outOfBoard(position3)) {
    moves.push(position3);
  }

  const position4 = [columns[colIndex - 1], row - 2] as FigurePosition;
  const figureOnPosition4 = figureOnNextPosition(position4, figuresPositions);
  if (figureOnPosition4 && figureOnPosition4.color !== figure.color) {
    captures.push(position4);
  }

  if (!figureOnNextPosition(position4, figuresPositions) && !outOfBoard(position4)) {
    moves.push(position4);
  }

  const position5 = [columns[colIndex + 2], row + 1] as FigurePosition;
  const figureOnPosition5 = figureOnNextPosition(position5, figuresPositions);
  if (figureOnPosition5 && figureOnPosition5.color !== figure.color) {
    captures.push(position5);
  }

  if (!figureOnNextPosition(position5, figuresPositions) && !outOfBoard(position5)) {
    moves.push(position5);
  }

  const position6 = [columns[colIndex + 2], row - 1] as FigurePosition;
  const figureOnPosition6 = figureOnNextPosition(position6, figuresPositions);
  if (figureOnPosition6 && figureOnPosition6.color !== figure.color) {
    captures.push(position6);
  }

  if (!figureOnNextPosition(position6, figuresPositions) && !outOfBoard(position6)) {
    moves.push(position6);
  }

  const position7 = [columns[colIndex - 2], row + 1] as FigurePosition;
  const figureOnPosition7 = figureOnNextPosition(position7, figuresPositions);
  if (figureOnPosition7 && figureOnPosition7.color !== figure.color) {
    captures.push(position7);
  }

  if (!figureOnNextPosition(position7, figuresPositions) && !outOfBoard(position7)) {
    moves.push(position7);
  }

  const position8 = [columns[colIndex - 2], row - 1] as FigurePosition;
  const figureOnPosition8 = figureOnNextPosition(position8, figuresPositions);
  if (figureOnPosition8 && figureOnPosition8.color !== figure.color) {
    captures.push(position8);
  }

  if (!figureOnNextPosition(position8, figuresPositions) && !outOfBoard(position8)) {
    moves.push(position8);
  }

  return {
    moves,
    captures,
  };
};

const getBishopMoves = (figure: ChessFigure, figuresPositions: ChessFigure[]): AvailableFigureMoves => {
  const [column, row] = figure.position;
  const moves: FigurePosition[] = [];
  const captures: FigurePosition[] = [];

  let upRightStep = 1;
  while (upRightStep < 8) {
    const nextPosition = [columns[columns.indexOf(column) + upRightStep], row + upRightStep] as FigurePosition;
    const figureOnPosition = figureOnNextPosition(nextPosition, figuresPositions);
    if (figureOnPosition && figureOnPosition.color !== figure.color) {
      captures.push(nextPosition);
      break;
    }

    if (figureOnPosition || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    upRightStep++;
  }

  let upLeftStep = 1;
  while (upLeftStep < 8) {
    const nextPosition = [columns[columns.indexOf(column) - upLeftStep], row + upLeftStep] as FigurePosition;
    const figureOnPosition = figureOnNextPosition(nextPosition, figuresPositions);
    if (figureOnPosition && figureOnPosition.color !== figure.color) {
      captures.push(nextPosition);
      break;
    }

    if (figureOnPosition || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    upLeftStep++;
  }

  let bottomRightStep = 1;
  while (bottomRightStep < 8) {
    const nextPosition = [columns[columns.indexOf(column) + bottomRightStep], row - bottomRightStep] as FigurePosition;
    const figureOnPosition = figureOnNextPosition(nextPosition, figuresPositions);
    if (figureOnPosition && figureOnPosition.color !== figure.color) {
      captures.push(nextPosition);
      break;
    }

    if (figureOnPosition || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    bottomRightStep++;
  }

  let bottomLeftStep = 1;
  while (bottomLeftStep < 8) {
    const nextPosition = [columns[columns.indexOf(column) - bottomLeftStep], row - bottomLeftStep] as FigurePosition;
    const figureOnPosition = figureOnNextPosition(nextPosition, figuresPositions);
    if (figureOnPosition && figureOnPosition.color !== figure.color) {
      captures.push(nextPosition);
      break;
    }

    if (figureOnPosition || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    bottomLeftStep++;
  }

  return {
    moves,
    captures,
  };
};

const getQueenMoves = (figure: ChessFigure, figuresPositions: ChessFigure[]): AvailableFigureMoves => {
  const [column, row] = figure.position;
  const moves: FigurePosition[] = [];
  const captures: FigurePosition[] = [];

  let upStep = 1;
  while (upStep < 8) {
    const nextPosition = [column, row + upStep] as FigurePosition;
    const figureOnPosition = figureOnNextPosition(nextPosition, figuresPositions);
    if (figureOnPosition && figureOnPosition.color !== figure.color) {
      captures.push(nextPosition);
      break;
    }

    if (figureOnPosition || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    upStep++;
  }

  let bottomStep = 1;
  while (bottomStep < 8) {
    const nextPosition = [column, row - bottomStep] as FigurePosition;
    const figureOnPosition = figureOnNextPosition(nextPosition, figuresPositions);
    if (figureOnPosition && figureOnPosition.color !== figure.color) {
      captures.push(nextPosition);
      break;
    }

    if (figureOnPosition || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    bottomStep++;
  }

  let colIndexForRight = columns.indexOf(column);
  while (columns[colIndexForRight]) {
    const nextPosition = [columns[colIndexForRight + 1], row] as FigurePosition;
    const figureOnPosition = figureOnNextPosition(nextPosition, figuresPositions);
    if (figureOnPosition && figureOnPosition.color !== figure.color) {
      captures.push(nextPosition);
      break;
    }

    if (figureOnPosition || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    colIndexForRight++;
  }

  let colIndexForLeft = columns.indexOf(column);
  while (columns[colIndexForLeft]) {
    const nextPosition = [columns[colIndexForLeft - 1], row] as FigurePosition;
    const figureOnPosition = figureOnNextPosition(nextPosition, figuresPositions);
    if (figureOnPosition && figureOnPosition.color !== figure.color) {
      captures.push(nextPosition);
      break;
    }

    if (figureOnPosition || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    colIndexForLeft--;
  }

  let upRightStep = 1;
  while (upRightStep < 8) {
    const nextPosition = [columns[columns.indexOf(column) + upRightStep], row + upRightStep] as FigurePosition;
    const figureOnPosition = figureOnNextPosition(nextPosition, figuresPositions);
    if (figureOnPosition && figureOnPosition.color !== figure.color) {
      captures.push(nextPosition);
      break;
    }

    if (figureOnPosition || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    upRightStep++;
  }

  let upLeftStep = 1;
  while (upLeftStep < 8) {
    const nextPosition = [columns[columns.indexOf(column) - upLeftStep], row + upLeftStep] as FigurePosition;
    const figureOnPosition = figureOnNextPosition(nextPosition, figuresPositions);
    if (figureOnPosition && figureOnPosition.color !== figure.color) {
      captures.push(nextPosition);
      break;
    }

    if (figureOnPosition || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    upLeftStep++;
  }

  let bottomRightStep = 1;
  while (bottomRightStep < 8) {
    const nextPosition = [columns[columns.indexOf(column) + bottomRightStep], row - bottomRightStep] as FigurePosition;
    const figureOnPosition = figureOnNextPosition(nextPosition, figuresPositions);
    if (figureOnPosition && figureOnPosition.color !== figure.color) {
      captures.push(nextPosition);
      break;
    }

    if (figureOnPosition || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    bottomRightStep++;
  }

  let bottomLeftStep = 1;
  while (bottomLeftStep < 8) {
    const nextPosition = [columns[columns.indexOf(column) - bottomLeftStep], row - bottomLeftStep] as FigurePosition;
    const figureOnPosition = figureOnNextPosition(nextPosition, figuresPositions);
    if (figureOnPosition && figureOnPosition.color !== figure.color) {
      captures.push(nextPosition);
      break;
    }

    if (figureOnPosition || outOfBoard(nextPosition)) {
      break;
    }

    moves.push(nextPosition);
    bottomLeftStep++;
  }

  return {
    moves,
    captures,
  };
};

const getKingMoves = (figure: ChessFigure, figuresPositions: ChessFigure[]): AvailableFigureMoves => {
  const [column, row] = figure.position;
  const moves: FigurePosition[] = [];
  const captures: FigurePosition[] = [];

  const position1 = [columns[columns.indexOf(column) + 1], row + 1] as FigurePosition;
  const figureOnPosition1 = figureOnNextPosition(position1, figuresPositions);
  if (figureOnPosition1 && figureOnPosition1.color !== figure.color) {
    captures.push(position1);
  }

  if (!figureOnPosition1 && !outOfBoard(position1)) {
    moves.push(position1);
  }

  const position2 = [columns[columns.indexOf(column) - 1], row + 1] as FigurePosition;
  const figureOnPosition2 = figureOnNextPosition(position2, figuresPositions);
  if (figureOnPosition2 && figureOnPosition2.color !== figure.color) {
    captures.push(position2);
  }

  if (!figureOnPosition2 && !outOfBoard(position2)) {
    moves.push(position2);
  }

  const position3 = [columns[columns.indexOf(column) + 1], row - 1] as FigurePosition;
  const figureOnPosition3 = figureOnNextPosition(position3, figuresPositions);
  if (figureOnPosition3 && figureOnPosition3.color !== figure.color) {
    captures.push(position3);
  }

  if (!figureOnPosition3 && !outOfBoard(position3)) {
    moves.push(position3);
  }

  const position4 = [columns[columns.indexOf(column) - 1], row - 1] as FigurePosition;
  const figureOnPosition4 = figureOnNextPosition(position4, figuresPositions);
  if (figureOnPosition4 && figureOnPosition4.color !== figure.color) {
    captures.push(position4);
  }

  if (!figureOnPosition4 && !outOfBoard(position4)) {
    moves.push(position4);
  }

  const position5 = [columns[columns.indexOf(column) + 1], row] as FigurePosition;
  const figureOnPosition5 = figureOnNextPosition(position5, figuresPositions);
  if (figureOnPosition5 && figureOnPosition5.color !== figure.color) {
    captures.push(position5);
  }

  if (!figureOnPosition5 && !outOfBoard(position5)) {
    moves.push(position5);
  }

  const position6 = [columns[columns.indexOf(column) - 1], row] as FigurePosition;
  const figureOnPosition6 = figureOnNextPosition(position6, figuresPositions);
  if (figureOnPosition6 && figureOnPosition6.color !== figure.color) {
    captures.push(position6);
  }

  if (!figureOnPosition6 && !outOfBoard(position6)) {
    moves.push(position6);
  }

  const position7 = [columns[columns.indexOf(column)], row + 1] as FigurePosition;
  const figureOnPosition7 = figureOnNextPosition(position7, figuresPositions);
  if (figureOnPosition7 && figureOnPosition7.color !== figure.color) {
    captures.push(position7);
  }

  if (!figureOnPosition7 && !outOfBoard(position7)) {
    moves.push(position7);
  }

  const position8 = [columns[columns.indexOf(column)], row - 1] as FigurePosition;
  const figureOnPosition8 = figureOnNextPosition(position8, figuresPositions);
  if (figureOnPosition8 && figureOnPosition8.color !== figure.color) {
    captures.push(position8);
  }

  if (!figureOnPosition8 && !outOfBoard(position8)) {
    moves.push(position8);
  }

  return {
    moves,
    captures,
  };
};

export const getFigureMoves = (figure: ChessFigure, figuresPositions: ChessFigure[]): AvailableFigureMoves => {
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
