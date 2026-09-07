import { create } from 'zustand';
import { OperatingMode, Notification } from '@/types';

interface AppState {
  operatingMode: OperatingMode;
  sidebarOpen: boolean;
  currentTime: Date;
  lastUpdate: Date;
  systemHealth: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  notifications: Notification[];
  user: { name: string; role: string; avatar: string } | null;
  toggleMode: () => void;
  toggleSidebar: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  dismissNotification: (id: string) => void;
  setCurrentTime: (time: Date) => void;
}

export const useAppStore = create<AppState>((set) => ({
  operatingMode: 'DEMO',
  sidebarOpen: false,
  currentTime: new Date(),
  lastUpdate: new Date(),
  systemHealth: 'HEALTHY',
  notifications: [],
  user: {
    name: 'NER Admin',
    role: 'System Administrator',
    avatar: '/avatar.png'
  },
  toggleMode: () => set((state) => ({ operatingMode: state.operatingMode === 'LIVE' ? 'DEMO' : 'LIVE' })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  addNotification: (notif) => set((state) => ({
    notifications: [{
      ...notif,
      id: Math.random().toString(36).substring(2, 9),
      read: false,
      createdAt: new Date()
    }, ...state.notifications]
  })),
  dismissNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),
  setCurrentTime: (time) => set({ currentTime: time })
}));
