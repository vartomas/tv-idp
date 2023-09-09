import { Avatar, Button, Dropdown, MenuProps, Select } from 'antd';
import { useUser } from '../core/state/useUser';
import { useAuth } from '../core/hooks/useAuth';
import { ChannelAction, ChannelDto } from '../views/chat/ChatModel';
import { FC } from 'react';
import { UseMutateFunction } from '@tanstack/react-query';

interface Props {
  leavingChannel: boolean;
  currentChannelId: number;
  availableChannels: ChannelDto[];
  setCurrentChannelId: React.Dispatch<React.SetStateAction<number>>;
  leave: UseMutateFunction<ChannelAction, unknown, number, unknown>;
}

const Navbar: FC<Props> = ({ leavingChannel, currentChannelId, availableChannels, setCurrentChannelId, leave }) => {
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
        <Button
          className="ml-1"
          size="small"
          type="primary"
          danger
          disabled={currentChannelId === 21}
          loading={leavingChannel}
          onClick={() => leave(currentChannelId)}
        >
          Leave
        </Button>
        <Button className="ml-1" size="small" type="primary">
          Create
        </Button>
        <Button className="ml-1" size="small" type="primary">
          Join
        </Button>
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
