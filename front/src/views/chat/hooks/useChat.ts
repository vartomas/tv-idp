import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { useEffect, useState } from 'react';
import { ChannelAction, ChannelDto, ConnectedUser, Message } from '../ChatModel';
import { leaveChannel, getChannels, getMessages, joinChannel, createChannel } from '../../../core/api/chat';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useChat = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [currentChannelId, setCurrentChannelId] = useState(21);
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<ChannelDto[]>([]);

  const { isLoading: channelsLoading } = useQuery<ChannelDto[]>({
    queryKey: ['channels'],
    queryFn: getChannels,
    staleTime: Infinity,
    cacheTime: Infinity,
    onSuccess: (data) => {
      setChannels(data);
    },
  });
  const { isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ['messages'],
    queryFn: getMessages,
    staleTime: Infinity,
    cacheTime: Infinity,
    onSuccess: (data) => {
      setMessages(data);
    },
  });

  const { mutate: create, isLoading: creatingChannel } = useMutation({
    mutationFn: createChannel,
    retry: false,
    onSuccess: (response: ChannelAction) => {
      setChannels((prev) => [...prev, { id: response.id, name: response.name }]);
      setCurrentChannelId(response.id);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const { mutate: join, isLoading: joiningChannel } = useMutation({
    mutationFn: joinChannel,
    retry: false,
    onSuccess: (response: ChannelAction) => {
      setChannels((prev) => [...prev, { id: response.id, name: response.name }]);
      setCurrentChannelId(response.id);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const { mutate: leave, isLoading: leavingChannel } = useMutation({
    mutationFn: leaveChannel,
    retry: false,
    onSuccess: (response: ChannelAction) => {
      console.log(response);
      setChannels((prev) => prev.filter((x) => x.id !== response.id));
      setCurrentChannelId(21);
    },
    onError: (err) => {
      console.error(err);
    },
  });

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
  }, [messages, currentChannelId]);

  const sendMessage = async (message: string) => {
    try {
      if (connection?.state === 'Connected') {
        await connection.send('newMessage', message, currentChannelId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const availableChannels =
    channels?.sort((a, b) => {
      if (a.name === 'main') return -1;
      return a.name.localeCompare(b.name);
    }) || [];

  return {
    initializing: channelsLoading || messagesLoading,
    creatingChannel,
    joiningChannel,
    leavingChannel,
    currentChannelId,
    availableChannels,
    messages,
    connectedUsers,
    sendMessage,
    setCurrentChannelId,
    create,
    join,
    leave,
  };
};
