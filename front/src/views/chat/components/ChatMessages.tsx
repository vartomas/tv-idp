import { FC } from 'react';
import { Message } from '../ChatModel';
import ChatMessage from './ChatMessage';
import { useUser } from '../../../core/state/useUser';

interface Props {
  messages: Message[];
}

const ChatMessages: FC<Props> = ({ messages }) => {
  const username = useUser((state) => state.username);

  return (
    <div className="w-full h-full flex flex-col-reverse">
      {messages.map((msg) => (
        <div className={`p-1 ${msg.username === username ? 'self-end' : 'self-start'}`}>
          <ChatMessage message={msg} />
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
