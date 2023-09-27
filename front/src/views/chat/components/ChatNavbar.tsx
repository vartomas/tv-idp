import { Avatar, Button, Dropdown, MenuProps, Select } from 'antd';
import { useUser } from '../../../core/state/useUser';
import { useAuth } from '../../../core/hooks/useAuth';
import { ChannelAction, ChannelDto } from '../chatModel';
import { FC } from 'react';
import { UseMutateFunction } from '@tanstack/react-query';
import { MoreOutlined } from '@ant-design/icons';
import ReceivedInvites from './ReceivedInvites';
import { InviteMessage } from '../../../components/chess/chessModel';

interface Props {
  leavingChannel: boolean;
  currentChannelId: number;
  availableChannels: ChannelDto[];
  receivedInvites: InviteMessage[];
  setCurrentChannelId: React.Dispatch<React.SetStateAction<number>>;
  onLeave: UseMutateFunction<ChannelAction, unknown, number, unknown>;
  onOpenCreateChannelModal: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenJoinChannelModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatNavbar: FC<Props> = ({
  leavingChannel,
  currentChannelId,
  availableChannels,
  receivedInvites,
  setCurrentChannelId,
  onLeave,
  onOpenCreateChannelModal,
  onOpenJoinChannelModal,
}) => {
  const username = useUser((state) => state.username);
  const { logout } = useAuth();

  const avatarMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      label: 'Logout',
      onClick: logout,
    },
  ];

  const channelMenuItems: MenuProps['items'] = [
    {
      key: 'leave',
      label: 'Leave this channel',
      danger: true,
      disabled: currentChannelId === 21,
      onClick: () => onLeave(currentChannelId),
    },
    {
      key: 'create',
      label: 'Create channel',
      onClick: () => onOpenCreateChannelModal(true),
    },
    {
      key: 'join',
      label: 'Join channel',
      onClick: () => onOpenJoinChannelModal(true),
    },
  ];

  if (currentChannelId !== 21) {
    channelMenuItems.push({
      key: 'channelId',
      label: `Copy channel ID ${currentChannelId}`,
      onClick: () => {
        navigator.clipboard.writeText(currentChannelId.toString());
      },
    });
  }

  const channelOptions = availableChannels.map((channel) => ({ label: channel.name, value: channel.id }));
  const currentValue = channelOptions.find((option) => option.value === currentChannelId);

  return (
    <div className="h-full flex items-center justify-between p-2">
      <div className="flex items-center">
        <Select
          size="small"
          className="w-48"
          labelInValue
          options={channelOptions}
          value={currentValue}
          onChange={(option) => setCurrentChannelId(option.value)}
        />
        <Dropdown menu={{ items: channelMenuItems }} placement="bottomLeft" trigger={['click']}>
          <Button className="ml-1" size="small" shape="circle" loading={leavingChannel} icon={<MoreOutlined />} />
        </Dropdown>
      </div>
      <div>
        <ReceivedInvites invites={receivedInvites} />
        <span className="text-blue-600 ml-6">{username}</span>
        <Dropdown menu={{ items: avatarMenuItems }} placement="bottomRight" trigger={['click']}>
          <Avatar size="small" className="bg-blue-600 ml-2 cursor-pointer select-none">
            {username[0]}
          </Avatar>
        </Dropdown>
      </div>
    </div>
  );
};

export default ChatNavbar;
