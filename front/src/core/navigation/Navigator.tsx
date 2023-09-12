import { Route, Routes } from 'react-router-dom';
import Loader from '../../views/Loader';
import { useEffect, useState } from 'react';
import Login from '../../views/Login';
import { useAuth } from '../hooks/useAuth';
import Register from '../../views/Register';
import ChatPage from '../../views/chat/ChatPage';
import { useUser } from '../state/useUser';
import PageNotFound from '../../views/PageNotFound';
import ChessPage from '../../views/chess/ChessPage';

const Navigator = () => {
  const username = useUser((state) => state.username);
  const [initializing, setInitializing] = useState(true);
  const { initializeUser } = useAuth();

  useEffect(() => {
    const checkUser = async () => {
      await initializeUser();
      setInitializing(false);
    };

    checkUser();
  }, [initializeUser]);

  if (initializing) {
    return <Loader />;
  }

  const unauthorizedRoutes = [
    <Route key="/" path="/" element={<Login />} />,
    <Route key="/register" path="/register" element={<Register />} />,
  ];

  const authorizedRoutes = [
    <Route key="/" path="/" element={<ChatPage />} />,
    <Route key="chess" path="chess/:gameId" element={<ChessPage />} />,
  ];

  return (
    <Routes>
      {username ? authorizedRoutes : unauthorizedRoutes}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default Navigator;
