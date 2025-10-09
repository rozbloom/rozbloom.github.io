import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export function Story() {
  const { code } = useParams();
  const [story, setStory] = useState(null);

  useEffect(() => {
    fetch('/api/stories').then((r) => r.json()).then((all) => {
      const s = all.find((x) => x.code === code);
      setStory(s || { code, story: [] });
    });
  }, [code]);

  if (!story) return <div className="container">Loading story...</div>;

  return (
    <div className="container">
      <h2>Story for Room {code}</h2>
      <ol>
        {story.story.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ol>
      <Link to="/lobby">Back to Lobby</Link>
    </div>
  );
}
