import { useMemo } from 'react';
import { useSocket } from '../socket/SocketProvider.jsx';

const HOST_LINES = {
  lobby: [
    'Gather round, storytellers! Waiting for players...',
    'Welcome to Tall Tales. Pick your name and join!'
  ],
  writing: [
    'Sharpen those quills! Write a sentence that dazzles.',
    'Creativity time! Avoid clichés. Or embrace them. I am not your boss.'
  ],
  judging: [
    'Raconteur, choose wisely... or chaotically.',
    'The fate of the tale rests in your click.'
  ],
  intermission: [
    'A moment to breathe before the next twist.',
    'Brb, narrating a montage in my head.'
  ],
  complete: [
    'Bravo! A masterpiece of questionable canon.',
    'Curtains fall. Bows, awkwardly.'
  ],
};

export function Host() {
  const { state } = useSocket();
  const line = useMemo(() => {
    const options = HOST_LINES[state?.status] || ['Loading the stage...'];
    return options[Math.floor(Math.random() * options.length)];
  }, [state?.status]);

  return (
    <div style={{ fontStyle: 'italic', color: '#6b6b6b', marginBottom: 8 }}>
      🎙️ Host: {line}
    </div>
  );
}
