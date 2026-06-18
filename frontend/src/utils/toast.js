// Custom lightweight event emitter for toasts
const listeners = new Set();

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const notify = (type, message, duration = 4000) => {
  const id = Math.random().toString(36).substring(2, 9);
  listeners.forEach((listener) => listener({ id, type, message, duration }));
};

export const toast = {
  success: (msg, dur) => notify('success', msg, dur),
  error: (msg, dur) => notify('error', msg, dur),
  info: (msg, dur) => notify('info', msg, dur),
  warning: (msg, dur) => notify('warning', msg, dur),
  subscribe,
};
