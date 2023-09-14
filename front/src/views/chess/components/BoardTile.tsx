import { FC } from 'react';
import { FigurePosition } from '../chessModel';

interface Props {
  position: FigurePosition;
  children?: React.ReactNode;
}

const BoardTile: FC<Props> = ({ position, children }) => {
  const getColor = () => {
    const light = 'bg-amber-200';
    const dark = 'bg-amber-500';

    return position[0].charCodeAt(0) % 2 === position[1] % 2 ? dark : light;
  };

  return (
    <div className={`flex items-center justify-center h-100 ${getColor()}`} style={{ width: 'calc(100% / 8)' }}>
      {children}
    </div>
  );
};

export default BoardTile;
