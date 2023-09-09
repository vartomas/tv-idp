import { createSettings } from '../utils/api';

export const getChannels = async () => {
  const res = await fetch('api/Chat/GetChannels');
  return res.json();
};

export const getMessages = async () => {
  const res = await fetch('api/Chat/GetMessages');
  return res.json();
};

export const createChannel = async (name: string) => {
  const res = await fetch('api/Chat/CreateChannel', createSettings('POST', { name }));
  return res.json();
};

export const joinChannel = async (id: number) => {
  const res = await fetch('api/Chat/JoinChannel', createSettings('POST', { id }));
  return res.json();
};

export const leaveChannel = async (id: number) => {
  const res = await fetch('api/Chat/LeaveChannel', createSettings('POST', { id }));
  return res.json();
};
