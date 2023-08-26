export interface ChatInputForm {
  message: string;
}

export interface Message {
  username: string;
  message: string;
  type: 'info' | 'message';
  id: string;
  connectedUsers: string[];
}
