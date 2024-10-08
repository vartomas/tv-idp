import { FC } from 'react';
import { Message } from '../chatTypes';

interface Props {
  message: Message;
}

const ChatMessage: FC<Props> = ({ message }) => {
  const chatMessage = (
    <>
      <div className="text-xs font-light text-blue-600/100">{message.username}</div>
      <div className="whitespace-pre-wrap text-lg font-normal">{message.body}</div>
    </>
  );

  const infoMessage = <div className="text-xs font-light text-blue-600/100">{message.body}</div>;

  return (
    <div className="p-2 bg-white rounded border-solid border border-slate-200 shadow-xs">
      {message.type === 'message' ? chatMessage : infoMessage}
    </div>
  );
};

export default ChatMessage;
