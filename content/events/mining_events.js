export const MINING_EVENTS = [
  {
    id: 'rig_systems_online',
    once: true,
    ambient: true,
    requires: (state) => state.day >= 1 && state.stores.power >= 10,
    title: 'Drone Bay Online',
    text: 'With the reactor stable, KESTREL brings the drone bay back up. Two mining drones, both scoured with impact scarring, both apparently still rated for service. "Extraction quota resumes on your authorization," KESTREL says. It does not sound like it\'s looking forward to this either.',
    choices: [
      {
        label: 'Authorize the drones',
        effect: (sm) => {
          sm.setFlag('mining_unlocked', true);
        },
        log: 'The mining bay is open. Two drones, standing by.'
      }
    ]
  },
  {
    id: 'voss_contact',
    once: true,
    ambient: true,
    requires: (state) => state.flags.mining_unlocked && state.day >= 2,
    title: 'Incoming Transmission',
    text: 'An unencrypted hail, not Company format. "Rig two hundred klicks spinward, this is Voss — you\'re new on that frequency, or new on that rig. Either way, welcome to the belt. Figured I\'d say hello before the Company does."',
    choices: [
      {
        label: 'Respond — glad for the company',
        next: null,
        effect: (sm) => {
          sm.meetCompanion('voss');
          sm.trustCompanion('voss', 2);
        },
        log: 'Voss laughs. "Good. You\'ll want a friendly channel out here. Ping me if the quiet gets to you."'
      },
      {
        label: 'Respond briefly, stay guarded',
        effect: (sm) => {
          sm.meetCompanion('voss');
          sm.trustCompanion('voss', 1);
        },
        log: 'Voss doesn\'t push. "Fair. Channel\'s open when you change your mind."'
      }
    ]
  },
  {
    id: 'quota_call_renn',
    once: true,
    ambient: true,
    requires: (state) => state.flags.mining_unlocked && state.day >= 3,
    title: 'Priority Channel — Kessler-Voss Extraction',
    text: '"Contractor, this is Auditor Renn, quota compliance division. Routine check-in — I see your drones are active, which is good, because your onboarding cycle grace period ends this week." Pleasant. Procedural. Not actually a question.',
    choices: [
      {
        label: 'Confirm compliance, ask no questions',
        effect: (sm) => {
          sm.meetCompanion('renn');
          sm.trustCompanion('renn', 2);
          sm.adjustFaction('company', 3);
          sm.setFlag('renn_stance', 'compliant');
        },
        log: '"Excellent. I\'ll note the cooperation." You can hear her actually typing it.',
        scheduleAfterDays: 4,
        scheduleEventId: 'quota_followup'
      },
      {
        label: 'Ask what happened to the rig\'s last contractor',
        effect: (sm) => {
          sm.meetCompanion('renn');
          sm.adjustFaction('company', -2);
          sm.setFlag('renn_stance', 'pushed');
        },
        log: 'A pause, half a second too long. "That information isn\'t relevant to your contract, contractor." The line clicks off before you can push further.',
        scheduleAfterDays: 4,
        scheduleEventId: 'quota_followup'
      }
    ]
  },
  {
    id: 'quota_followup',
    once: true,
    title: 'Follow-up Check-in',
    text: (state) => state.flags.renn_stance === 'compliant'
      ? 'Renn calls back, warmer this time. "Your numbers are ahead of projection. Whatever you\'re doing, keep doing it — I\'m flagging your file as low-maintenance, which out here is the nicest thing anyone will say about you."'
      : 'Renn calls back, colder this time. "Just so you\'re aware — asking about prior contractors\' status is a flagged query. It\'s noted. It doesn\'t need to happen again."',
    choices: [
      {
        label: 'Acknowledge and end the call',
        effect: (sm) => {
          if (sm.state.flags.renn_stance === 'compliant') {
            sm.trustCompanion('renn', 2);
            sm.adjustFaction('company', 2);
          } else {
            sm.adjustFaction('company', -3);
            sm.adjustFaction('union', 1);
          }
        },
        log: 'The channel closes. Whatever this is building toward, it isn\'t finished.'
      }
    ]
  },
  {
    id: 'ore_anomaly_sighting',
    once: true,
    ambient: true,
    requires: (state) => state.flags.mining_unlocked && state.flags.ore_mined_once,
    title: 'Drone Return — Anomalous Reading',
    text: 'One of the drones comes back from the south vein with a sample that doesn\'t match any catalog entry KESTREL has. Doesn\'t register on standard spectrometry. Faintly warm to the touch, which a rock should not be.',
    choices: [
      {
        label: 'Report the find to the Company',
        effect: (sm, notif, eng) => {
          sm.addStore('voidglass', 1);
          sm.adjustFaction('company', 4);
          sm.setFlag('anomaly_reported', true);
          eng.unlockCodexEntry('anomaly_first_sample');
        },
        log: 'You file the report. KESTREL logs the acknowledgment receipt without comment.'
      },
      {
        label: 'Log it as slag, keep the sample quiet',
        effect: (sm, notif, eng) => {
          sm.addStore('voidglass', 1);
          sm.setFlag('anomaly_reported', false);
          eng.unlockCodexEntry('anomaly_first_sample');
        },
        log: 'You mark the entry as unremarkable regolith. The sample goes in a locker that isn\'t on any manifest.'
      }
    ]
  }
];
