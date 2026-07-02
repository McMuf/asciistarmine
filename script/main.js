import { stateManager } from './state_manager.js';
import { notifications } from './notifications.js';
import { engine } from './engine.js';
import { ActionButton } from './button.js';
import { MATERIALS } from '../content/materials.js';
import { FACTIONS, factionStanding } from '../content/factions.js';
import { COMPANIONS, companionLine } from '../content/companions.js';
import { CODEX } from '../content/codex.js';

const storesList = document.getElementById('stores-list');
const actionsList = document.getElementById('actions-list');
const logList = document.getElementById('log-list');
const factionList = document.getElementById('faction-list');
const companionList = document.getElementById('companion-list');
const codexOpenBtn = document.getElementById('codex-open');

const eventModal = document.getElementById('event-modal');
const eventTitle = document.getElementById('event-title');
const eventText = document.getElementById('event-text');
const eventChoices = document.getElementById('event-choices');

const codexModal = document.getElementById('codex-modal');
const codexEntries = document.getElementById('codex-entries');
const codexCloseBtn = document.getElementById('codex-close');

const actions = [
  new ActionButton({
    id: 'charge_cell',
    label: 'Charge Reactor Cell',
    cooldownTicks: 4,
    visible: () => true,
    onClick: (state, sm) => {
      sm.addStore('power', 2);
      notifications.push('You bleed a charge from the backup cell into the reactor.');
    }
  }),
  new ActionButton({
    id: 'reclaim_water',
    label: 'Reclaim Ice',
    cooldownTicks: 6,
    visible: (state) => state.stores.power >= 3,
    onClick: (state, sm) => {
      sm.spend({ power: 1 });
      sm.addStore('water', 1);
      sm.addStore('o2', 2);
      notifications.push('The cracker pulls a little water and a little air out of the sublayer ice.');
    }
  })
];

function renderStores() {
  storesList.innerHTML = '';
  const visibleIds = ['power', 'o2', 'water', 'scrap'];
  for (const id of visibleIds) {
    const amount = stateManager.state.stores[id] || 0;
    if (amount <= 0 && id !== 'power' && id !== 'o2') continue;
    const material = MATERIALS.find((m) => m.id === id);
    const row = document.createElement('div');
    row.className = 'store-row';
    row.innerHTML = `<span>${material ? material.name : id}</span><span>${amount.toFixed(1)}</span>`;
    storesList.appendChild(row);
  }
}

function renderActions() {
  actionsList.innerHTML = '';
  for (const action of actions) {
    if (!action.isVisible(stateManager.state)) continue;
    const btn = document.createElement('button');
    btn.textContent = action.label + action.costLabel();
    btn.disabled = !action.isEnabled(stateManager.state, stateManager);
    btn.onclick = () => action.fire(stateManager.state, stateManager);
    actionsList.appendChild(btn);
  }
}

function renderLog() {
  logList.innerHTML = '';
  notifications.all().forEach((entry, i) => {
    const div = document.createElement('div');
    if (i === 0) div.className = 'log-new';
    div.textContent = entry.text;
    logList.appendChild(div);
  });
}

function renderFactions() {
  factionList.innerHTML = '';
  for (const faction of FACTIONS) {
    const rep = stateManager.state.factions[faction.id] || 0;
    const standing = factionStanding(faction, rep);
    const row = document.createElement('div');
    row.className = 'faction-row';
    row.innerHTML = `<span>${faction.shortName}</span><span>${standing}</span>`;
    factionList.appendChild(row);
  }
}

function renderCompanions() {
  companionList.innerHTML = '';
  for (const id of Object.keys(COMPANIONS)) {
    const state = stateManager.state.companions[id];
    if (!state || !state.met) continue;
    const c = COMPANIONS[id];
    const line = companionLine(id, state.trust);
    const wrap = document.createElement('div');
    wrap.className = 'companion-row';
    wrap.style.display = 'block';
    wrap.innerHTML = `<strong>${c.name}</strong> <span style="color:var(--dim)">— ${c.role}</span>${line ? `<div style="margin-top:0.2rem;">${line}</div>` : ''}`;
    companionList.appendChild(wrap);
  }
}

function renderCodexButton() {
  codexOpenBtn.style.display = stateManager.state.codex.unlocked.length ? 'block' : 'none';
}

function renderAll() {
  renderStores();
  renderActions();
  renderFactions();
  renderCompanions();
  renderCodexButton();
}

function renderEventModal(event) {
  if (!event) {
    eventModal.classList.add('hidden');
    return;
  }
  eventModal.classList.remove('hidden');
  eventTitle.textContent = event.title;
  eventText.textContent = typeof event.text === 'function' ? event.text(stateManager.state) : event.text;
  eventChoices.innerHTML = '';
  event.choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.textContent = choice.label;
    btn.onclick = () => engine.resolveChoice(i);
    eventChoices.appendChild(btn);
  });
}

function renderCodexModal() {
  codexEntries.innerHTML = '';
  const unlocked = stateManager.state.codex.unlocked;
  if (!unlocked.length) {
    codexEntries.innerHTML = '<p>Nothing decrypted yet.</p>';
    return;
  }
  for (const id of unlocked) {
    const entry = CODEX.find((c) => c.id === id);
    if (!entry) continue;
    const div = document.createElement('div');
    div.className = 'codex-entry';
    div.innerHTML = `<h3>${entry.title}</h3><p>${entry.body}</p>`;
    codexEntries.appendChild(div);
  }
}

codexOpenBtn.onclick = () => {
  renderCodexModal();
  codexModal.classList.remove('hidden');
};
codexCloseBtn.onclick = () => codexModal.classList.add('hidden');

stateManager.onChange(renderAll);
notifications.onChange(renderLog);
engine.onEventChange = renderEventModal;

renderAll();
engine.init();
