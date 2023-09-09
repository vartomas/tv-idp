import { Avatar, Dropdown, MenuProps, Select } from 'antd';
import { useUser } from '../core/state/useUser';
import { useAuth } from '../core/hooks/useAuth';
import { ChannelDto } from '../views/chat/ChatModel';
import { FC } from 'react';

interface Props {
  currentChannelId: number;
  availableChannels: ChannelDto[];
  setCurrentChannelId: React.Dispatch<React.SetStateAction<number>>;
}

const Navbar: FC<Props> = ({ currentChannelId, availableChannels, setCurrentChannelId }) => {
  const username = useUser((state) => state.username);
  const { logout } = useAuth();

  const avatarMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      label: 'Logout',
      onClick: logout,
    },
  ];

  const channelOptions = availableChannels.map((channel) => ({ label: channel.name, value: channel.id }));
  const currentValue = channelOptions.find((option) => option.value === currentChannelId);

  return (
    <div className="h-full flex items-center justify-between p-2">
      <div className="flex items-center">
        <span>#</span>
        <Select
          size="small"
          className="w-40"
          labelInValue
          options={channelOptions}
          value={currentValue}
          onChange={(option) => setCurrentChannelId(option.value)}
        />
      </div>
      <div>
        <span className="text-blue-600">{username}</span>
        <Dropdown menu={{ items: avatarMenuItems }} placement="bottomLeft" trigger={['click']}>
          <Avatar size="small" className="bg-blue-600 ml-2 cursor-pointer select-none">
            {username[0]}
          </Avatar>
        </Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
