import { Col, Row } from 'antd';
import ChatInput from './components/ChatInput';
import ChatMessages from './components/ChatMessages';
import ChatSideBar from './components/ChatSideBar';
import { useChat } from './hooks/useChat';

const ChatPage = () => {
  const { messages, connectedUsers, sendMessage } = useChat();

  return (
    <Row className="h-screen bg-slate-50">
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
  );
};

export default ChatPage;
