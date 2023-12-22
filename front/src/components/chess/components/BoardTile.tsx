import { FC } from 'react';
import { FigurePosition } from '../chessModel';

interface Props {
  selected: boolean;
  position: FigurePosition;
  showPossibleMove: boolean;
  showPossibleCapture: boolean;
  onSelect: (position: FigurePosition) => void;
  onMove: (position: FigurePosition) => void;
  children: React.ReactNode;
}

const BoardTile: FC<Props> = ({
  selected,
  position,
  showPossibleMove,
  showPossibleCapture,
  onSelect,
  onMove,
  children,
}) => {
  const getColor = () => {
    const light = 'bg-amber-200';
    const dark = 'bg-amber-500';

    return position[0].charCodeAt(0) % 2 === position[1] % 2 ? dark : light;
  };

  return (
    <div
      className={`flex items-center justify-center h-100 relative ${getColor()}`}
      style={{ width: 'calc(100% / 8)' }}
      onClick={() => (showPossibleMove || showPossibleCapture ? onMove(position) : onSelect(position))}
    >
      {selected && <div className="absolute bg-green-800 bg-opacity-20 top-0 bottom-0 left-0 right-0" />}
      {showPossibleMove && <div className="w-1/6 h-1/6 rounded-full bg-opacity-20 bg-black" />}
      {showPossibleCapture && (
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-opacity-20 bg-black">
          <div className={`w-full h-full rounded-3xl ${getColor()}`} />
        </div>
      )}
      {children}
    </div>
  );
};

export default BoardTile;
