import { Route, Routes } from 'react-router-dom';
import Loader from '../../views/Loader';
import { useEffect, useState } from 'react';
import Home from '../../views/Home';
import Login from '../../views/Login';
import { useAuth } from '../hooks/useAuth';
import Register from '../../views/Register';
import Protected from '../../components/Protected';

const Navigator = () => {
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

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route
        path="/"
        element={
          <Protected>
            <Home />
          </Protected>
        }
      />
    </Routes>
  );
};

export default Navigator;
