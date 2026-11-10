import { P_CUT, G, toRaw, galleryRaw, diskRaw, postRaw, DISK_N } from '../lib/timeline.js';
import { REDUCE } from './shell.js';

const IDLE_RESUME = 6000;
const NAV_KEYS = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End']);
const easeInOut = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

function buildCues() {
  const cues = [];
  const add = (y, hold, travel) => cues.push({ y, hold, travel });
  add(0, 1.6, 0);
  add(toRaw(P_CUT + .012), .5, 4.2);
  add(toRaw(.40), 0, 4.6);
  add(galleryRaw(0), 3.4, 2.6);

  const n = Math.max(2, document.querySelectorAll('.gal-card').length || 6);
  const first = G.gallery[0] + .045, last = G.gallery[1] - .04;
  for (let i = 0; i < n; i++) add(galleryRaw(first + (i / (n - 1)) * (last - first)), 2.4, i === 0 ? 3.6 : 1.3);

  for (let i = 0; i < DISK_N; i++) add(diskRaw(i), 4.9, i === 0 ? 3.8 : .8);
  add(postRaw(.70), 2.0, 3.4);
  add(1, 0, 2.6);
  return cues;
}

export function createDirector(shell) {
  const btn = document.getElementById('playBtn');
  const cues = buildCues();
  let auto = false;
  let playing = false;
  let idx = 0, phase = 'hold', t = 0, from = 0, lastManual = 0, last = performance.now(), started = true;

  const rawNow = () => {
    const r = shell.track.getBoundingClientRect();
    const max = r.height - innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, -r.top / max)) : 0;
  };
  const setRaw = (raw) => {
    const y = shell.progressToY(raw);
    if (shell.lenis) shell.lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  };

  function render() {
    if (!btn) return;
    btn.textContent = auto && playing ? 'Pause film' : auto ? 'Resuming…' : 'Play film';
    btn.setAttribute('aria-pressed', String(auto && playing));
    btn.hidden = rawNow() >= .999;
  }

  function resumeFrom(raw) {
    let k = cues.findIndex(c => c.y > raw + .002);
    if (k < 0) { playing = false; render(); return; }
    idx = k;
    from = raw;
    phase = 'travel';
    t = 0;
    playing = true;
    render();
  }

  function manual() {
    lastManual = performance.now();
    if (playing || auto) {
      playing = false;
      auto = false;
      render();
    }
  }

  addEventListener('wheel', manual, { passive: true });
  addEventListener('touchmove', manual, { passive: true });
  addEventListener('keydown', (e) => { if (NAV_KEYS.has(e.key)) manual(); });
  addEventListener('nav:manual', manual);
  document.addEventListener('visibilitychange', () => { if (document.hidden) manual(); });

  if (btn) btn.addEventListener('click', () => {
    if (auto && playing) {
      auto = false;
      playing = false;
    } else {
      auto = true;
      resumeFrom(rawNow());
    }
    render();
  });

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(1, (now - last) / 1000);
    last = now;
    if (!started) return;
    if (!playing) return;
    const c = cues[idx];
    t += dt;
    if (phase === 'travel') {
      const k = c.travel > 0 ? Math.min(1, t / c.travel) : 1;
      setRaw(from + (c.y - from) * easeInOut(k));
      if (k >= 1) { phase = 'hold'; t = 0; }
    } else if (t >= c.hold) {
      if (idx >= cues.length - 1) { playing = false; auto = false; render(); return; }
      from = c.y;
      idx++;
      phase = 'travel';
      t = 0;
    }
  }
  requestAnimationFrame(frame);

  return {
    start(delay = 900) {
      setTimeout(() => {
        started = true;
        if (auto && rawNow() < .01) {
          idx = 0;
          phase = 'hold';
          t = 0;
          playing = true;
        }
        render();
      }, delay);
    },
    manual,
    halt() {
      auto = false;
      playing = false;
      lastManual = performance.now();
      render();
    },
    get playing() { return playing; }
  };
}
