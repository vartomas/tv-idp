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
  messages: Message[];
}

export interface ConnectedUser {
  id: number;
  username: string;
}
