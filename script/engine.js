import { stateManager } from './state_manager.js';
import { notifications } from './notifications.js';
import { tickCooldowns } from './button.js';
import { ALL_EVENTS } from '../content/events/index.js';
import { CODEX } from '../content/codex.js';

const TICKS_PER_DAY = 60;

class Engine {
  constructor() {
    this.interval = null;
    this.eventsById = Object.fromEntries(ALL_EVENTS.map((e) => [e.id, e]));
    this.activeEvent = null;
    this.onEventChange = null;
  }

  init() {
    // Fire any events flagged to run immediately on a fresh game.
    if (stateManager.state.tick === 0 && !stateManager.hasSeen('wake')) {
      this.triggerEvent('wake');
    }
    this.interval = setInterval(() => this.tick(), 1000);
  }

  tick() {
    const s = stateManager.state;
    if (s.flags.game_complete) return;

    s.tick += 1;
    tickCooldowns();

    // Survival drain, power is the core clock, o2 the secondary one.
    stateManager.addStore('power', -0.05);
    stateManager.addStore('o2', -0.02);

    if (s.tick % TICKS_PER_DAY === 0) {
      s.day += 1;
      this.checkScheduledEvents();
    }

    if (!this.activeEvent) this.checkAmbientEvents();

    if (s.stores.power <= 0 && !stateManager.getFlag('power_crisis_warned')) {
      stateManager.setFlag('power_crisis_warned', true);
      notifications.push('WARNING: reactor output at zero. Life support on reserve.');
    }

    stateManager.save();
    stateManager.notify();
  }

  checkAmbientEvents() {
    for (const event of ALL_EVENTS) {
      if (!event.ambient) continue;
      if (event.once && stateManager.hasSeen(event.id)) continue;
      if (event.requires && !event.requires(stateManager.state)) continue;
      this.triggerEvent(event.id);
      return;
    }
  }

  checkScheduledEvents() {
    const due = stateManager.popDueEvents();
    due.forEach((id) => this.triggerEvent(id));
  }

  triggerEvent(id) {
    const event = this.eventsById[id];
    if (!event) return;
    if (event.once && stateManager.hasSeen(id)) return;
    if (event.requires && !event.requires(stateManager.state)) return;

    this.activeEvent = event;
    if (this.onEventChange) this.onEventChange(event);
  }

  resolveChoice(choiceIndex) {
    const event = this.activeEvent;
    if (!event) return;
    const choice = event.choices[choiceIndex];
    if (!choice) return;

    stateManager.markSeen(event.id);
    if (choice.effect) choice.effect(stateManager, notifications, this);
    if (choice.log) notifications.push(choice.log);
    if (choice.scheduleAfterDays && choice.scheduleEventId) {
      stateManager.scheduleEvent(choice.scheduleEventId, choice.scheduleAfterDays);
    }

    this.activeEvent = null;
    if (this.onEventChange) this.onEventChange(null);

    if (choice.next) {
      this.triggerEvent(choice.next);
      return;
    }

    stateManager.save();
    stateManager.notify();
  }

  unlockCodexEntry(id) {
    const entry = CODEX.find((c) => c.id === id);
    stateManager.unlockCodex(id);
    if (entry) notifications.push(`CODEX UPDATED: "${entry.title}"`);
  }
}

export const engine = new Engine();
