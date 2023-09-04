import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { useEffect, useState } from 'react';
import { ChannelDto, ConnectedUser, Message } from '../ChatModel';
import { getChannels } from '../../../core/api/chat';
import { useQuery } from '@tanstack/react-query';

export const useChat = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [currentChannel, setCurrentChannel] = useState<ChannelDto>({ id: 0, name: 'main', messages: [] });

  const { data, isLoading } = useQuery<ChannelDto[]>(['channels'], getChannels);

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
          connection.on('UserList', (data: ConnectedUser[]) => {
            setConnectedUsers(data.map((x) => x.username).sort((a, b) => a.localeCompare(b)));
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
        await connection.send('newMessage', message, currentChannel.id || currentChannel.name);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const availableChannels = [{ id: 0, name: 'main', messages: [] }, ...(data || [])];

  return {
    channelsLoading: isLoading,
    currentChannel,
    availableChannels,
    messages,
    connectedUsers,
    sendMessage,
    setCurrentChannel,
  };
};
