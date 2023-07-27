import { Navigate } from 'react-router-dom';
import { useUser } from '../core/state/useUser';
import { FC } from 'react';

interface Props {
  children: React.ReactNode;
}

const Protected: FC<Props> = ({ children }) => {
  const username = useUser((state) => state.username);
  if (!username) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default Protected;
