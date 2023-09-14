import { FC } from 'react';
import { Message } from '../chatModel';
import ChatMessage from './ChatMessage';
import { useUser } from '../../../core/state/useUser';

interface Props {
  messages: Message[];
}

const ChatMessages: FC<Props> = ({ messages }) => {
  const username = useUser((state) => state.username);

  return (
    <>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`px-2 py-1 ${msg.username === username || msg.type === 'info' ? 'ml-auto' : 'mr-auto'}`}
          style={{ width: 'fit-content', maxWidth: '80%' }}
        >
          <ChatMessage message={msg} />
        </div>
      ))}
    </>
  );
};

export default ChatMessages;
