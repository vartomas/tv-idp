import ChatInput from './components/ChatInput';
import ChatMessages from './components/ChatMessages';
import ChatSideBar from './components/ChatSideBar';
import { useChat } from './hooks/useChat';

const ChatPage = () => {
  const { messages, sendMessage } = useChat();

  return (
    <div className="w-screen h-screen flex bg-slate-50">
      <div className="w-52">
        <ChatSideBar />
      </div>
      <div className="grow flex flex-col">
        <div className="grow">
          <ChatMessages messages={messages} />
        </div>
        <div className="h-23">
          <ChatInput sendMessage={sendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
