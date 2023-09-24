import { Breakpoint, Grid, Modal } from 'antd';
import { FC } from 'react';
import Chess from './chess/Chess';

interface Props {
  gameId: number | null;
  onClose: () => void;
}

const { useBreakpoint } = Grid;

const getBorderLength = (br: Partial<Record<Breakpoint, boolean>>) => {
  if (br.xl) {
    return 700;
  }

  if (br.lg) {
    return 600;
  }

  if (br.md) {
    return 400;
  }

  return 300;
};

const GameModal: FC<Props> = ({ gameId, onClose }) => {
  const br = useBreakpoint();

  const isModalOpen = !!gameId;
  const borderLength = getBorderLength(br);

  return (
    <Modal
      className="p-0"
      width={borderLength + 50}
      open={isModalOpen}
      footer={null}
      closable={false}
      onCancel={onClose}
    >
      <Chess gameId={gameId} borderLength={borderLength} />
    </Modal>
  );
};

export default GameModal;
