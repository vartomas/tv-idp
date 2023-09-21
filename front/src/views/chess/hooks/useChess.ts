import { useState } from 'react';
import { ChessFigure, FigurePosition } from '../chessModel';
import { isSamePosition, startingPositions } from '../utils/figure';
import { getFigureMoves } from '../utils/figureMoves';

export const useChess = (gameId: string | undefined) => {
  const [playerColor, setPlayerColor] = useState<'white' | 'black'>('black');
  const [figuresPositions, setFiguresPositions] = useState<ChessFigure[]>(startingPositions);
  const [selectedFigure, setSelectedFigure] = useState<ChessFigure | null>(null);

  const selectFigure = (position: FigurePosition) => {
    const foundFigure = figuresPositions.find((figure) => isSamePosition(figure.position, position));
    if (selectedFigure && foundFigure && foundFigure.id === selectedFigure.id) {
      setSelectedFigure(null);
      return;
    }

    setSelectedFigure(foundFigure || null);
  };

  const possibleMoves = !!selectedFigure && getFigureMoves(selectedFigure, figuresPositions);

  const moveFigure = (position: FigurePosition) => {
    const figureInPosition = figuresPositions.find((figure) => isSamePosition(figure.position, position));

    const updatedPositions = figuresPositions.map((x) => {
      if (x.id === selectedFigure?.id) {
        return {
          ...x,
          position,
          hasMoved: true,
        };
      }

      return x;
    });

    if (figureInPosition) {
      const index = figuresPositions.findIndex((figure) => figure.id === figureInPosition.id);
      updatedPositions.splice(index, 1);
    }

    setSelectedFigure(null);
    setFiguresPositions(updatedPositions);
  };

  return { playerColor, selectedFigure, possibleMoves, figuresPositions, selectFigure, moveFigure };
};
