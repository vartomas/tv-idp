import { FigurePosition, columns, rows } from './chessModel';
import BoardTile from './components/BoardTile';
import { useChess } from './hooks/useChess';
import { Image } from 'antd';
import { getImage, isSamePosition } from './utils/figure';
import { FC } from 'react';
import GameLoader from '../GameLoader';

interface Props {
  gameId: number;
  borderLength: number;
}

const Chess: FC<Props> = ({ gameId, borderLength }) => {
  const { playerColor, selectedFigure, possibleMoves, figuresPositions, isLoading, selectFigure, moveFigure } =
    useChess(gameId);

  const black = playerColor === 'black';

  const renderFigure = (position: FigurePosition) => {
    const figure = figuresPositions.find((x) => isSamePosition(x.position, position));
    if (!figure) {
      return null;
    }

    return (
      <span>
        <Image
          className={`select-none${black ? ' rotate-180' : ''}`}
          src={getImage(figure)}
          alt={`${figure.color}-${figure.type}`}
          preview={false}
        />
      </span>
    );
  };

  if (isLoading) {
    return <GameLoader />;
  }

  return (
    <div className="h-100 w-100">
      <div style={{ width: borderLength, height: borderLength }} className={`m-auto p-3${black ? ' rotate-180' : ''}`}>
        {rows.map((row) => (
          <div key={row} className="flex" style={{ height: 'calc(100% / 8)' }}>
            {columns.map((col) => (
              <BoardTile
                key={`${col}-${row}`}
                selected={!!selectedFigure && isSamePosition(selectedFigure.position, [col, row])}
                position={[col, row]}
                showPossibleMove={possibleMoves && possibleMoves.move.some((x) => isSamePosition(x, [col, row]))}
                showPossibleCapture={possibleMoves && possibleMoves.capture.some((x) => isSamePosition(x, [col, row]))}
                onSelect={selectFigure}
                onMove={moveFigure}
              >
                {renderFigure([col, row])}
              </BoardTile>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chess;
