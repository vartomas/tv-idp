import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { useEffect, useState } from 'react';
import { Message } from '../ChatModel';

export const useChat = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const scrollToBottom = () => {
    const messagesContainer = document.getElementById('messagesContainer');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  useEffect(() => {
    const newConnection = new HubConnectionBuilder().withUrl('/ws/chat').withAutomaticReconnect().build();
    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on('ReceiveMessage', (data: Message) => {
            setMessages((prev) => [...prev, data]);
          });
        })
        .catch((err) => console.error(err));
    }

    return () => {
      if (connection) {
        connection.stop().catch((err) => console.error(err));
      }
    };
  }, [connection]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message: string) => {
    try {
      if (connection?.state === 'Connected') {
        await connection.send('newMessage', message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { messages, sendMessage };
};
