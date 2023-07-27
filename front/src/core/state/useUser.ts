import { create } from 'zustand';

interface UserState {
  id: number;
  username: string;
  setUser: (id: number, username: string) => void;
  clearUser: () => void;
}

export const useUser = create<UserState>((set) => ({
  id: 0,
  username: '',
  setUser: (id: number, username: string) => set({ id, username }),
  clearUser: () => set({ id: 0, username: '' }),
}));
