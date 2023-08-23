import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { useEffect, useState } from 'react';

export const useChat = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder().withUrl('/ws/chat').withAutomaticReconnect().build();
    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on('UserConnected', (data: string) => {
            console.log(data);
          });
          connection.on('ReceiveMessage', (data: string) => {
            console.log(data);
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
