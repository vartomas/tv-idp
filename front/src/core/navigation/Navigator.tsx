import { Route, Routes } from 'react-router-dom';
import Loader from '../../views/Loader';
import { useEffect, useState } from 'react';
import Login from '../../views/Login';
import { useAuth } from '../hooks/useAuth';
import Register from '../../views/Register';
import ChatPage from '../../views/chat/ChatPage';
import { useUser } from '../state/useUser';
import PageNotFound from '../../views/PageNotFound';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useConnection } from '../state/useConnection';

const Navigator = () => {
  const username = useUser((state) => state.username);
  const setConnection = useConnection((state) => state.setConnection);
  const [initializing, setInitializing] = useState(true);
  const { initializeUser } = useAuth();

  useEffect(() => {
    const checkUser = async () => {
      await initializeUser();
      setInitializing(false);
    };

    checkUser();
  }, [initializeUser]);

  useEffect(() => {
    if (username) {
      const newConnection = new HubConnectionBuilder().withUrl('/ws').withAutomaticReconnect().build();
      newConnection
        .start()
        .then(() => {
          setConnection(newConnection);
        })
        .catch((err) => console.error(err));
    }
  }, [username, setConnection]);

  if (initializing) {
    return <Loader />;
  }

  const unauthorizedRoutes = [
    <Route key="/" path="/" element={<Login />} />,
    <Route key="/register" path="/register" element={<Register />} />,
  ];

  const authorizedRoutes = [<Route key="/" path="/" element={<ChatPage />} />];

  return (
    <Routes>
      {username ? authorizedRoutes : unauthorizedRoutes}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default Navigator;
