import { nanoid } from 'nanoid';
import { GameManager } from './state/gameManager.js';
import { buildPromptPlan } from './state/prompts.js';

const ROOM_PREFIX = 'room:';

function roomKey(code) {
  return `${ROOM_PREFIX}${code}`;
}

export function createGameServer(io) {
  const gamesByCode = new Map();

  io.on('connection', (socket) => {
    let currentCode = null;
    let currentPlayerId = null;

    function emitToRoom(event, payload) {
      if (!currentCode) return;
      io.to(roomKey(currentCode)).emit(event, payload);
    }

    function getGame() {
      if (!currentCode) return null;
      return gamesByCode.get(currentCode) || null;
    }

    socket.on('room:create', ({ displayName }) => {
      const code = generateRoomCode();
      const promptPlan = buildPromptPlan();
      const game = new GameManager({ code, promptPlan });
      gamesByCode.set(code, game);

      const player = game.addPlayer({ socketId: socket.id, displayName, isHost: true });
      currentCode = code;
      currentPlayerId = player.playerId;
      socket.join(roomKey(code));
      socket.emit('room:created', { code, player, state: game.publicState() });
      emitToRoom('room:update', game.publicState());
    });

    socket.on('room:join', ({ code, displayName }) => {
      const game = gamesByCode.get(code);
      if (!game) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }
      const player = game.addPlayer({ socketId: socket.id, displayName });
      currentCode = code;
      currentPlayerId = player.playerId;
      socket.join(roomKey(code));
      socket.emit('room:joined', { code, player, state: game.publicState() });
      emitToRoom('room:update', game.publicState());
    });

    socket.on('game:start', () => {
      const game = getGame();
      if (!game) return;
      if (!game.isHost(currentPlayerId)) return;
      game.startGame();
      emitToRoom('game:update', game.publicState());
    });

    socket.on('round:submit', ({ text }) => {
      const game = getGame();
      if (!game) return;
      game.submitSentence({ playerId: currentPlayerId, text });
      emitToRoom('game:update', game.publicState());
    });

    socket.on('judge:choose', ({ winnerPlayerId }) => {
      const game = getGame();
      if (!game) return;
      game.chooseWinner({ chooserPlayerId: currentPlayerId, winnerPlayerId });
      emitToRoom('game:update', game.publicState());
      // Persist story snippet when round ends
      if (game.state.status === 'intermission' && game.state.roundIndex >= 0) {
        io.emit('story:append', { code: game.code, line: game.state.story.at(-1) });
      }
    });

    socket.on('game:next', () => {
      const game = getGame();
      if (!game) return;
      if (!game.isHost(currentPlayerId)) return;
      game.advance();
      emitToRoom('game:update', game.publicState());
    });

    socket.on('disconnect', () => {
      const game = getGame();
      if (!game) return;
      game.removePlayer(currentPlayerId);
      emitToRoom('game:update', game.publicState());
      if (game.isEmpty()) {
        gamesByCode.delete(currentCode);
      }
    });
  });
}

function generateRoomCode() {
  return nanoid(5).toUpperCase();
}
