import { FC } from 'react';
import { ConnectedUser } from '../chatTypes';
import UserListItem from './UserListItem';

interface Props {
  connectedUsers: ConnectedUser[];
  onInviteChess: (userId: number) => void;
}

const ChatSideBar: FC<Props> = ({ connectedUsers, onInviteChess }) => {
  return (
    <div className="w-full h-full p-2">
      <div className="w-full h-full p-2 bg-white rounded border-solid border border-slate-200 shadow-xs">
        {connectedUsers.map((user) => (
          <UserListItem key={user.id} user={user} onInviteChess={onInviteChess} />
        ))}
      </div>
    </div>
  );
};

export default ChatSideBar;
