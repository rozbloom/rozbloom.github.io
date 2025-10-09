import useSound from 'use-sound';
import { useEffect, useState } from 'react';

export function SoundtrackToggle() {
  const [enabled, setEnabled] = useState(false);
  const [play, { stop }] = useSound('https://cdn.pixabay.com/download/audio/2022/05/27/audio_9abf3a0249.mp3?filename=retrowave-11254.mp3', {
    volume: 0.25,
    loop: true,
    html5: true,
  });

  useEffect(() => {
    if (enabled) play();
    else stop();
  }, [enabled, play, stop]);

  return (
    <button onClick={() => setEnabled((v) => !v)}>
      {enabled ? 'Pause Soundtrack' : 'Play Soundtrack'}
    </button>
  );
}
