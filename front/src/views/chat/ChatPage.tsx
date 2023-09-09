import { Col, Row } from 'antd';
import ChatInput from './components/ChatInput';
import ChatMessages from './components/ChatMessages';
import ChatSideBar from './components/ChatSideBar';
import { useChat } from './hooks/useChat';
import Navbar from '../../components/Navbar';
import Loader from '../Loader';

const ChatPage = () => {
  const {
    initializing,
    leavingChannel,
    currentChannelId,
    availableChannels,
    messages,
    connectedUsers,
    sendMessage,
    setCurrentChannelId,
    leave,
  } = useChat();

  if (initializing) {
    return <Loader />;
  }

  return (
    <div className="h-screen bg-slate-50">
      <div className="shadow" style={{ height: '40px' }}>
        <Navbar
          leavingChannel={leavingChannel}
          currentChannelId={currentChannelId}
          availableChannels={availableChannels}
          setCurrentChannelId={setCurrentChannelId}
          leave={leave}
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
    </div>
  );
};

export default ChatPage;
