const PLAN = [
  { category: 'Backstory', prompt: 'Describe the unlikely hero and their peculiar hometown.' },
  { category: 'Backstory', prompt: 'Reveal the hero\'s secret talent that no one believes.' },
  { category: 'Conflict', prompt: 'Introduce the bizarre problem plaguing the town.' },
  { category: 'Conflict', prompt: 'Describe the first failed attempt to fix it.' },
  { category: 'Conflict', prompt: 'A twist appears: an ally is not what they seem.' },
  { category: 'Conflict', prompt: 'The stakes rise: what could go hilariously wrong next?' },
  { category: 'Resolution', prompt: 'Set up the final plan that cannot possibly fail.' },
  { category: 'Resolution', prompt: 'A surprise move changes everything at the last second.' },
  { category: 'Resolution', prompt: 'Tie up the loose ends with flair.' },
  { category: 'Resolution', prompt: 'Deliver the final punchline/lesson of the tale.' },
];

export function buildPromptPlan() {
  // Could be randomized or genre-weighted in future.
  return PLAN.map((p) => ({ ...p }));
}

export const GENRES = [
  'Fantasy',
  'Sci-Fi',
  'Mystery',
  'Rom-Com',
  'Noir',
  'Western',
  'Cyberpunk',
  'Fairy Tale',
];
