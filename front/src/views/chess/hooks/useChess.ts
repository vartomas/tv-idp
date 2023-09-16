import { useState } from 'react';
import { ChessFigure, FigurePosition } from '../chessModel';
import { isSamePosition, startingPositions } from '../utils/figure';

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

  return { playerColor, selectedFigure, figuresPositions, selectFigure };
};
