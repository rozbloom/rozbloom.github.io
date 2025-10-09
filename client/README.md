## Client — Tall Tales

React + Vite front-end for the Tall Tales multiplayer storytelling game.

Available routes:
- `/` — Home
- `/lobby` — Create/Join room
- `/game/:code` — Gameplay
- `/story/:code` — Story/Leaderboard view
- `/profile/:userId` — Simple profile

Environment variables:
- `VITE_SERVER_URL` — Socket server (defaults to `http://localhost:4000`)

Dev:
```bash
npm run dev
```
