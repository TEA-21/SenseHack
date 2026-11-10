import { sstep } from '../lib/utils.js';
import { REDUCE, scramble } from './shell.js';
import { TRACKS } from '../data/tracks.js';

const $ = (id) => document.getElementById(id);
const pad = (n) => String(n).padStart(2, '0');
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const N = TRACKS.length;
const SEG_VH = 100;
const LEAD = .05, TAIL = .05;
const SEG = (1 - LEAD - TAIL) / N;
export const TRACKS_VH = N * SEG_VH / (1 - LEAD - TAIL) + 100;

const OUT_END = .30;
const BACK_START = .70;

const DISK_H = 3.7 / 3.5;
const PANEL = .56;
const OUT_BOTTOM = PANEL + .05;
const parked = (i) => {
  const top = PANEL + .10 + i * .03;
  return { x: (i - (N - 1) / 2) * .045, y: DISK_H - top, s: 1 - i * .016 };
};

function floppyHTML(t, i) {
  return `
    <div class="fd-tilt">
      <div class="fd-face">
        <div class="fd-shutter"><i></i></div>
        <div class="fd-label">
          <i class="fd-stripe"></i>
          <small>MF2HD&nbsp; 1.44 MB</small>
          <b>${t.disk}</b>
          <em>track ${pad(i + 1)} / ${pad(N)}</em>
        </div>
        <i class="fd-wp"></i>
      </div>
    </div>`;
}

export function createTracks(shell) {
  const sec = $('tracks');
  if (!sec) return;

  const rig = $('flRig'), slotsEl = $('fcSlots'), segEl = $('trSeg');
  const noEl = $('trNo'), titleEl = $('trTitle'), subEl = $('trSub'), descEl = $('trDesc'), tagsEl = $('trTags');
  const info = $('trInfo'), hint = $('trHint'), count = $('trCount');
  sec.style.height = TRACKS_VH + 'vh';

  const disks = TRACKS.map((t, i) => {
    const el = document.createElement('div');
    el.className = 'fd';
    el.setAttribute('aria-hidden', 'true');
    el.style.setProperty('--body', t.body);
    el.style.setProperty('--stripe', t.stripe);
    el.style.zIndex = N - i;
    el.innerHTML = floppyHTML(t, i);
    $('flDisks').appendChild(el);
    return { el, tilt: el.firstElementChild };
  });

  const slots = TRACKS.map((t, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'fc-slot';
    b.style.setProperty('--tab', t.stripe === '#141110' ? t.body : t.stripe);
    b.setAttribute('aria-label', `Track ${pad(i + 1)}: ${t.title}`);
    b.innerHTML = `<i></i><span>${pad(i + 1)}</span>`;
    b.addEventListener('click', () => goTo(i));
    slotsEl.appendChild(b);
    return b;
  });

  const segs = TRACKS.map((t, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Show track ${pad(i + 1)}: ${t.title}`);
    b.addEventListener('click', () => goTo(i));
    segEl.appendChild(b);
    return b;
  });

  const topOf = () => sec.getBoundingClientRect().top + scrollY;
  const scrollRange = () => sec.offsetHeight - innerHeight;
  function goTo(i) {
    const p = LEAD + (i + .5) * SEG;
    shell.scrollToY(topOf() + scrollRange() * p);
  }
  shell.onJumpTracks(() => shell.scrollToY(topOf()));

  let shown = -1;
  let scrambledFor = -1;
  function showCopy(i) {
    const t = TRACKS[i];
    shown = i;
    scrambledFor = -1;
    noEl.textContent = pad(i + 1);
    titleEl.textContent = t.title;
    subEl.textContent = `Track ${pad(i + 1)} of ${pad(N)}`;
    descEl.textContent = t.desc;
    tagsEl.innerHTML = t.tags.map(x => `<span>${x}</span>`).join('');
    count.textContent = `${pad(i + 1)} / ${pad(N)}`;
    segs.forEach((b, k) => { b.className = k === i ? 'now' : k < i ? 'past' : ''; });
  }
  showCopy(0);

  const mouse = { x: 0, tx: 0 };
  addEventListener('pointermove', (e) => { mouse.tx = e.clientX / innerWidth * 2 - 1; }, { passive: true });

  let time = 0, last = performance.now(), prevActive = -2;

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(.05, (now - last) / 1000);
    last = now;
    const rect = sec.getBoundingClientRect();
    if (rect.bottom < -200 || rect.top > innerHeight + 200) return;
    if (!REDUCE) time += dt;
    mouse.x += (mouse.tx - mouse.x) * (1 - Math.exp(-dt * 4));

    const range = rect.height - innerHeight;
    const p = range > 0 ? clamp01(-rect.top / range) : 0;
    const s = (p - LEAD) / SEG;
    const active = p <= LEAD || p >= 1 - TAIL ? -1 : Math.min(N - 1, Math.floor(s));
    const u = active < 0 ? 0 : s - active;

    const a = active < 0 ? 0 : u < OUT_END ? u / OUT_END : u < BACK_START ? 1 : 1 - (u - BACK_START) / (1 - BACK_START);

    if (active >= 0 && active !== shown) showCopy(active);
    if (active >= 0 && u > .26 && scrambledFor !== active && a > .95) {
      scrambledFor = active;
      scramble(titleEl, TRACKS[active].title, 380);
    }

    disks.forEach((d, i) => {
      const pk = parked(i);
      let x = pk.x, y = pk.y, sc = pk.s, lit = .5, hold = 0;
      if (i === active) {
        const m = ease(a);
        x = lerp(pk.x, 0, ease(sstep(.3, 1, a)));
        y = lerp(pk.y, -OUT_BOTTOM, m);
        sc = lerp(pk.s, 1, ease(sstep(.4, 1, a)));
        lit = lerp(.5, 1, m);
        hold = m;
        d.el.style.zIndex = N + 5;
      } else {
        d.el.style.zIndex = N - i;
      }
      d.el.style.transform = `translate(${(x * 100).toFixed(2)}%, ${(y / DISK_H * 100).toFixed(2)}%) scale(${sc.toFixed(4)})`;
      d.el.style.setProperty('--lit', lit.toFixed(3));
      const sway = REDUCE ? 0 : hold;
      const ry = Math.sin(time * .7) * 5 * sway + mouse.x * 7 * hold;
      const rz = Math.sin(time * .5) * 1.4 * sway;
      d.tilt.style.transform = hold > .001 ? `rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)` : '';
    });

    const ia = active < 0 ? 0 : sstep(.24, .40, u) * (1 - sstep(.62, .74, u));
    info.style.opacity = ia.toFixed(3);
    info.style.transform = `translateY(${((1 - ia) * 22).toFixed(1)}px)`;
    info.style.visibility = ia > .01 ? 'visible' : 'hidden';

    rig.style.setProperty('--glow', (.28 + .72 * ease(a)).toFixed(3));
    hint.style.opacity = (1 - sstep(.0, .04, p)).toFixed(3);

    if (active !== prevActive) {
      prevActive = active;
      slots.forEach((b, k) => b.classList.toggle('on', k === active));
    }
  }
  requestAnimationFrame(frame);
}
