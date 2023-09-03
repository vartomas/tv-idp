import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { useEffect, useState } from 'react';
import { ChannelDto, Message } from '../ChatModel';
import { getChannels } from '../../../core/api/chat';
import { useApi } from '../../../core/hooks/useApi';

export const useChat = () => {
  const [initialized, setInitialized] = useState(false);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [currentChannel, setCurrentChannel] = useState<ChannelDto>({ id: 0, name: 'main', messages: [] });
  const [availableChannels, setAvailableChannels] = useState<ChannelDto[]>([{ id: 0, name: 'main', messages: [] }]);

  const { call } = useApi();

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
            console.log(data);
            if (data.type === 'info') {
              setConnectedUsers(data.connectedUsers.sort((a, b) => a.localeCompare(b)));
            }
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
        await connection.send('newMessage', message, currentChannel);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { initialized, currentChannel, availableChannels, messages, connectedUsers, sendMessage, setCurrentChannel };
};
