import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../socket/SocketProvider.jsx';
import { SoundtrackToggle } from '../components/SoundtrackToggle.jsx';
import { Host } from '../components/Host.jsx';

export function Game() {
  const { code } = useParams();
  const { socket, state, self } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.code) return;
    if (state.status === 'complete') {
      // Persist story
      fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: state.code, story: state.story, players: state.players, createdAt: Date.now() })
      }).finally(() => navigate(`/story/${state.code}`));
    }
  }, [state, navigate]);

  if (!state) return <div className="container">Connecting...</div>;

  const isHost = state.players.find((p) => p.playerId === self?.playerId)?.isHost;

  function startGame() {
    socket.emit('game:start');
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Room {code}</h2>
        <SoundtrackToggle />
      </div>
      <Host />
      <p>Round {state.roundIndex + 1} / {state.round ? 10 : 0}</p>
      <p><strong>{state.round?.category}</strong>: {state.round?.prompt}</p>

      {state.status === 'lobby' && (
        <button onClick={startGame} disabled={!isHost || !state.players || state.players.length < 3}>Start Game</button>
      )}

      {state.status === 'writing' && (
        <Writer />
      )}
      {state.status === 'judging' && (
        <Judge />
      )}
      {state.status === 'intermission' && (
        <Intermission />
      )}
    </div>
  );
}

function Writer() {
  const { socket, state } = useSocket();
  function submit(e) {
    e.preventDefault();
    const text = new FormData(e.currentTarget).get('text');
    if (!text) return;
    socket.emit('round:submit', { text });
    e.currentTarget.reset();
  }
  return (
    <form onSubmit={submit} className="card" style={{ gap: 8, display: 'flex', flexDirection: 'column' }}>
      <textarea name="text" rows={4} placeholder="Write your sentence..." />
      <button type="submit">Submit</button>
    </form>
  );
}

function Judge() {
  const { socket, state, self } = useSocket();
  const isRaconteur = state.currentRaconteurId === self?.playerId;
  return (
    <div className="card">
      <h3>Pick the best sentence</h3>
      <ul>
        {Object.entries(state.round?.submissions || {}).map(([playerId, text]) => (
          <li key={playerId} style={{ marginBottom: 8 }}>
            <button onClick={() => socket.emit('judge:choose', { winnerPlayerId: playerId })} disabled={!isRaconteur}>{text}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Intermission() {
  const { socket, state } = useSocket();
  const hostId = state.players.find((p) => p.isHost)?.playerId;
  return (
    <div className="card">
      <p>Winner chosen. Current story length: {state.story.length}</p>
      <button onClick={() => socket.emit('game:next')} disabled={!hostId}>Next Round</button>
    </div>
  );
}
