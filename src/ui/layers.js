import { sstep, bump } from '../lib/utils.js';
import { CHAPTERS, REDUCE, scramble } from './shell.js';
import { G, diskScroll, galleryRaw, diskRaw } from '../lib/timeline.js';
import { TRACKS } from '../data.js';

const $ = (id) => document.getElementById(id);

function setLayer(el, alpha, transform) {
  el.style.opacity = alpha.toFixed(3);
  const on = alpha > .01;
  if (el.classList.contains('on') !== on) {
    el.classList.toggle('on', on);
    el.setAttribute('aria-hidden', String(!on));
    el.querySelectorAll('a').forEach(l => (on ? l.removeAttribute('tabindex') : l.setAttribute('tabindex', '-1')));
  }
  if (transform !== undefined) el.style.transform = transform;
}

const DESK_STACK = [
  { x: -4.5, y: -3.0, r: -3.8 },
  { x:  4.0, y: -2.0, r:  3.2 },
  { x: -3.5, y:  3.0, r: -2.4 },
  { x:  5.0, y:  2.5, r:  4.0 }
];

export function createLayers(railButtons, shell) {
  const air = $('lAir'), num = $('lNum'), gal = $('lGal'), disksLayer = $('tracks'), sig = $('lSig'), beam = $('lBeam');
  const counts = [...document.querySelectorAll('[data-count]')].map(el => ({ el, n: +el.dataset.count, plus: el.hasAttribute('data-plus') }));
  const frame = document.querySelector('.frame');
  const flash = $('flash'), sigLine = $('sigLine');
  let chapter = -1;
  let sigShown = false;

  const cards = [...gal.querySelectorAll('.gal-card')];
  const ticks = [...gal.querySelectorAll('.gal-ticks i')];
  const galTitle = $('galTitle'), galSub = $('galSub'), galNote = $('galNote'), galNo = $('galNo');
  let galIdx = -1;
  const [GA, GB] = G.gallery;
  const GAL_IN0 = GA + .005, GAL_IN1 = GA + .04, GAL_OUT0 = GB - .035, GAL_OUT1 = GB - .005;
  const FIRST = GA + .045, LAST = GB - .04;

  const diskHint = $('diskHint');

  // Gallery photos are real controls: click one to bring it to the front.
  let currentRaw = 0;
  const n = cards.length;
  cards.forEach((el, i) => {
    el.dataset.cursor = 'View';
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '-1');
    el.addEventListener('click', () => {
      const topIdx = Math.min(n - 1, Math.max(0, Math.floor(currentRaw + 0.35)));
      const targetIdx = i < topIdx ? i : (i === topIdx ? (i + 1) % n : i);
      shell.scrollToY(shell.progressToY(galleryRaw(FIRST + (targetIdx / (n - 1)) * (LAST - FIRST))));
    });
  });

  // Flat 2D track selector: each chip is one of the seven disks.
  const picker = document.createElement('div');
  picker.className = 'trk2d';
  picker.setAttribute('role', 'group');
  picker.setAttribute('aria-label', 'Pick a track');
  const goTrack = (i) => shell.scrollToY(shell.progressToY(diskRaw(Math.max(0, Math.min(TRACKS.length - 1, i)))));
  const mkArrow = (dir) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'trk2d-arrow';
    b.dataset.cursor = dir < 0 ? 'Previous' : 'Next';
    b.setAttribute('aria-label', dir < 0 ? 'Previous track' : 'Next track');
    b.innerHTML = dir < 0
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>';
    b.addEventListener('click', () => goTrack(pickerIdx < 0 ? 0 : pickerIdx + dir));
    return b;
  };
  let pickerIdx = -1;
  const prevBtn = mkArrow(-1), nextBtn = mkArrow(1);
  picker.appendChild(prevBtn);
  const chips = TRACKS.map((t, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'trk2d-chip';
    b.dataset.cursor = t.name;
    b.setAttribute('aria-label', `Track ${t.n}: ${t.name}`);
    b.textContent = t.n;
    b.addEventListener('click', () => goTrack(i));
    picker.appendChild(b);
    return b;
  });
  picker.appendChild(nextBtn);
  disksLayer.appendChild(picker);

  return function update({ p, pr, q, g, inWorld, glitch, z, speed }) {
    const airA = 1 - sstep(.015, .06, p);
    setLayer(air, airA, `translateY(${(sstep(.015, .06, p) * 40).toFixed(1)}px)`);

    const numOut = sstep(0, G.numOut[1], g);
    const numA = sstep(.455, .49, q) * (1 - numOut);
    setLayer(num, numA, `translateY(${((1 - sstep(.455, .5, q)) * 40 - numOut * 40).toFixed(1)}px)`);
    const counted = sstep(.465, .53, q);
    for (const c of counts) {
      const t = Math.round(c.n * counted) + (c.plus && counted > .98 ? '+' : '');
      if (c.el.textContent !== t) c.el.textContent = t;
    }

    const galA = bump(GAL_IN0, GAL_IN1, GAL_OUT0, GAL_OUT1, g) * (inWorld ? 1 : 0);
    setLayer(gal, galA, `translateY(${((1 - sstep(GAL_IN0, GAL_IN1 + .02, g)) * 40 - sstep(GAL_OUT0, GAL_OUT1, g) * 40).toFixed(1)}px)`);
    if (galA > .01) {
      const n = cards.length;
      const raw = Math.min(1, Math.max(0, (g - FIRST) / (LAST - FIRST))) * (n - 1);
      currentRaw = raw;
      const base = Math.floor(raw);
      const f = REDUCE ? Math.round(raw) : base + sstep(.3, .7, raw - base);
      const isMobile = window.innerWidth <= 820;
      const mobileScale = isMobile ? 0.70 : 1.0;

      cards.forEach((el, i) => {
        const desk = DESK_STACK[i];
        const pDrop = i === 0 ? 1.0 : Math.min(1.0, Math.max(0.0, raw - (i - 1)));

        let yPlunge, sc, r, opacity, shadowLift;

        if (REDUCE) {
          yPlunge = 0;
          sc = 1.0;
          r = 0;
          opacity = sstep(0.0, 0.4, pDrop);
          shadowLift = 0;
        } else {
          if (pDrop <= 0.01) {
            yPlunge = -125.0;
            sc = 1.12;
            r = (desk.r + 6.0) * mobileScale;
            opacity = 0;
            shadowLift = 1.0;
          } else if (pDrop < 0.85) {
            const tNorm = pDrop / 0.85;
            const plunge = tNorm * tNorm;
            yPlunge = (1.0 - plunge) * -125.0;
            sc = 1.12 - plunge * 0.12;
            r = (desk.r + (1.0 - plunge) * 6.0) * mobileScale;
            opacity = sstep(0.01, 0.25, pDrop);
            shadowLift = 1.0 - plunge * 0.7;
          } else {
            const bounceT = (pDrop - 0.85) / 0.15;
            const squash = Math.sin(bounceT * Math.PI) * 1.5;
            yPlunge = squash;
            sc = 1.0 - Math.sin(bounceT * Math.PI) * 0.015;
            r = desk.r * mobileScale;
            opacity = 1.0;
            shadowLift = (1.0 - bounceT) * 0.3;
          }
        }

        const zIndex = 10 + i * 10;
        const cover = i === n - 1 ? 0 : Math.min(1.0, Math.max(0.0, raw - i));
        const dim = cover * 0.28;

        const restX = desk.x * mobileScale;
        const totalY = desk.y * mobileScale + yPlunge;

        el.style.opacity = opacity.toFixed(3);
        el.style.pointerEvents = opacity > 0.8 ? 'auto' : 'none';
        el.style.transform = `translate(${restX.toFixed(2)}%, ${totalY.toFixed(2)}%) rotate(${r.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
        el.style.zIndex = String(zIndex);
        el.style.setProperty('--dim', dim.toFixed(3));
        el.style.setProperty('--lift', shadowLift.toFixed(3));
      });
      const idx = Math.min(n - 1, Math.round(f));
      if (idx !== galIdx) {
        galIdx = idx;
        const c = cards[idx];
        scramble(galTitle, c.dataset.title, 320);
        galSub.textContent = c.dataset.sub;
        galNote.textContent = c.dataset.note;
        galNo.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
        ticks.forEach((t, i) => t.classList.toggle('on', i <= idx));
      }
    }

    const diskA = bump(G.travel2[1] - .02, G.travel2[1] + .015, G.disks[1] - .04, G.disks[1], g) * (inWorld ? 1 : 0);
    setLayer(disksLayer, diskA);
    if (diskA > .01) {
      const ds = diskScroll(g);
      diskHint.style.opacity = (sstep(.15, .45, ds) * (1 - sstep(1.6, 2.2, ds)) * .9 + .1).toFixed(3);
      const idx = ds < 0 ? -1 : Math.min(chips.length - 1, Math.floor(ds));
      if (idx !== pickerIdx) {
        pickerIdx = idx;
        prevBtn.disabled = idx <= 0;
        nextBtn.disabled = idx >= chips.length - 1;
        chips.forEach((c, i) => { c.classList.toggle('on', i === idx); if (i === idx) c.setAttribute('aria-current', 'true'); else c.removeAttribute('aria-current'); });
      }
    }

    const sigA = bump(.64, .66, .715, .74, q);
    setLayer(sig, sigA, sigA > 0 && !REDUCE
      ? `translate(${((Math.random() - .5) * 14 * glitch).toFixed(1)}px, ${((Math.random() - .5) * 6 * glitch).toFixed(1)}px)`
      : '');
    if (sigA > .5 && !sigShown) {
      sigShown = true;
      scramble(sigLine, 'Re-tuning to channel 26…', 700);
    } else if (sigA < .1) {
      sigShown = false;
    }

    setLayer(beam, 0);
    flash.style.opacity = '0';
    frame.style.setProperty('--scrim', (inWorld ? 0 : airA).toFixed(3));

    let ci = 0;
    CHAPTERS.forEach((c, i) => { if (pr >= c.at) ci = i; });
    if (ci !== chapter) {
      chapter = ci;
      (railButtons || []).forEach((b, i) => b.classList.toggle('on', i === ci));
    }
  };
}
