import { FC } from 'react';
import { ConnectedUser } from '../chatModel';
import { RightOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps } from 'antd';
import { useUser } from '../../../core/state/useUser';

interface Props {
  user: ConnectedUser;
  onInviteChess: (userId: number) => void;
}

const UserListItem: FC<Props> = ({ user, onInviteChess }) => {
  const currentUserId = useUser((state) => state.id);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Invite to chess game',
      onClick: () => {
        onInviteChess(user.id);
      },
    },
  ];

  const currentUserItem = currentUserId === user.id;

  return (
    <div className="group hover:bg-slate-100 p-1 rounded flex items-center justify-between">
      <span className="text-ellipsis overflow-hidden">{user.username}</span>
      {!currentUserItem && (
        <Dropdown placement="bottomLeft" trigger={['click']} menu={{ items }}>
          <RightOutlined className="opacity-0 group-hover:opacity-100 cursor-pointer" />
        </Dropdown>
      )}
    </div>
  );
};

export default UserListItem;
