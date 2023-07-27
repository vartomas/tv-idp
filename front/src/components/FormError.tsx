import { FC } from 'react';

interface Props {
  error: string | undefined;
  renderEmpty?: boolean;
}

const FormError: FC<Props> = ({ error, renderEmpty = false }) => {
  if (!error && !renderEmpty) {
    return null;
  }

  return (
    <div style={{ height: '18px' }}>
      <p className="text-xs text-rose-500 m-0">{error}</p>
    </div>
  );
};

export default FormError;
