const log = [];
const MAX_LOG = 60;
let listener = null;

export const notifications = {
  onChange(fn) {
    listener = fn;
  },

  push(text) {
    log.unshift({ text, id: Date.now() + Math.random() });
    if (log.length > MAX_LOG) log.length = MAX_LOG;
    if (listener) listener(log);
  },

  all() {
    return log;
  }
};
