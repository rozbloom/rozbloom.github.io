import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [state, setState] = useState(null);
  const [self, setSelf] = useState(null);

  useEffect(() => {
    const s = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:4000');
    setSocket(s);
    s.on('game:update', (st) => setState(st));
    s.on('room:update', (st) => setState(st));
    s.on('room:created', ({ player, state }) => {
      setSelf(player);
      setState(state);
    });
    s.on('room:joined', ({ player, state }) => {
      setSelf(player);
      setState(state);
    });
    return () => s.close();
  }, []);

  const value = useMemo(() => ({ socket, state, self, setState }), [socket, state, self]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within SocketProvider');
  return ctx;
}
