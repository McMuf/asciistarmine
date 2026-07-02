export const FACTION_EVENTS = [
  {
    id: 'company_audit_warning',
    once: true,
    ambient: true,
    requires: (state) => state.factions.company <= -5,
    title: 'Priority Channel — Compliance Division',
    text: 'Not Renn\'s voice this time — a synthesized one, reading from a template. "Your contract has been flagged for review under Schedule 9 provisions. An inspection team will dock within the cycle. Please have your extraction logs available." You remember exactly what Schedule 9 is, because you weren\'t supposed to.',
    choices: [
      {
        label: 'Falsify the logs to pass inspection (costs steel)',
        effect: (sm) => {
          const affordable = sm.hasStore('steel', 2);
          if (affordable) {
            sm.spend({ steel: 2 });
            sm.adjustFaction('company', 4);
            sm.setFlag('logs_falsified_once', true);
          }
        },
        log: 'You spend a night reforging the numbers instead of sleeping. It holds, for now.'
      },
      {
        label: 'Let the inspection happen honestly',
        effect: (sm) => {
          sm.adjustFaction('company', -6);
        },
        log: 'The inspection team finds exactly what your real numbers say. Nobody is happy about it, including you.'
      }
    ]
  },
  {
    id: 'voss_union_ask',
    once: true,
    ambient: true,
    requires: (state) => state.companions.voss.met && state.companions.voss.trust >= 5,
    title: 'Voss — Off the Record',
    text: 'Voss cuts the pleasantries early. "I\'m going to ask you something and you can say no and we never speak of it again. Your extraction logs — could you run them a little under actual, just for a cycle? Every contractor who does buys the rest of us room to breathe on the quota baseline."',
    choices: [
      {
        label: 'Agree to under-report',
        effect: (sm) => {
          sm.adjustFaction('union', 6);
          sm.adjustFaction('company', -3);
          sm.trustCompanion('voss', 3);
          sm.setFlag('union_first_ask_agreed', true);
        },
        log: '"Knew I liked you," Voss says, and for once doesn\'t sound tired.'
      },
      {
        label: 'Decline — too risky',
        effect: (sm) => {
          sm.trustCompanion('voss', -1);
        },
        log: '"Didn\'t think you would. No hard feelings — channel\'s still open." He sounds like he means it, mostly.'
      }
    ]
  },
  {
    id: 'pirate_hail',
    once: true,
    ambient: true,
    requires: (state) => state.flags.mining_unlocked && state.day >= 5,
    title: 'Unregistered Signal — Weapons-Hot',
    text: 'No hail this polite ever comes with good news. "Rig, this is the Long Black. You\'ve got a working smelter and a light escort. We\'ve got neither reason to leave you alone. Tribute buys you a clean pass through this sector for a cycle."',
    choices: [
      {
        label: 'Pay tribute (costs steel)',
        effect: (sm) => {
          if (sm.hasStore('steel', 3)) {
            sm.spend({ steel: 3 });
            sm.adjustFaction('pirates', 5);
          }
        },
        log: 'The channel goes quiet. Your steel reserve does not.'
      },
      {
        label: 'Refuse and report the hail to the Company',
        effect: (sm) => {
          sm.adjustFaction('pirates', -6);
          sm.adjustFaction('company', 3);
        },
        log: 'The Company thanks you for the intel, in the exact tone that means they will not be sending help.'
      }
    ]
  },
  {
    id: 'consortium_contact',
    once: true,
    ambient: true,
    requires: (state) => state.codex.unlocked.includes('anomaly_first_sample') && state.day >= 6,
    title: 'Encrypted Inbound — Non-Company Origin',
    text: 'A tightly-compressed burst transmission, source scrubbed. "We know what you found in the south vein. We are not the Company and we are not interested in your quota. We are interested in the sample. We can make it worth your while — knowledge the Company will never hand you."',
    choices: [
      {
        label: 'Open a channel with the Consortium',
        effect: (sm) => {
          sm.adjustFaction('consortium', 6);
          sm.setFlag('consortium_contacted', true);
        },
        log: 'You send an acknowledgment. Whoever they are, they answer fast — faster than the Company ever has.'
      },
      {
        label: 'Ignore it — one more unverified sender',
        effect: (sm) => {
          sm.setFlag('consortium_contacted', false);
        },
        log: 'You let the burst transmission expire unanswered. It doesn\'t try again — not yet.'
      }
    ]
  }
];
