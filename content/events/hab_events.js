export const HAB_EVENTS = [
  {
    id: 'wake',
    once: true,
    title: 'Cycle Start',
    text: 'Cold. Dark. A red emergency glyph pulses on the ceiling panel above your bunk.',
    choices: [
      {
        label: 'Sit up and look around',
        next: 'wake_2'
      }
    ]
  },
  {
    id: 'wake_2',
    once: true,
    title: 'Cycle Start',
    text: 'Somewhere under the floor plating, the reactor is idling at minimum, enough to keep you breathing and nothing else. Your contract terminal is dead. Your suit log says fourteen months have passed since the last entry you remember writing.',
    choices: [
      {
        label: 'Force the reactor online',
        next: 'kestrel_boot',
        effect: (sm) => {
          sm.addStore('power', 4);
        }
      }
    ]
  },
  {
    id: 'kestrel_boot',
    once: true,
    title: 'System Boot',
    text: 'The overhead panel flickers, then steadies. "Reactor stabilized. Welcome back, contractor." The voice is flat, procedural, and immediately starts reading you your own vitals like it\'s reciting a grocery list. "I am KESTREL, rig-assigned intelligence. I have been running on backup power for one hundred and nine days waiting for someone to do that."',
    choices: [
      {
        label: 'Ask what happened to the last crew',
        next: 'kestrel_first_log',
        effect: (sm) => {
          sm.meetCompanion('kestrel');
          sm.trustCompanion('kestrel', 1);
        }
      },
      {
        label: 'Ask about the contract terminal',
        next: 'kestrel_contract',
        effect: (sm) => {
          sm.meetCompanion('kestrel');
        }
      }
    ]
  },
  {
    id: 'kestrel_first_log',
    once: true,
    title: 'KESTREL',
    text: '"I am not authorized to answer that directly." A pause, long, for a machine. "I am, however, authorized to leave their personal logs in local storage, which I never got around to purging. Draw your own conclusions."',
    choices: [
      {
        label: 'Pull the logs',
        effect: (sm, notif, eng) => {
          eng.unlockCodexEntry('tenant_log_1');
        },
        log: 'A codex entry unlocked: previous crew logs found in local storage.'
      }
    ]
  },
  {
    id: 'kestrel_contract',
    once: true,
    title: 'KESTREL',
    text: '"Your contract terminal requires a live Company uplink, which requires more power than this reactor currently produces. I can show you the onboarding fragment cached locally, if that helps." It doesn\'t sound like it thinks that will help.',
    choices: [
      {
        label: 'Read the fragment',
        effect: (sm, notif, eng) => {
          eng.unlockCodexEntry('contract_fragment');
        },
        log: 'A codex entry unlocked: contract fragment, clause 14(c).'
      }
    ]
  },
  {
    id: 'distress_fragment_event',
    once: true,
    ambient: true,
    requires: (state) => state.stores.power >= 8,
    title: 'Comms Ping',
    text: 'KESTREL flags an old, badly corrupted transmission still looping in the comms buffer, fourteen months old, same as everything else. Most of it is static. What survives sounds like a warning.',
    choices: [
      {
        label: 'Isolate and investigate the signal (costs power)',
        next: null,
        effect: (sm, notif, eng) => {
          sm.addStore('power', -3);
          eng.unlockCodexEntry('distress_fragment');
          sm.setFlag('investigated_distress', true);
        },
        log: 'You spend the cycle cleaning up the signal instead of resting.',
        scheduleAfterDays: 3,
        scheduleEventId: 'distress_followup'
      },
      {
        label: 'Log it and move on',
        effect: (sm) => {
          sm.setFlag('investigated_distress', false);
        },
        log: 'You flag the transmission as low-priority and get back to the reactor.',
        scheduleAfterDays: 3,
        scheduleEventId: 'distress_followup'
      }
    ]
  },
  {
    id: 'distress_followup',
    once: true,
    title: 'Three Days Later',
    text: (state) => state.flags.investigated_distress
      ? 'The cleaned-up signal resolves enough to give you a rough bearing, a derelict rig, closer than you\'d like, still broadcasting on a Company emergency band that Company ships have stopped answering.'
      : 'KESTREL mentions, almost offhand, that the same distress signal you logged as low-priority has gone quiet. Not resolved. Just... stopped.',
    choices: [
      {
        label: 'Note the bearing and keep working',
        effect: (sm, notif, eng) => {
          eng.unlockCodexEntry('company_memo_termination');
          sm.setFlag('derelict_bearing_known', true);
        },
        log: 'You keep the coordinates. KESTREL keeps whatever it isn\'t telling you.'
      }
    ]
  }
];
