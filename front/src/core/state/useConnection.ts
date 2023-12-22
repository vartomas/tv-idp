import { HubConnection } from '@microsoft/signalr';
import { create } from 'zustand';

interface ConnectionState {
  connection: HubConnection | null;
  setConnection: (connection: HubConnection) => void;
}

export const useConnection = create<ConnectionState>((set) => ({
  connection: null,
  setConnection: (connection) => set({ connection }),
}));
