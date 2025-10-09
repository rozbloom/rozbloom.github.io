import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export function Profile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`).then((r) => r.json()).then(setProfile);
  }, [userId]);

  function save(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const displayName = form.get('displayName');
    fetch(`/api/users/${userId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ displayName }) })
      .then(() => alert('Saved'));
  }

  if (!profile) return <div className="container">Loading profile...</div>;

  return (
    <div className="container">
      <h2>Profile</h2>
      <form onSubmit={save} className="card" style={{ gap: 8, display: 'flex', flexDirection: 'column' }}>
        <input name="displayName" defaultValue={profile.displayName} />
        <button>Save</button>
      </form>
      <h3>Past Stories</h3>
      <ul>
        {(profile.stories || []).map((s) => (
          <li key={s.code}>{s.code} - {s.title || 'Untitled'}</li>
        ))}
      </ul>
    </div>
  );
}
