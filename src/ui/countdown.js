export const EVENT_START = new Date('2026-12-09T08:00:00+05:30');

export const pad = (n) => String(n).padStart(2, '0');

export function remain() {
  let s = Math.max(0, Math.floor((EVENT_START - Date.now()) / 1000));
  const d = Math.floor(s / 86400); s -= d * 86400;
  const h = Math.floor(s / 3600); s -= h * 3600;
  const m = Math.floor(s / 60); s -= m * 60;
  return { d, h, m, s };
}

export function startCountdown() {
  const cells = {};
  document.querySelectorAll('[data-cd]').forEach(el => { cells[el.dataset.cd] = el; });
  const inline = document.getElementById('tm2');
  const tick = () => {
    const r = remain();
    for (const k in cells) cells[k].textContent = pad(r[k]);
    if (inline) inline.textContent = `${pad(r.d)}d ${pad(r.h)}:${pad(r.m)}:${pad(r.s)}`;
  };
  tick();
  setInterval(tick, 1000);
}
