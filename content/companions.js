// Four recurring companions. `trustStages` are keyed by a minimum trust
// value; the UI shows the highest stage whose threshold has been met. Only
// KESTREL has stages written yet (checkpoint 1 = hab-only content), Voss,
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
    trustStages: [
      { min: 0, line: '"Name\'s Voss. Rig two hundred klicks spinward. Figured I\'d say hello before the Company does, trust me, you want to hear a human voice first."' },
      { min: 5, line: '"You didn\'t report that anomaly, did you. Smart. Or stupid. Ask me again in a month."' },
      { min: 15, line: '"Eleven years on contract. I have never once seen the debt go down. Do the math on that whenever you\'re ready to."' }
    ]
  },
  renn: {
    id: 'renn',
    name: 'Auditor Renn',
    role: 'Company handler',
    bio: 'Voice on comms. Friendly at first. Never once physically present.',
    trustStages: [
      { min: 0, line: '"Kessler-Voss Extraction, quota compliance division. This is a routine check-in, nothing to worry about, contractor."' },
      { min: 5, line: '"You\'re easy to work with. I mean that. Keep it up and I\'ll make sure your file reflects it."' },
      { min: 15, line: '"Between us, and I shouldn\'t say this, you\'re doing better than the projections had you. That matters more than you think."' }
    ]
  },
  juno: {
    id: 'juno',
    name: 'Juno',
    role: 'Survivor, derelict rig',
    bio: 'Welded herself into a locker rather than face whatever took her crew. Says it wasn\'t pirates. Doesn\'t say what it was.',
    trustStages: [
      { min: 0, line: '"Independent contract. Not Company, not registered to that rig. That\'s all you need to know for now."' },
      { min: 5, line: '"You want to know what happened over there. Everyone does. I\'ll tell you when I trust you not to report it."' },
      { min: 15, line: '"It wasn\'t pirates, and it wasn\'t an accident, and the Company knew before I did. Ask me the rest when we\'re somewhere they can\'t hear it."' }
    ]
  }
};

export function companionLine(id, trust) {
  const c = COMPANIONS[id];
  if (!c) return null;
  const eligible = c.trustStages.filter((s) => trust >= s.min);
  if (!eligible.length) return null;
  return eligible[eligible.length - 1].line;
}
