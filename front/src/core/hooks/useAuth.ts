import { useNavigate } from 'react-router-dom';
import { checkUser, loginUser, registerUser } from '../api/user';
import { UserDto } from '../model/user';
import { useUser } from '../state/useUser';
import { useApi } from './useApi';
import { getCookie } from '../utils/cookies';

export const useAuth = () => {
  const { call } = useApi();
  const setUser = useUser((state) => state.setUser);
  const clearUser = useUser((state) => state.clearUser);
  const navigate = useNavigate();

  const initializeUser = async () => {
    if (!getCookie('token')) {
      return;
    }

    const user = await call<UserDto>(checkUser());

    if (user) {
      setUser(user.id, user.username);
    }
  };

  const login = async (username: string, password: string) => {
    const user = await call<UserDto>(loginUser(username, password), true);

    if (user) {
      setUser(user.id, user.username);
      navigate('/');
    }
  };

  const register = async (username: string, password: string) => {
    const user = await call<UserDto>(registerUser(username, password), true);

    if (user) {
      setUser(user.id, user.username);
      navigate('/');
    }
  };

  const logout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    clearUser();
    navigate('/');
  };

  return { initializeUser, login, register, logout };
};
