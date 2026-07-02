import { HAB_EVENTS } from './hab_events.js';

// Future checkpoints append MINING_EVENTS, EXPEDITION_EVENTS, FACTION_EVENTS,
// ENDING_EVENTS here. Engine treats this as one flat pool keyed by id.
export const ALL_EVENTS = [
  ...HAB_EVENTS
];
