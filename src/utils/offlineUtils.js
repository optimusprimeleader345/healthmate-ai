export function saveToLocal(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); }
  catch (e) { console.error("Local save error", e); }
}

export function loadFromLocal(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error("Local load error", e);
    return fallback;
  }
}

export function isOffline() {
  return !navigator.onLine;
}

export function subscribeNetworkStatus(callback) {
  window.addEventListener("online", () => callback(true));
  window.addEventListener("offline", () => callback(false));
}
