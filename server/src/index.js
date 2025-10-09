import express from 'express';
import http from 'http';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server as SocketIOServer } from 'socket.io';
import { createGameServer } from './tall-tales/server.js';

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

// Health and info
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Simple JSON storage for stories and profiles
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../data');
const storiesPath = path.join(dataDir, 'stories.json');
const usersPath = path.join(dataDir, 'users.json');

async function ensureDataFiles() {
  await fs.mkdir(dataDir, { recursive: true });
  const defaults = [
    [storiesPath, []],
    [usersPath, {}],
  ];
  for (const [p, initial] of defaults) {
    try {
      await fs.access(p);
    } catch {
      await fs.writeFile(p, JSON.stringify(initial, null, 2));
    }
  }
}

function readJson(p) {
  return fs.readFile(p, 'utf-8').then((t) => JSON.parse(t));
}

function writeJson(p, obj) {
  return fs.writeFile(p, JSON.stringify(obj, null, 2));
}

// REST: stories
app.get('/api/stories', async (_req, res) => {
  try {
    await ensureDataFiles();
    const stories = await readJson(storiesPath);
    res.json(stories);
  } catch (e) {
    res.status(500).json({ error: 'failed_to_read' });
  }
});

app.post('/api/stories', async (req, res) => {
  try {
    await ensureDataFiles();
    const stories = await readJson(storiesPath);
    stories.push(req.body);
    await writeJson(storiesPath, stories);
    res.status(201).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'failed_to_write' });
  }
});

// REST: users
app.get('/api/users/:userId', async (req, res) => {
  try {
    await ensureDataFiles();
    const users = await readJson(usersPath);
    res.json(users[req.params.userId] || { userId: req.params.userId, displayName: 'Player', stories: [] });
  } catch (e) {
    res.status(500).json({ error: 'failed_to_read' });
  }
});

app.put('/api/users/:userId', async (req, res) => {
  try {
    await ensureDataFiles();
    const users = await readJson(usersPath);
    users[req.params.userId] = { ...(users[req.params.userId] || {}), ...req.body, userId: req.params.userId };
    await writeJson(usersPath, users);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'failed_to_write' });
  }
});

// Create HTTP server and bind Socket.IO
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// Wire up game namespace
createGameServer(io);

httpServer.listen(PORT, () => {
  console.log(`Tall Tales server listening on :${PORT}`);
});

// Persist final story when game completes via socket event
function wireStoryPersistence(io) {
  io.on('connection', (socket) => {
    socket.on('story:save', async (payload) => {
      try {
        await ensureDataFiles();
        const stories = await readJson(storiesPath);
        stories.push(payload);
        await writeJson(storiesPath, stories);
      } catch (e) {
        // best-effort persistence
      }
    });
  });
}

wireStoryPersistence(io);
