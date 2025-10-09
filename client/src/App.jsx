import './App.css';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="container">
      <h1>Tall Tales</h1>
      <p>Multiplayer collaborative storytelling. 3-5 players. 10 rounds. Backstory → Conflict → Resolution.</p>
      <div className="card" style={{ display: 'flex', gap: 12 }}>
        <Link to="/lobby"><button>Enter Lobby</button></Link>
        <Link to="/profile/me"><button>My Profile</button></Link>
      </div>
    </div>
  );
}

export default App;
