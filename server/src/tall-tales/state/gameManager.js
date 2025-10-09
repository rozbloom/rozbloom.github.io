import { nanoid } from 'nanoid';

export class GameManager {
  constructor({ code, promptPlan }) {
    this.code = code;
    this.promptPlan = promptPlan; // array of 10 rounds with categories
    this.players = new Map(); // playerId -> { playerId, socketId, displayName, score, isHost }
    this.hostId = null;

    this.state = {
      status: 'lobby', // lobby | writing | judging | intermission | complete
      roundIndex: -1,
      rounds: promptPlan.map((p) => ({ ...p, submissions: {}, winnerPlayerId: null })),
      currentRaconteurId: null,
      story: [], // array of sentences in order
    };
  }

  addPlayer({ socketId, displayName, isHost = false }) {
    const playerId = nanoid(10);
    const player = { playerId, socketId, displayName, score: 0, isHost };
    this.players.set(playerId, player);
    if (isHost || this.players.size === 1) {
      this.hostId = playerId;
      player.isHost = true;
    }
    return player;
  }

  removePlayer(playerId) {
    if (!playerId) return;
    this.players.delete(playerId);
    if (this.hostId === playerId) {
      const first = [...this.players.values()][0];
      this.hostId = first ? first.playerId : null;
      if (first) first.isHost = true;
    }
  }

  isHost(playerId) {
    return this.hostId === playerId;
  }

  currentRound() {
    if (this.state.roundIndex < 0) return null;
    return this.state.rounds[this.state.roundIndex] || null;
  }

  publicState() {
    const players = [...this.players.values()].map(({ socketId, ...rest }) => rest);
    const currentRound = this.currentRound();
    return {
      code: this.code,
      status: this.state.status,
      roundIndex: this.state.roundIndex,
      players,
      currentRaconteurId: this.state.currentRaconteurId,
      round: currentRound
        ? { category: currentRound.category, prompt: currentRound.prompt, submissions: currentRound.submissions, winnerPlayerId: currentRound.winnerPlayerId }
        : null,
      story: this.state.story,
    };
  }

  startGame() {
    if (this.state.status !== 'lobby') return;
    this.state.roundIndex = 0;
    this.state.status = 'writing';
    this.state.currentRaconteurId = pickRaconteur(this.players, this.state.roundIndex);
  }

  submitSentence({ playerId, text }) {
    if (this.state.status !== 'writing') return;
    const round = this.currentRound();
    if (!round) return;
    round.submissions[playerId] = text;

    const submittedCount = Object.keys(round.submissions).length;
    const eligiblePlayers = [...this.players.values()].filter((p) => p.playerId !== this.state.currentRaconteurId);
    if (submittedCount >= Math.max(1, eligiblePlayers.length)) {
      this.state.status = 'judging';
    }
  }

  chooseWinner({ chooserPlayerId, winnerPlayerId }) {
    if (this.state.status !== 'judging') return;
    if (chooserPlayerId !== this.state.currentRaconteurId) return;
    const round = this.currentRound();
    if (!round || !round.submissions[winnerPlayerId]) return;

    round.winnerPlayerId = winnerPlayerId;
    const winner = this.players.get(winnerPlayerId);
    if (winner) winner.score += 1;

    this.state.story.push(round.submissions[winnerPlayerId]);
    this.state.status = 'intermission';
  }

  advance() {
    if (this.state.status !== 'intermission') return;
    if (this.state.roundIndex >= this.state.rounds.length - 1) {
      this.state.status = 'complete';
      return;
    }
    this.state.roundIndex += 1;
    this.state.status = 'writing';
    this.state.currentRaconteurId = pickRaconteur(this.players, this.state.roundIndex);
  }

  isEmpty() {
    return this.players.size === 0;
  }
}

function pickRaconteur(playersMap, roundIndex) {
  const players = [...playersMap.values()];
  if (players.length === 0) return null;
  const idx = roundIndex % players.length;
  return players[idx].playerId;
}
