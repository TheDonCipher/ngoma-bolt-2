"use client";

    import { io, Socket } from 'socket.io-client';
    import { create } from 'zustand';

    interface WebSocketStore {
      socket: Socket | null;
      isConnected: boolean;
      lastError: string | null;
      
      connect: () => void;
      disconnect: () => void;
      setError: (error: string | null) => void;
    }

    export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
      socket: null,
      isConnected: false,
      lastError: null,

      connect: () => {
        if (get().socket?.connected) return;

        const socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
        });

        socket.on('connect', () => {
          set({ isConnected: true, lastError: null });
        });

        socket.on('disconnect', () => {
          set({ isConnected: false });
        });

        socket.on('error', (error) => {
          set({ lastError: error.message });
        });

        set({ socket });
      },

      disconnect: () => {
        get().socket?.disconnect();
        set({ socket: null, isConnected: false });
      },

      setError: (error) => set({ lastError: error }),
    }));

    export function useWebSocket() {
      const store = useWebSocketStore();

      const subscribe = <T>(event: string, callback: (data: T) => void) => {
        store.socket?.on(event, callback);
        return () => {
          store.socket?.off(event, callback);
        };
      };

      const emit = <T>(event: string, data?: T) => {
        if (!store.socket?.connected) {
          throw new Error('Socket not connected');
        }
        store.socket.emit(event, data);
      };

      return {
        ...store,
        subscribe,
        emit,
      };
    }
