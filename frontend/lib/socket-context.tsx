'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuth } from './auth-context';

type ConnectionState = 'connected' | 'connecting' | 'disconnected';

interface SocketContextValue {
  socket: Socket | null;
  connectionState: ConnectionState;
}

const SocketContext = createContext<SocketContextValue>({ socket: null, connectionState: 'disconnected' });

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export function SocketProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');

  useEffect(() => {
    if (!token) return;

    setConnectionState('connecting');
    const instance = io(SOCKET_URL, { auth: { token } });

    instance.on('connect', () => setConnectionState('connected'));
    instance.on('disconnect', () => setConnectionState('disconnected'));
    instance.on('reconnect_attempt', () => setConnectionState('connecting'));

    setSocket(instance);

    return () => {
      instance.disconnect();
      setSocket(null);
    };
  }, [token]);

  return <SocketContext.Provider value={{ socket, connectionState }}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  return useContext(SocketContext);
}