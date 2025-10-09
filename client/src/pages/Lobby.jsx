import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSocket } from '../socket/SocketProvider.jsx';

export function Lobby() {
  const { socket, state } = useSocket();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

  function createRoom() {
    socket.emit('room:create', { displayName });
    socket.once('room:created', ({ code }) => navigate(`/game/${code}`));
  }

  function joinRoom() {
    socket.emit('room:join', { code: code.toUpperCase(), displayName });
    socket.once('room:joined', ({ code }) => navigate(`/game/${code}`));
  }

  async function copyInvite() {
    if (!state?.code) return;
    await navigator.clipboard.writeText(`${window.location.origin}/game/${state.code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="container">
      <h1>Tall Tales</h1>
      <div className="card">
        <input placeholder="Your name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button onClick={createRoom} disabled={!displayName}>Create Room</button>
          <input placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} style={{ width: 90, textTransform: 'uppercase' }} />
          <button onClick={joinRoom} disabled={!displayName || code.length < 3}>Join</button>
        </div>
      </div>
      {state?.players && (
        <div style={{ marginTop: 24 }}>
          <h3>Players</h3>
          <ul>
            {state.players.map((p) => (
              <li key={p.playerId}>{p.displayName}{p.isHost ? ' (Host)' : ''}</li>
            ))}
          </ul>
          <button onClick={copyInvite} disabled={!state?.code}>{copied ? 'Copied!' : 'Copy Invite Link'}</button>
        </div>
      )}
    </div>
  );
}
