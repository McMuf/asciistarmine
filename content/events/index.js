import { HAB_EVENTS } from './hab_events.js';
import { MINING_EVENTS } from './mining_events.js';
import { FACTION_EVENTS } from './faction_events.js';
import { EXPEDITION_EVENTS } from './expedition_events.js';
import { ENDING_EVENTS } from './ending_events.js';

// Engine treats this as one flat pool keyed by id. ENDING_EVENTS is ordered
// last so its ambient checkpoints only ever get evaluated after everything
// else this tick, order among the four arc CP1s (inside ending_events.js)
// is what actually decides priority when more than one is eligible at once.
export const ALL_EVENTS = [
  ...HAB_EVENTS,
  ...MINING_EVENTS,
  ...FACTION_EVENTS,
  ...EXPEDITION_EVENTS,
  ...ENDING_EVENTS
];
