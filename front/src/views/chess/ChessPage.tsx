import { useParams } from 'react-router-dom';
import { BoardColumn, BoardRow, FigurePosition } from './chessModel';
import BoardTile from './components/BoardTile';
import { useChess } from './hooks/useChess';
import { Image } from 'antd';
import { getFigure } from './utils/figure';

const ChessPage = () => {
  const params = useParams();

  const { figuresPositions } = useChess();

  const columns: BoardColumn[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const rows: BoardRow[] = [1, 2, 3, 4, 5, 6, 7, 8];

  const renderFigure = (position: FigurePosition) => {
    const [col, row] = position;
    const figure = figuresPositions.find((x) => x.position[0] === col && x.position[1] === row);
    if (!figure) {
      return null;
    }

    return (
      <span>
        <Image className="select-none" src={getFigure(figure)} alt={`${figure.color}-${figure.type}`} preview={false} />
      </span>
    );
  };

  return (
    <div className="h-100 w-100">
      <div style={{ width: '100vmin', height: '100vmin' }} className="m-auto p-3">
        {rows.reverse().map((row) => (
          <div className="flex" style={{ height: 'calc(100% / 8)' }}>
            {columns.map((col) => (
              <BoardTile position={[col, row]}>{renderFigure([col, row])}</BoardTile>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChessPage;
