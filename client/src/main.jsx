import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { Lobby } from './pages/Lobby.jsx';
import { Game } from './pages/Game.jsx';
import { Story } from './pages/Story.jsx';
import { Profile } from './pages/Profile.jsx';
import { SocketProvider } from './socket/SocketProvider.jsx';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/lobby', element: <Lobby /> },
  { path: '/game/:code', element: <Game /> },
  { path: '/story/:code', element: <Story /> },
  { path: '/profile/:userId', element: <Profile /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  </StrictMode>
);
