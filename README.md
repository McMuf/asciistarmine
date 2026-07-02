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

**Checkpoint 2** — mining loop (drill iron/nickel, smelt into steel), Voss
(neighboring rig, first contact) and Auditor Renn (Company handler) introduced
with dialogue, a second branching chain (quota check-in — comply vs. push
back, consequence 4 days later, first faction rep movement), and the first
sighting of the anomalous ore (Voidglass).

**Checkpoint 3** — faction reputation starts having teeth: a Company audit
triggers at low standing, Voss makes a real ask (falsify logs) at high trust,
pirates make first contact demanding tribute, and the Consortium reaches out
once the anomalous sample is on record. Also: the first expedition (derelict
rig, reachable via the checkpoint-1 distress bearing), a multi-stage
branching site with a genuine outcome fork — investigate further and
(optionally) rescue Juno, or take the fast loot-and-retreat option and miss
her entirely.

**Checkpoint 4** — the four ending arcs, each a fixed 4-checkpoint spine
(setup → real ask → escalation → resolution) with 2-3 flavor choices per
checkpoint that never change which checkpoint comes next — "fixed
checkpoints, variation between them," as designed:
- **Consortium — "The Deep Signal"**: reachable independent of the political
  factions, via the anomalous-ore thread (Voidglass + Consortium contact).
  Three distinct final choices (release / destroy / merge).
- **Union — "Free Rig"**: reachable at high Union standing. Ends in a
  mutiny; the epilogue text reacts to which companions you'd recruited.
- **Pirates — "The Long Black"**: reachable at high Pirate standing. Ends
  with defection to the fleet.
- **Company — "The Promotion"**: reachable at high Company standing, or as
  the default fallback if no faction relationship is strong enough by day
  15 — the horror-twist ending, playing "the ore was never just ore" out to
  its logical conclusion.

Which arc triggers is decided automatically from faction reputation (or the
Voidglass/Consortium thread) — no manual arc selection needed. Once an
ending resolves, the survival tick stops and the header banner shows which
ending landed.

The full loop (Act 1 hab survival → Act 2 mining/quotas → Act 3 faction
consequences + derelict expedition → Act 4 ending arc) is now playable
start to finish.
