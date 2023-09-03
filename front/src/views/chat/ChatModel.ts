export interface ChatInputForm {
  message: string;
}

export interface Message {
  username: string;
  body: string;
  type: 'info' | 'message';
  id: number;
  connectedUsers: string[];
}

export interface ChannelDto {
  id: number;
  name: string;
  messages: Message[];
}
