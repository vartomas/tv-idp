import { MailOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Divider, Dropdown } from 'antd';
import { FC } from 'react';
import { InviteMessage } from '../../../components/chess/chessModel';

interface Props {
  invites: InviteMessage[];
}

const renderListItem = (invite: InviteMessage, lastElement: boolean) => {
  return (
    <>
      <div className="flex items-center" key={invite.gameId}>
        <p>{invite.invitedBy} (chess)</p>
        <Button className="ml-2" type="text" size="small" style={{ color: '#10B981' }}>
          Accept
        </Button>
        <Button className="ml-2" type="text" size="small" style={{ color: '#F4005E' }}>
          Decline
        </Button>
      </div>
      {!lastElement && <Divider className="my-1" />}
    </>
  );
};

const ReceivedInvites: FC<Props> = ({ invites }) => {
  const dropDownRender = () => {
    return (
      <div className="bg-white p-3 rounded shadow max-h-52 overflow-auto">
        {invites.map((x, i) => renderListItem(x, i === invites.length - 1))}
      </div>
    );
  };

  return (
    <Dropdown placement="bottomRight" trigger={['click']} disabled={!invites.length} dropdownRender={dropDownRender}>
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
