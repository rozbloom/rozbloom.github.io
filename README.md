# Tall Tales — Multiplayer Collaborative Story Game

Tall Tales is a multiplayer collaborative storytelling web app for 3–5 players. Each round, one player becomes the Raconteur and judges the funniest or most fitting sentence to continue the story. There are 10 rounds total across Backstory, Conflict, and Resolution. Scores accumulate each round; the top contributor wins. After the game, the full story appears on the leaderboard and is saved to user profiles.

What makes Tall Tales special is its socket-powered, multi-device gameplay—friends connect from anywhere. It also includes a lightweight virtual host and an optional soundtrack for party vibes. Prompts are curated for replayability and can be extended by genre.

## Features
- Real-time rooms via Socket.IO
- Rounds: Backstory → Conflict → Resolution (10 total)
- Rotating Raconteur judges submissions
- Persistent stories and simple profiles (JSON-backed)
- Leaderboard/story view and profile page
- Optional soundtrack and virtual host banter

## Tech Stack
- Server: Node.js, Express, Socket.IO, NanoID, JSON storage
- Client: React + Vite, React Router, socket.io-client

## Getting Started

Prerequisites: Node 18+

1) Install dependencies
```bash
cd server && npm install
cd ../client && npm install
```

2) Run dev servers (two terminals)
```bash
cd server && npm run dev
```
```bash
cd client && npm run dev
```

Alternatively, from repo root:
```bash
npm i && npm run install:all
npm run dev
```

3) Open the client URL printed by Vite. Set `VITE_SERVER_URL` in `client/.env` if your server is not on `http://localhost:4000`.

## Unique Touches
- Virtual Host: light narration and contextual quips guiding each phase
- Soundtrack Toggle: synthwave loop for energy, user-controlled
- Genre-aware prompts with a 10-step arc encouraging cohesive, funny stories

## Roadmap
- Auth + proper profile persistence
- Rich prompt packs and genre selection
- Spectator mode and mid-game join/leave resiliency
- Shareable story images and highlights
