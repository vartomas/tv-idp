import { Col, Row } from 'antd';
import ChatInput from './components/ChatInput';
import ChatMessages from './components/ChatMessages';
import ChatSideBar from './components/ChatSideBar';
import { useChat } from './hooks/useChat';
import ChatNavbar from './components/ChatNavbar';
import Loader from '../Loader';
import CreateChannelModal from './components/CreateChannelModal';
import JoinChannelModal from './components/JoinChannelModal';

const ChatPage = () => {
  const {
    initializing,
    leavingChannel,
    joiningChannel,
    creatingChannel,
    currentChannelId,
    availableChannels,
    messages,
    connectedUsers,
    createChannelModalOpen,
    joinChannelModalOpen,
    sendMessage,
    setCurrentChannelId,
    onLeaveChannel,
    onCreateChannel,
    onJoinChannel,
    setCreateChannelModalOpen,
    setJoinChannelModalOpen,
  } = useChat();

  if (initializing) {
    return <Loader />;
  }

  return (
    <div className="h-screen bg-slate-50">
      <div className="shadow" style={{ height: '40px' }}>
        <ChatNavbar
          leavingChannel={leavingChannel}
          currentChannelId={currentChannelId}
          availableChannels={availableChannels}
          setCurrentChannelId={setCurrentChannelId}
          onLeave={onLeaveChannel}
          onOpenCreateChannelModal={setCreateChannelModalOpen}
          onOpenJoinChannelModal={setJoinChannelModalOpen}
        />
      </div>
      <Row style={{ height: 'calc(100% - 40px)' }}>
        <Col span={3}>
          <ChatSideBar connectedUsers={connectedUsers} />
        </Col>
        <Col span={21} className="h-full">
          <div className="w-full pt-auto overflow-auto" style={{ height: 'calc(100% - 92px)' }} id="messagesContainer">
            <div className="h-full flex flex-col">
              <div className="flex-auto"></div>
              <ChatMessages messages={messages.filter((x) => x.channelId === currentChannelId)} />
            </div>
          </div>
          <div style={{ height: '92px' }}>
            <ChatInput sendMessage={sendMessage} />
          </div>
        </Col>
      </Row>
      <CreateChannelModal
        open={createChannelModalOpen}
        loading={creatingChannel}
        onCreate={onCreateChannel}
        onOpenChange={setCreateChannelModalOpen}
      />
      <JoinChannelModal
        open={joinChannelModalOpen}
        loading={joiningChannel}
        onJoin={onJoinChannel}
        onOpenChange={setJoinChannelModalOpen}
      />
    </div>
  );
};

export default ChatPage;
