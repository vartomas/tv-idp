import { useChat } from './useChat';

const Chat = () => {
  const { messages, sendMessage } = useChat();

  return (
    <>
      <button onClick={() => sendMessage('kebabas')}>send</button>
      {messages.map((x) => (
        <p>{x}</p>
      ))}
    </>
  );
};

export default Chat;
