// Cooldown tracking is keyed by button id, in ticks remaining.
const cooldowns = {};

export function tickCooldowns() {
  for (const id of Object.keys(cooldowns)) {
    if (cooldowns[id] > 0) cooldowns[id] -= 1;
  }
}

export class ActionButton {
  constructor({ id, label, cost = {}, cooldownTicks = 0, visible = () => true, onClick }) {
    this.id = id;
    this.label = label;
    this.cost = cost;
    this.cooldownTicks = cooldownTicks;
    this.visible = visible;
    this.onClick = onClick;
    if (!(id in cooldowns)) cooldowns[id] = 0;
  }

  isVisible(state) {
    return this.visible(state);
  }

  isEnabled(state, stateManager) {
    if (cooldowns[this.id] > 0) return false;
    for (const [resource, amount] of Object.entries(this.cost)) {
      if (!stateManager.hasStore(resource, amount)) return false;
    }
    return true;
  }

  costLabel() {
    const parts = Object.entries(this.cost).map(([k, v]) => `${v} ${k}`);
    return parts.length ? ` (${parts.join(', ')})` : '';
  }

  fire(state, stateManager) {
    if (!this.isEnabled(state, stateManager)) return;
    if (Object.keys(this.cost).length) stateManager.spend(this.cost);
    cooldowns[this.id] = this.cooldownTicks;
    this.onClick(state, stateManager);
  }
}
