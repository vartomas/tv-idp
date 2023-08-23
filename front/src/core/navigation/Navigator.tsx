import { Route, Routes } from 'react-router-dom';
import Loader from '../../views/Loader';
import { useEffect, useState } from 'react';
import Home from '../../views/Home';
import Login from '../../views/Login';
import { useAuth } from '../hooks/useAuth';
import Register from '../../views/Register';
import ChatPage from '../../views/chat/ChatPage';
import { useUser } from '../state/useUser';

const Navigator = () => {
  const username = useUser((state) => state.username);
  const [initializing, setInitializing] = useState(true);
  const { initializeUser } = useAuth();

  const checkUser = async () => {
    await initializeUser();
    setInitializing(false);
  };

  useEffect(() => {
    checkUser();
  }, []);

  if (initializing) {
    return <Loader />;
  }

  const unauthorisedRoutes = [
    <Route key="/" path="/" element={<Login />} />,
    <Route key="register" path="register" element={<Register />} />,
  ];

  const authorisedRoutes = [
    <Route key="/" path="/" element={<Home />} />,
    <Route key="chat" path="chat" element={<ChatPage />} />,
  ];

  return (
    <Routes>
      {[...(username ? authorisedRoutes : unauthorisedRoutes)]}
      <Route path="*" element={username ? <Home /> : <Login />} />
    </Routes>
  );
};

export default Navigator;
