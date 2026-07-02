// Reputation is a signed integer per faction. Thresholds gate dialogue tone,
// store access, and, eventually, which of the four ending arcs becomes
// reachable. Rep-changing events ship in checkpoint 3; this file just fixes
// the shape so nothing later has to invent new state.

export const FACTIONS = [
  {
    id: 'company',
    name: 'Kessler-Voss Extraction',
    shortName: 'the Company',
    description: 'Your employer. Owns the rig, the contract, and technically the air you\'re breathing.',
    thresholds: {
      hostile: -20,
      cold: -5,
      neutral: 0,
      trusted: 15,
      favored: 30
    }
  },
  {
    id: 'union',
    name: 'Independent Contractors\' Guild',
    shortName: 'the Union',
    description: 'Fellow indentured miners, organizing quietly against quota policy.',
    thresholds: { hostile: -20, cold: -5, neutral: 0, trusted: 15, favored: 30 }
  },
  {
    id: 'pirates',
    name: 'The Long Black Fleet',
    shortName: 'the Pirates',
    description: 'Mostly ex-contract miners who defaulted. Extremely willing to explain why.',
    thresholds: { hostile: -20, cold: -5, neutral: 0, trusted: 15, favored: 30 }
  },
  {
    id: 'consortium',
    name: 'Xenogeological Research Consortium',
    shortName: 'the Consortium',
    description: 'Independent scientists chasing the anomalous ore. No stake in the other three factions\' fight.',
    thresholds: { hostile: -20, cold: -5, neutral: 0, trusted: 15, favored: 30 }
  }
];

export function factionStanding(faction, rep) {
  const t = faction.thresholds;
  if (rep >= t.favored) return 'favored';
  if (rep >= t.trusted) return 'trusted';
  if (rep >= t.neutral) return 'neutral';
  if (rep >= t.cold) return 'cold';
  return 'hostile';
}
