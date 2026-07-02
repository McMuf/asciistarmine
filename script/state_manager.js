const SAVE_KEY = 'asciistarmine_save_v1';

function defaultState() {
  return {
    tick: 0,
    day: 0,
    screen: 'hab',
    stores: {
      power: 10,
      o2: 20,
      scrap: 0
    },
    flags: {},
    scheduled: [], // [{ fireOnDay, eventId }]
    seenEvents: [], // one-shot event ids already fired
    factions: {
      company: 0,
      union: 0,
      pirates: 0,
      consortium: 0
    },
    companions: {
      kestrel: { met: false, trust: 0 },
      voss: { met: false, trust: 0 },
      renn: { met: false, trust: 0 },
      juno: { met: false, trust: 0 }
    },
    codex: { unlocked: [] }
  };
}

class StateManager {
  constructor() {
    this.state = this.load() || defaultState();
    this.listeners = [];
  }

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('save load failed', e);
      return null;
    }
  }

  save() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(this.state));
  }

  reset() {
    this.state = defaultState();
    this.save();
    this.notify();
  }

  onChange(fn) {
    this.listeners.push(fn);
  }

  notify() {
    this.listeners.forEach((fn) => fn(this.state));
  }

  addStore(id, amount) {
    const current = this.state.stores[id] || 0;
    this.state.stores[id] = Math.max(0, current + amount);
  }

  hasStore(id, amount) {
    return (this.state.stores[id] || 0) >= amount;
  }

  spend(costs) {
    for (const [id, amount] of Object.entries(costs)) {
      if (!this.hasStore(id, amount)) return false;
    }
    for (const [id, amount] of Object.entries(costs)) {
      this.addStore(id, -amount);
    }
    return true;
  }

  setFlag(key, value = true) {
    this.state.flags[key] = value;
  }

  getFlag(key) {
    return this.state.flags[key];
  }

  adjustFaction(id, amount) {
    this.state.factions[id] = (this.state.factions[id] || 0) + amount;
  }

  meetCompanion(id) {
    if (this.state.companions[id]) this.state.companions[id].met = true;
  }

  trustCompanion(id, amount) {
    if (this.state.companions[id]) {
      this.state.companions[id].trust += amount;
    }
  }

  unlockCodex(id) {
    if (!this.state.codex.unlocked.includes(id)) {
      this.state.codex.unlocked.push(id);
    }
  }

  hasSeen(eventId) {
    return this.state.seenEvents.includes(eventId);
  }

  markSeen(eventId) {
    if (!this.hasSeen(eventId)) this.state.seenEvents.push(eventId);
  }

  scheduleEvent(eventId, daysFromNow) {
    this.state.scheduled.push({
      fireOnDay: this.state.day + daysFromNow,
      eventId
    });
  }

  popDueEvents() {
    const due = this.state.scheduled.filter((s) => s.fireOnDay <= this.state.day);
    this.state.scheduled = this.state.scheduled.filter((s) => s.fireOnDay > this.state.day);
    return due.map((d) => d.eventId);
  }
}

export const stateManager = new StateManager();
