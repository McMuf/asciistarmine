# ASCIISTARMINE

ASCII idle/adventure text game. You're a contract miner for an interstellar
extraction corporation, working an isolated rig, trying to survive quotas,
factions, and whatever the anomalous ore actually is.

Structure loosely follows [A Dark Room](https://github.com/doublespeakgames/adarkroom):
a generic engine (state manager, event scheduler, buttons, notifications)
driven entirely by data files under `content/`, so new events/lore/factions
never require touching engine code.

## Running

```
npm install
npm run dev
```

## Project layout

- `script/` — engine (state manager, event engine, UI wiring). Generic, no game-specific text.
- `content/` — all game content as data: materials, factions, companions, codex entries, event pools.
- `content/events/index.js` — aggregates every event pool into the engine's event table.

## Status

**Checkpoint 1** — project scaffold + engine core + Act 1 (Hab module): reactor/O2
survival loop, KESTREL (hab AI) intro, first codex unlocks, and a branching
event chain (distress signal — investigate vs. ignore, consequence lands 3
in-game days later) demonstrating the chain system the rest of the game
content builds on.

Planned next:
- Checkpoint 2 — mining loop, wider event pool, remaining companions (Voss, Renn, Juno)
- Checkpoint 3 — faction reputation consequences, expedition/wreck content
- Checkpoint 4 — four ending arcs (Company / Union / Pirates / Consortium)
