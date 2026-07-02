// Four ending arcs, each a fixed 4-checkpoint spine (CP1-CP4). Which arc
// triggers is decided by faction standing (or, for the Consortium arc, by
// the anomalous-ore thread independent of politics), see requires() below.
// Within each checkpoint the player's choice only changes flavor/log text
// and minor flag state, never which checkpoint comes next: that's the
// "fixed checkpoints, infinite variation between them" structure.

function dominantPoliticalFaction(state) {
  const { company, union, pirates } = state.factions;
  const max = Math.max(company, union, pirates);
  if (max < 15) return null;
  if (company === max) return 'company';
  if (union === max) return 'union';
  return 'pirates';
}

export const ENDING_EVENTS = [
  // ---------------- CONSORTIUM, "The Deep Signal" ----------------
  {
    id: 'consortium_cp1',
    once: true,
    ambient: true,
    requires: (state) =>
      !state.flags.arc_locked &&
      state.flags.consortium_contacted &&
      (state.stores.voidglass || 0) >= 3 &&
      state.day >= 8,
    title: 'The Deep Signal, First Contact',
    text: 'The Consortium doesn\'t ask for tribute or quota. They send coordinates, a deposit past the edge of any Company survey, and a single line: "Three samples confirms a pattern. We need to know if we\'re right." KESTREL flags the coordinates as outside any jurisdiction that would come looking for you.',
    choices: [
      {
        label: 'Send the samples and open a real dialogue',
        effect: (sm) => { sm.setFlag('arc_locked', true); sm.setFlag('arc', 'consortium'); },
        log: 'You send everything you\'ve got. The reply comes back faster than seems reasonable for the distance involved.',
        scheduleAfterDays: 3,
        scheduleEventId: 'consortium_cp2'
      },
      {
        label: 'Send the samples but keep them at arm\'s length',
        effect: (sm) => { sm.setFlag('arc_locked', true); sm.setFlag('arc', 'consortium'); },
        log: 'You send the samples with no note attached. They answer anyway.',
        scheduleAfterDays: 3,
        scheduleEventId: 'consortium_cp2'
      }
    ]
  },
  {
    id: 'consortium_cp2',
    once: true,
    title: 'The Deep Deposit',
    text: 'The coordinates lead to a vein that shouldn\'t exist by any geological model KESTREL has, too regular, too deliberate, laid out less like ore and more like wreckage. Voidglass here isn\'t scattered. It\'s structured. You are, unmistakably, standing inside something that was built.',
    choices: [
      {
        label: 'Map the structure fully before extracting anything',
        effect: (sm) => sm.addStore('voidglass', 2),
        log: 'You take your time. Whatever this place is, it\'s waited this long, a few more hours won\'t matter.',
        scheduleAfterDays: 3,
        scheduleEventId: 'consortium_cp3'
      },
      {
        label: 'Grab what you can and get out before you think better of it',
        effect: (sm) => sm.addStore('voidglass', 1),
        log: 'You take the fast option. Something about the place makes fast feel correct.',
        scheduleAfterDays: 3,
        scheduleEventId: 'consortium_cp3'
      }
    ]
  },
  {
    id: 'consortium_cp3',
    once: true,
    title: 'What the Archive Says',
    text: 'The Consortium finishes decrypting the fragments you\'ve been feeding them for months, and this time they call instead of writing. Voidglass isn\'t ore. It\'s residue, what\'s left after something extracted every usable resource from a civilization\'s worlds, systematically, on a schedule, the way you extract ore on yours. The "harvest" ended a long time ago. It didn\'t end because it finished.',
    choices: [
      {
        label: '"It ended because it moved on to the next system."',
        effect: (sm, notif, eng) => eng.unlockCodexEntry('archive_truth'),
        log: 'The silence on the other end confirms it before anyone says it out loud.',
        scheduleAfterDays: 3,
        scheduleEventId: 'consortium_cp4'
      },
      {
        label: '"Ask them what they want to do about it."',
        effect: (sm, notif, eng) => eng.unlockCodexEntry('archive_truth'),
        log: '"That," the Consortium researcher says, "is exactly the question we were hoping you\'d ask first."',
        scheduleAfterDays: 3,
        scheduleEventId: 'consortium_cp4'
      }
    ]
  },
  {
    id: 'consortium_cp4',
    once: true,
    title: 'The Deep Signal, Choice',
    text: 'The structure at the deposit core is still active, just barely, a beacon, maybe, or a key. The Consortium can\'t agree on what happens if you trigger it, only that you\'re the one standing next to it. Release the signal outward, destroy it before anyone else finds it, or fold it into your own systems and carry the truth with you. There isn\'t a fourth option. There was never going to be a clean one.',
    choices: [
      {
        label: 'Release the signal, let everyone hear it, Company included',
        effect: (sm) => { sm.setFlag('game_complete', true); sm.setFlag('ending_id', 'consortium_release'); },
        log: 'EPILOGUE: THE DEEP SIGNAL, RELEASED: The beacon goes out system-wide, unencrypted, in every band the Company monitors and several they don\'t. You don\'t know yet what it changes. You know it can\'t be unheard. For the first time since you woke up in that hab, the silence out here means something other than being alone in it.'
      },
      {
        label: 'Destroy it, no one gets this, least of all the Company',
        effect: (sm) => { sm.setFlag('game_complete', true); sm.setFlag('ending_id', 'consortium_destroy'); },
        log: 'EPILOGUE: THE DEEP SIGNAL, DESTROYED: The structure collapses in on itself, quietly, the way things that have waited a long time tend to end. The Consortium is furious. You\'re not entirely sure you made the wrong call. Some questions are better left as questions than as leverage in someone else\'s hands.'
      },
      {
        label: 'Merge with it, carry the signal, become the record',
        effect: (sm) => { sm.setFlag('game_complete', true); sm.setFlag('ending_id', 'consortium_merge'); },
        log: 'EPILOGUE: THE DEEP SIGNAL, CARRIED: It doesn\'t feel like anything, at first. Then KESTREL asks if you\'re still you, and means it as a real question. You think the answer is yes. You think the answer will keep being yes, for as long as you keep choosing to remember why you said it release matters. You are, now, the only archive that\'s left.'
      }
    ]
  },

  // ---------------- UNION, "Free Rig" ----------------
  {
    id: 'union_cp1',
    once: true,
    ambient: true,
    requires: (state) => !state.flags.arc_locked && dominantPoliticalFaction(state) === 'union' && state.day >= 10,
    title: 'Free Rig, The Meeting',
    text: 'Voss doesn\'t call this time, he sends coordinates, a rendezvous, and one line: "Come dark, come quiet, come alone if you can manage it." A dozen other rigs\' worth of contractors are already there when you arrive, all of them people who\'ve spent years learning exactly how much the Company can be pushed before it pushes back.',
    choices: [
      {
        label: 'Commit fully, this is what you\'ve been building toward',
        effect: (sm) => { sm.setFlag('arc_locked', true); sm.setFlag('arc', 'union'); },
        log: 'You say yes before anyone finishes explaining what yes means. Somehow that lands better than caution would have.',
        scheduleAfterDays: 3,
        scheduleEventId: 'union_cp2'
      },
      {
        label: 'Come, listen, commit carefully',
        effect: (sm) => { sm.setFlag('arc_locked', true); sm.setFlag('arc', 'union'); },
        log: 'You ask more questions than anyone else in the room. Voss looks relieved someone finally did.',
        scheduleAfterDays: 3,
        scheduleEventId: 'union_cp2'
      }
    ]
  },
  {
    id: 'union_cp2',
    once: true,
    title: 'Free Rig, The Ask',
    text: 'The plan needs a falsified shipment manifest routed through a rig with smelter access. Yours. It\'s the difference between the Union having leverage and the Union having a slogan. It\'s also the difference between your contract violation being deniable and being provable.',
    choices: [
      {
        label: 'Falsify the manifest, go all in',
        effect: (sm) => sm.adjustFaction('union', 8),
        log: 'The numbers go through clean. You don\'t sleep well that night, but you don\'t regret it either.',
        scheduleAfterDays: 4,
        scheduleEventId: 'union_cp3'
      },
      {
        label: 'Find a smaller way to help without your name on it',
        effect: (sm) => sm.adjustFaction('union', 4),
        log: 'You do less than they asked and more than was safe. It\'s enough to matter without being enough to trace.',
        scheduleAfterDays: 4,
        scheduleEventId: 'union_cp3'
      }
    ]
  },
  {
    id: 'union_cp3',
    once: true,
    title: 'Free Rig, Retaliation',
    text: 'The Company doesn\'t send a warning this time. A repo vessel drops out of transit two hours out, transponder broadcasting a contract-reclamation code you\'ve only ever seen in the memo you weren\'t supposed to have. Voss is already on comms: "We move now, or we don\'t move at all."',
    choices: [
      {
        label: 'Hold the rig and fight the reclamation',
        effect: (sm, notif, eng) => { sm.adjustFaction('union', 5); eng.unlockCodexEntry('company_memo_termination'); },
        log: 'You dig in. It\'s the first time this rig has ever felt like it was actually yours.',
        scheduleAfterDays: 3,
        scheduleEventId: 'union_cp4'
      },
      {
        label: 'Use the leaked memo to expose the reclamation publicly first',
        effect: (sm) => sm.adjustFaction('union', 7),
        log: 'The memo goes out on every open channel in the sector before the repo team can dock. The Company\'s silence is its own kind of confession.',
        scheduleAfterDays: 3,
        scheduleEventId: 'union_cp4'
      },
      {
        label: 'Evacuate and regroup with the rest of the Union fleet',
        effect: (sm) => sm.adjustFaction('union', 3),
        log: 'You cut losses on the rig itself. Voss says that was always the plan for someone, didn\'t think it\'d be you.',
        scheduleAfterDays: 3,
        scheduleEventId: 'union_cp4'
      }
    ]
  },
  {
    id: 'union_cp4',
    once: true,
    title: 'Free Rig, Mutiny',
    text: (state) => {
      const allies = [];
      if (state.companions.voss.met) allies.push('Voss');
      if (state.companions.juno.met) allies.push('Juno');
      if (state.companions.kestrel.trust >= 5) allies.push('KESTREL');
      const allyText = allies.length ? `${allies.join(', ')} stood with you through it.` : 'You did most of it alone.';
      return `The reclamation fails. Not because you won outright, but because enough rigs went dark on the Company\'s tracking at once that "enough" became its own kind of victory. ${allyText} The debt on paper still says you owe Kessler-Voss Extraction a number that was always going to be unpayable. Out here, past the edge of where they still enforce it, that number is starting to mean less every day.`;
    },
    choices: [
      {
        label: 'Accept the free rig, debt and all',
        effect: (sm) => { sm.setFlag('game_complete', true); sm.setFlag('ending_id', 'union_free_rig'); },
        log: 'EPILOGUE: FREE RIG: You\'re still a contractor on paper. Paper is about the only place the Company still reaches out here.'
      }
    ]
  },

  // ---------------- PIRATES, "The Long Black" ----------------
  {
    id: 'pirates_cp1',
    once: true,
    ambient: true,
    requires: (state) => !state.flags.arc_locked && dominantPoliticalFaction(state) === 'pirates' && state.day >= 10,
    title: 'The Long Black, The Offer',
    text: 'The tribute demands stop. What replaces them is stranger: a direct, encrypted, personal offer. "You pay on time, you don\'t ask questions, and half the fleet already likes you better than they like most of their own. Come fly with people who don\'t pretend the debt is fair."',
    choices: [
      {
        label: 'Accept without hesitation',
        effect: (sm) => { sm.setFlag('arc_locked', true); sm.setFlag('arc', 'pirates'); },
        log: 'You say yes and mean it. It\'s the first offer anyone\'s made you out here that didn\'t come with fine print.',
        scheduleAfterDays: 3,
        scheduleEventId: 'pirates_cp2'
      },
      {
        label: 'Accept, but keep your reasons to yourself',
        effect: (sm) => { sm.setFlag('arc_locked', true); sm.setFlag('arc', 'pirates'); },
        log: 'You say yes. You don\'t tell them it\'s less about the fleet and more about not being Company property anymore.',
        scheduleAfterDays: 3,
        scheduleEventId: 'pirates_cp2'
      }
    ]
  },
  {
    id: 'pirates_cp2',
    once: true,
    title: 'The Long Black, Proving It',
    text: (state) => state.companions.voss.met
      ? 'The loyalty test is a target list, and Voss\'s rig is on it, flagged for a tribute raid regardless of what you decide. "Nobody\'s exempt," the fleet contact says. "That\'s the point of the rule."'
      : 'The loyalty test is a target list, a rig flagged for a tribute raid, no names you recognize on the crew roster, which somehow doesn\'t make the choice easier.',
    choices: [
      {
        label: 'Run the raid as ordered',
        effect: (sm) => sm.adjustFaction('pirates', 8),
        log: 'You do it clean and fast and don\'t look at the logs afterward longer than you have to.',
        scheduleAfterDays: 4,
        scheduleEventId: 'pirates_cp3'
      },
      {
        label: 'Warn the target rig quietly, then fake the raid report',
        effect: (sm) => sm.adjustFaction('pirates', 4),
        log: 'You give them time to scatter their good stock before you show up. The report says the raid was a bust. Nobody checks the math too closely.',
        scheduleAfterDays: 4,
        scheduleEventId: 'pirates_cp3'
      }
    ]
  },
  {
    id: 'pirates_cp3',
    once: true,
    title: 'The Long Black, Burning the Name',
    text: 'There\'s a threshold the fleet doesn\'t let you stay on the safe side of forever: burn your Company identity for real, permanently, transponder and contract number and all, or stay a contractor who occasionally does the fleet favors. Half-measures stopped being available the day you ran the raid.',
    choices: [
      {
        label: 'Burn it. All the way. No going back.',
        effect: (sm) => sm.adjustFaction('pirates', 6),
        log: 'KESTREL asks, very carefully, if you\'re certain. You tell it yes. It doesn\'t ask twice.',
        scheduleAfterDays: 3,
        scheduleEventId: 'pirates_cp4'
      },
      {
        label: 'Burn it quietly, keep the old name as a fallback rumor',
        effect: (sm) => sm.adjustFaction('pirates', 3),
        log: 'You let the Company think you\'re dead rather than defected. Easier for everyone, including you, some days.',
        scheduleAfterDays: 3,
        scheduleEventId: 'pirates_cp4'
      }
    ]
  },
  {
    id: 'pirates_cp4',
    once: true,
    title: 'The Long Black, Joining the Fleet',
    text: 'There\'s no ceremony. Just a new berth, a fleet-wide broadcast acknowledging a new hull under Long Black colors, and Voss\'s voice on an open channel if he\'s still around: some version of "told you the math never worked out in the Company\'s favor forever."',
    choices: [
      {
        label: 'Take the berth. You\'re out.',
        effect: (sm) => { sm.setFlag('game_complete', true); sm.setFlag('ending_id', 'pirates_long_black'); },
        log: 'EPILOGUE: THE LONG BLACK: You\'re not innocent. You were never going to get out of that contract innocent. You got out, though, and out there, that turns out to be worth more than clean.'
      }
    ]
  },

  // ---------------- COMPANY, "The Promotion" ----------------
  {
    id: 'company_cp1',
    once: true,
    ambient: true,
    requires: (state) =>
      !state.flags.arc_locked &&
      ((dominantPoliticalFaction(state) === 'company' && state.day >= 10) || state.day >= 15),
    title: 'The Promotion, Notice',
    text: 'Auditor Renn\'s voice again, and for once she sounds genuinely pleased. "Contractor, your file has been flagged for advancement review. Kessler-Voss Extraction doesn\'t do this often. I\'d recommend accepting, the alternative, at this point in your contract cycle, is not advancement."',
    choices: [
      {
        label: 'Accept eagerly, you\'ve earned this',
        effect: (sm) => { sm.setFlag('arc_locked', true); sm.setFlag('arc', 'company'); sm.adjustFaction('company', 5); },
        log: '"Wonderful," Renn says, and you choose, for now, to believe she means it.',
        scheduleAfterDays: 3,
        scheduleEventId: 'company_cp2'
      },
      {
        label: 'Accept warily, "not advancement" was not subtle',
        effect: (sm) => { sm.setFlag('arc_locked', true); sm.setFlag('arc', 'company'); },
        log: 'You say yes. You also, quietly, start keeping better backups of everything.',
        scheduleAfterDays: 3,
        scheduleEventId: 'company_cp2'
      }
    ]
  },
  {
    id: 'company_cp2',
    once: true,
    title: 'The Promotion, The Ask',
    text: (state) => state.companions.voss.met || state.companions.juno.met
      ? 'Advancement review requires "a demonstration of institutional loyalty", Renn\'s phrase for naming names. She already has a short list: contacts with unregistered rigs, comms patterns consistent with Union organizing. She wants you to confirm it.'
      : 'Advancement review requires "a demonstration of institutional loyalty", a signed statement affirming you\'ve had no unregistered contact with independent or Union-affiliated parties during your contract term. It\'s mostly true. Mostly.',
    choices: [
      {
        label: 'Confirm everything they ask',
        effect: (sm) => { sm.adjustFaction('company', 8); sm.trustCompanion('voss', -5); },
        log: 'You sign it. Whatever this costs you, it doesn\'t show up on the paperwork.',
        scheduleAfterDays: 4,
        scheduleEventId: 'company_cp3'
      },
      {
        label: 'Confirm the minimum, protect what you can',
        effect: (sm) => sm.adjustFaction('company', 4),
        log: 'You give them enough to be useful and nothing that gets anyone specifically hurt. You hope. You\'re not entirely sure.',
        scheduleAfterDays: 4,
        scheduleEventId: 'company_cp3'
      }
    ]
  },
  {
    id: 'company_cp3',
    once: true,
    title: 'The Promotion, Summons',
    text: 'A transit authorization arrives, pre-approved, no return leg specified. "Advancement processing is handled in person," Renn explains, in the tone of someone reading a line she\'s read many times before. "Standard procedure. You\'ll want to bring nothing you\'re not prepared to leave behind."',
    choices: [
      {
        label: 'Go. Whatever this is, running from it now is worse.',
        effect: (sm) => sm.adjustFaction('company', 3),
        log: 'The transit pod is nicer than anything you\'ve been issued in your entire contract. That, more than anything Renn has said, is what finally worries you.',
        scheduleAfterDays: 3,
        scheduleEventId: 'company_cp4'
      },
      {
        label: 'Go, but tell someone where you\'re headed first',
        effect: (sm) => sm.adjustFaction('company', 1),
        log: 'You leave a message with the one contact you trust to actually do something with it. You go anyway. There isn\'t a version of this where you don\'t.',
        scheduleAfterDays: 3,
        scheduleEventId: 'company_cp4'
      }
    ]
  },
  {
    id: 'company_cp4',
    once: true,
    title: 'The Promotion, Processing',
    text: 'The advancement facility doesn\'t process people. It processes quota. You understand this the moment the intake technician runs a scan that has nothing to do with a personnel file and everything to do with the same catalog that classifies Voidglass, mass, density, extractable value. Your contract debt was never going to be paid off in ore. It was always going to be paid off in you.',
    choices: [
      {
        label: 'Ask what happens now',
        effect: (sm) => { sm.setFlag('game_complete', true); sm.setFlag('ending_id', 'company_ascension'); },
        log: 'EPILOGUE: THE PROMOTION: "Voluntary extraction," the technician says, like it\'s a kindness that it has a name. Schedule 9 was never a punishment clause. It was always the terms. Somewhere behind you, filed and complete, your contract finally reads paid in full.'
      }
    ]
  }
];
