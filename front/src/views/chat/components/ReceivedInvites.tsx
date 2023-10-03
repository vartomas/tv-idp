import { MailOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Divider, Dropdown } from 'antd';
import { FC, useState } from 'react';
import { InviteMessage } from '../../../components/chess/chessModel';

interface Props {
  invites: InviteMessage[];
  onAccept: (gameId: number) => void;
}

const ReceivedInvites: FC<Props> = ({ invites, onAccept }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const renderListItem = (invite: InviteMessage, lastElement: boolean) => {
    return (
      <div key={invite.id}>
        <div className="flex items-center">
          <p>{invite.invitedBy} (chess)</p>
          <Button
            className="ml-2"
            type="text"
            size="small"
            style={{ color: '#10B981' }}
            onClick={() => {
              onAccept(invite.id);
              setDropdownOpen(false);
            }}
          >
            Accept
          </Button>
          <Button className="ml-2" type="text" size="small" style={{ color: '#F4005E' }}>
            Decline
          </Button>
        </div>
        {!lastElement && <Divider className="my-1" />}
      </div>
    );
  };

  const dropDownRender = () => {
    return (
      <div className="bg-white p-3 rounded shadow max-h-52 overflow-auto">
        {invites.map((x, i) => renderListItem(x, i === invites.length - 1))}
      </div>
    );
  };

  return (
    <Dropdown
      open={dropdownOpen}
      placement="bottomRight"
      trigger={['click']}
      disabled={!invites.length}
      dropdownRender={dropDownRender}
      onOpenChange={(open) => setDropdownOpen(open)}
    >
      <Badge size="small" count={invites.length}>
        <Avatar
          className={`ml-2 cursor-pointer select-none ${invites.length > 0 ? 'bg-emerald-400' : 'bg-gray-200'}`}
          size="small"
          icon={<MailOutlined />}
        />
      </Badge>
    </Dropdown>
  );
};

export default ReceivedInvites;
