import { Col, Row } from 'antd';
import ChatInput from './components/ChatInput';
import ChatMessages from './components/ChatMessages';
import ChatSideBar from './components/ChatSideBar';
import { useChat } from './hooks/useChat';
import Navbar from '../../components/Navbar';
import Loader from '../Loader';

const ChatPage = () => {
  const {
    channelsLoading,
    currentChannel,
    availableChannels,
    messages,
    connectedUsers,
    sendMessage,
    setCurrentChannel,
  } = useChat();

  if (channelsLoading) {
    return <Loader />;
  }

  return (
    <div className="h-screen bg-slate-50">
      <div className="shadow" style={{ height: '40px' }}>
        <Navbar
          currentChannel={currentChannel}
          availableChannels={availableChannels}
          setCurrentChannel={setCurrentChannel}
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
              <ChatMessages messages={messages} />
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
