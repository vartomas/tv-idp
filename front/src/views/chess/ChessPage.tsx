import { useParams } from 'react-router-dom';
import { FigurePosition, columns, rows } from './chessModel';
import BoardTile from './components/BoardTile';
import { useChess } from './hooks/useChess';
import { Image } from 'antd';
import { getImage, isSamePosition } from './utils/figure';

const ChessPage = () => {
  const params = useParams();

  const { playerColor, selectedFigure, possibleMoves, figuresPositions, selectFigure } = useChess(params.gameId);

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

  return (
    <div className="h-100 w-100">
      <div style={{ width: '100vmin', height: '100vmin' }} className={`m-auto p-3${black ? ' rotate-180' : ''}`}>
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

export default ChessPage;
