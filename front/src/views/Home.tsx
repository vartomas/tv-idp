import { Button } from 'antd';
import { useAuth } from '../core/hooks/useAuth';
import { useUser } from '../core/state/useUser';

const Home = () => {
  const { logout } = useAuth();
  const userId = useUser((state) => state.id);
  const username = useUser((state) => state.username);

  return (
    <div>
      <p>Id: {userId}</p>
      <p>Username: {username}</p>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};

export default Home;
