export const EXPEDITION_EVENTS = [
  {
    id: 'expedition_derelict_1',
    once: true,
    title: 'The Derelict',
    text: 'The pod matches orbit with the rig from the distress bearing. No running lights. No transponder. The hull is scored in long parallel gouges that don\'t match any impact pattern KESTREL has on file. "Airlock cycling manually," KESTREL says. "Whatever did this didn\'t bother closing the door behind it."',
    choices: [
      {
        label: 'Force the airlock and move fast',
        next: 'expedition_derelict_2',
        effect: (sm) => sm.addStore('o2', -2),
        log: 'Speed over subtlety. If anything\'s still aboard, it knows you\'re here now.'
      },
      {
        label: 'Cut in quietly and take it slow',
        next: 'expedition_derelict_2',
        effect: (sm) => sm.addStore('power', -2),
        log: 'Slower, and it costs you power you\'d rather have spent elsewhere, but the rig stays quiet around you.'
      }
    ]
  },
  {
    id: 'expedition_derelict_2',
    once: true,
    title: 'What\'s Left',
    text: 'The crew quarters are empty in the specific way that means someone left in a hurry, not the way that means someone was taken. Tool marks on the inner airlock seal, someone welded it from this side. A logbook, hand-written, the last entry cut off mid-sentence: "not a mining accident, they came in through the..."',
    choices: [
      {
        label: 'Push further into the rig',
        next: 'expedition_derelict_3',
        effect: (sm, notif, eng) => {
          eng.unlockCodexEntry('derelict_logbook');
        }
      },
      {
        label: 'Take the logbook and retreat now',
        effect: (sm, notif, eng) => {
          sm.addStore('titanium', 2);
          sm.addStore('scrap', 4);
          sm.setFlag('juno_missed', true);
          eng.unlockCodexEntry('derelict_logbook');
        },
        log: 'You grab what\'s loose and get back to the pod. Whatever happened here, you decide it isn\'t your problem.'
      }
    ]
  },
  {
    id: 'expedition_derelict_3',
    once: true,
    title: 'Sealed Compartment',
    text: 'Behind the welded seal: a maintenance locker, hand-patched from the inside with suit tape and scavenged plating. Someone sealed themselves in. Someone is, against every reasonable expectation, still breathing, barely, on a scrubber cycle that has maybe an hour left in it.',
    choices: [
      {
        label: 'Cut her out and bring her aboard',
        effect: (sm, notif, eng) => {
          sm.meetCompanion('juno');
          sm.trustCompanion('juno', 3);
          sm.setFlag('juno_rescued', true);
          sm.addStore('titanium', 1);
          eng.unlockCodexEntry('juno_found');
        },
        log: 'She doesn\'t say much at first. Mostly she just breathes, like she\'s making sure she still can.'
      },
      {
        label: 'Strip the compartment\'s supplies and leave, too risky',
        effect: (sm) => {
          sm.addStore('titanium', 3);
          sm.addStore('scrap', 3);
          sm.setFlag('juno_missed', true);
        },
        log: 'You take the supplies and seal the compartment back up behind you. You don\'t look at it again on the way out.'
      }
    ]
  },
  {
    id: 'juno_first_words',
    once: true,
    ambient: true,
    requires: (state) => state.flags.juno_rescued,
    title: 'First Words',
    text: '"Juno," she says, finally, once the shakes stop. "Independent contract, not Company, not registered to that rig or any other." She doesn\'t explain the welded door. You don\'t ask yet.',
    choices: [
      {
        label: 'Welcome her aboard',
        effect: (sm) => sm.trustCompanion('juno', 2)
      }
    ]
  }
];
