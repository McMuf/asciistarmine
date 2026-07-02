import { HAB_EVENTS } from './hab_events.js';
import { MINING_EVENTS } from './mining_events.js';
import { FACTION_EVENTS } from './faction_events.js';
import { EXPEDITION_EVENTS } from './expedition_events.js';

// Future checkpoints append ENDING_EVENTS here. Engine treats this as one
// flat pool keyed by id.
export const ALL_EVENTS = [
  ...HAB_EVENTS,
  ...MINING_EVENTS,
  ...FACTION_EVENTS,
  ...EXPEDITION_EVENTS
];
