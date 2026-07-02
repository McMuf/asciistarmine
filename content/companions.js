// Four recurring companions. `trustStages` are keyed by a minimum trust
// value; the UI shows the highest stage whose threshold has been met. Only
// KESTREL has stages written yet (checkpoint 1 = hab-only content) — Voss,
// Renn, and Juno are introduced in checkpoint 2/3 and get their arcs filled
// then. Defining them now so nothing downstream needs new companion slots.

export const COMPANIONS = {
  kestrel: {
    id: 'kestrel',
    name: 'KESTREL',
    role: 'Hab AI',
    bio: 'The rig\'s onboard intelligence. Bound by Company protocol, but protocol has gaps.',
    trustStages: [
      { min: 0, line: '"Power at critical. Recommend restoring reactor output before doing anything else."' },
      { min: 5, line: '"You talk to the terminal more than you talk to me. I\'m allowed to be a little offended."' },
      { min: 15, line: '"I have re-read your contract eleven thousand times looking for a clause that helps you. There isn\'t one."' }
    ]
  },
  voss: {
    id: 'voss',
    name: 'Voss',
    role: 'Veteran miner, neighboring rig',
    bio: 'Been out here longer than the paperwork says is legal. Knows how to survive an audit.',
    trustStages: []
  },
  renn: {
    id: 'renn',
    name: 'Auditor Renn',
    role: 'Company handler',
    bio: 'Voice on comms. Friendly at first. Never once physically present.',
    trustStages: []
  },
  juno: {
    id: 'juno',
    name: 'Juno',
    role: 'Defector, origin unknown',
    bio: 'Picked up mid-transit. Loyalty depends entirely on how you\'ve played everyone else.',
    trustStages: []
  }
};

export function companionLine(id, trust) {
  const c = COMPANIONS[id];
  if (!c) return null;
  const eligible = c.trustStages.filter((s) => trust >= s.min);
  if (!eligible.length) return null;
  return eligible[eligible.length - 1].line;
}
