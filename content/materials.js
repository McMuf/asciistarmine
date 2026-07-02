// Full material catalogue for the game. Not all of these are mineable yet in
// Act 1, later acts (mining, expedition, deep sites) unlock extraction for
// higher tiers. Kept as flat data so the engine never needs a new branch per
// material.

export const MATERIALS = [
  // Tier 0, survival resources, generated/consumed rather than "mined"
  { id: 'power', name: 'Power', tier: 0, category: 'survival',
    description: 'Reactor output. Runs everything in the hab, drills, comms, life support, the terminal.' },
  { id: 'o2', name: 'Oxygen', tier: 0, category: 'survival',
    description: 'Scrubber charge. Drains slower than power but kills faster when it runs out.' },
  { id: 'water', name: 'Water Ice', tier: 0, category: 'survival',
    description: 'Cracked from subsurface ice deposits. Feeds the scrubber and, later, hydroponics.' },

  // Tier 1, raw ore, common, low value, quota filler
  { id: 'iron_ore', name: 'Iron Ore', tier: 1, category: 'ore',
    description: 'Unrefined. The Company measures your worth in tons of this.' },
  { id: 'nickel_ore', name: 'Nickel Ore', tier: 1, category: 'ore',
    description: 'Common in metallic asteroids. Alloys with iron for structural steel.' },
  { id: 'regolith', name: 'Regolith', tier: 1, category: 'ore',
    description: 'Loose surface material. Mostly useless except as sintered hull patch.' },

  // Tier 2, refined materials, require a smelter
  { id: 'steel', name: 'Steel', tier: 2, category: 'refined',
    description: 'Smelted iron and nickel. Base input for tools, drone parts, hull repair.' },
  { id: 'copper', name: 'Copper', tier: 2, category: 'refined',
    description: 'Wiring, coils, anything that needs to carry current.' },
  { id: 'alloy', name: 'Aluminum Alloy', tier: 2, category: 'refined',
    description: 'Light structural material. Ship and drone frames.' },

  // Tier 3, valuable ore, functions as currency
  { id: 'titanium', name: 'Titanium', tier: 3, category: 'valuable',
    description: 'Reliable, high-margin. What the Company actually wants from you.' },
  { id: 'palladium', name: 'Palladium', tier: 3, category: 'valuable',
    description: 'Catalyst-grade. Rare enough to matter, common enough to trade.' },
  { id: 'platinum', name: 'Platinum', tier: 3, category: 'valuable',
    description: 'The closest thing this economy has to hard currency.' },

  // Tier 4, contraband, acquired not mined
  { id: 'black_parts', name: 'Black-market Components', tier: 4, category: 'contraband',
    description: 'No serial numbers. However you got these, the Company would like to ask.' },
  { id: 'forged_manifest', name: 'Forged Manifest', tier: 4, category: 'contraband',
    description: 'A cargo record that says whatever you need it to say, as long as no one checks twice.' },

  // Tier 5, the anomalous ore, plot-critical
  { id: 'voidglass', name: 'Voidglass', tier: 5, category: 'anomalous',
    description: 'Doesn\'t register on standard spectrometry. Faintly warm. Every faction wants a sample for a different reason.' }
];

export function getMaterial(id) {
  return MATERIALS.find((m) => m.id === id);
}
