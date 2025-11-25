export function createSimulator({ onTick, interval = 1000 }) {
  let timer = null;
  let t = 0;

  function randomWalk(prev, volatility = 0.05, min = 0, max = 200) {
    const change = (Math.random() - 0.5) * volatility * prev;
    let next = prev + change;
    if (next < min) next = min;
    if (next > max) next = max;
    return Number(next.toFixed(2));
  }

  const state = {
    heart: 70,
    steps: 0,
    hydration: 1.8,
    stress: 3
  };

  function tick() {
    t++;
    state.heart = randomWalk(state.heart, 0.07, 40, 180);
    state.steps = Math.max(0, state.steps + Math.round(Math.random() * 20));
    state.hydration = Number(Math.max(0.4, state.hydration + (Math.random() - 0.5) * 0.05).toFixed(2));
    state.stress = Number(Math.max(0, state.stress + (Math.random() - 0.5) * 0.2).toFixed(2));
    onTick({ timestamp: Date.now(), ...state, t });
  }

  function start() {
    if (timer) return;
    timer = setInterval(tick, interval);
  }
  function stop() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  }
  function setIntervalMs(ms) {
    const wasRunning = !!timer;
    stop();
    interval = ms;
    if (wasRunning) start();
  }

  return { start, stop, setInterval: setIntervalMs, getState: () => ({ ...state }) };
}
