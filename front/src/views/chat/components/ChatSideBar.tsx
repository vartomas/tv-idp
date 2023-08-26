import { FC } from 'react';

interface Props {
  connectedUsers: string[];
}

const ChatSideBar: FC<Props> = ({ connectedUsers }) => {
  return (
    <div className="w-full h-full p-2">
      <div className="w-full h-full p-2 bg-white rounded border-solid border border-slate-200 shadow-inner">
        {connectedUsers.map((user) => (
          <p key={user}>{user}</p>
        ))}
      </div>
    </div>
  );
};

export default ChatSideBar;
