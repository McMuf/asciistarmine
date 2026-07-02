// Codex entries are unlocked explicitly by event effects (engine.unlockCodexEntry),
// not by silently-checked conditions — keeps unlock timing authored, not implicit.

export const CODEX = [
  {
    id: 'contract_fragment',
    title: 'Standard Extraction Contract, cl. 14(c)',
    body: '"...in the event of extended non-compliance with tonnage targets, the Company reserves the right to reclassify the contractor\'s remaining obligation as material debt, recoverable by any means enumerated in Schedule 9..." The rest of Schedule 9 is not included in your onboarding packet.'
  },
  {
    id: 'tenant_log_1',
    title: 'Personal Log — Unlisted Crew, Entry 1',
    body: '"Second week on the rig. KESTREL\'s got a personality under the boilerplate, which is more than I can say for my last supervisor. Power\'s stable. Quota\'s tight but doable. Nothing weird yet."'
  },
  {
    id: 'tenant_log_2',
    title: 'Personal Log — Unlisted Crew, Entry 2',
    body: '"Found something in the south vein that isn\'t in the survey data. Didn\'t report it. Probably nothing. Writing this down so future-me remembers I said \'probably.\'"'
  },
  {
    id: 'distress_fragment',
    title: 'Comms Intercept — Garbled',
    body: '"—not a mining accident, repeat, this was not— [signal lost] —if anyone is still assigned to this sector, do not report your position to—" The rest is static. Timestamp is fourteen months old.'
  },
  {
    id: 'company_memo_termination',
    title: 'Internal Memo: Contract Lifecycle Policy',
    body: '"Effective immediately, underperforming contracts will be handled under the updated \'voluntary extraction\' framework. HR has requested this memo not be forwarded to active rig personnel." You were not supposed to have this.'
  },
  {
    id: 'anomaly_first_sample',
    title: 'Drone Survey Note — Unclassified Sample',
    body: 'KESTREL\'s notes, appended automatically: "Sample registers no known crystalline structure. Thermal signature inconsistent with ambient rock temperature by a margin no passive process explains. Recommend flagging for Consortium review." The recommendation was not acted on. By either of you.'
  },
  {
    id: 'derelict_logbook',
    title: 'Derelict Rig Logbook, Final Entry',
    body: '"—not a mining accident, they came in through the—" The rest of the page is torn out, not burned, not corroded. Torn. By hand. Whoever wrote this had time to decide what you weren\'t allowed to read.'
  },
  {
    id: 'juno_found',
    title: 'Personal Note, Recovered',
    body: 'Tucked in the sealed compartment, written on the back of a supply manifest: "If anyone reads this — I welded the door from the inside on purpose. It wasn\'t pirates. I need someone to believe that before I need anything else." It isn\'t signed. It didn\'t need to be.'
  }
];

export function codexEntry(id) {
  return CODEX.find((c) => c.id === id);
}
