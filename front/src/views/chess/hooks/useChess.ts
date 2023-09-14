import { useState } from 'react';
import { ChessFigure } from '../chessModel';
import { startingPositions } from '../utils/figure';

export const useChess = () => {
  const [figuresPositions, setFiguresPositions] = useState<ChessFigure[]>(startingPositions);

  return { figuresPositions, setFiguresPositions };
};
