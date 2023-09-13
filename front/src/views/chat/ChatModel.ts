export interface ChatInputForm {
  message: string;
}

export interface Message {
  username: string;
  body: string;
  type: 'info' | 'message';
  id: number;
  channelId: number;
}

export interface ChannelDto {
  id: number;
  name: string;
}

export interface ConnectedUser {
  id: number;
  username: string;
}

export interface ChannelAction {
  message: string;
  name: string;
  id: number;
}

export interface ChannelUsers {
  channelId: number;
  users: ConnectedUser[];
}
