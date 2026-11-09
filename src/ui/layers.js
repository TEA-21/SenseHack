import { sstep, bump } from '../lib/utils.js';
import { CHAPTERS, REDUCE, scramble } from './shell.js';
import { G, diskScroll } from '../lib/timeline.js';

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

export function createLayers(railButtons, shell) {
  const air = $('lAir'), num = $('lNum'), gal = $('lGal'), disksLayer = $('tracks'), sig = $('lSig'), beam = $('lBeam');
  const counts = [...document.querySelectorAll('[data-count]')].map(el => ({ el, n: +el.dataset.count, plus: el.hasAttribute('data-plus') }));
  const frame = document.querySelector('.frame');
  const flash = $('flash'), strip = $('strip'), depth = $('depth'), vel = $('vel');
  const chNum = $('chNum'), chName = $('chName'), chNext = $('chNext'), progress = $('progBar'), sigLine = $('sigLine');
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
      const base = Math.floor(raw);
      const f = REDUCE ? Math.round(raw) : base + sstep(.3, .7, raw - base);
      cards.forEach((el, i) => {
        const d = i - f;
        let o, sc, x, y, r, dim;
        if (d < 0) {
          const t = Math.min(1, -d);
          sc = 1 + t * .5; x = t * 16; y = -t * 9; r = t * (i % 2 ? 5 : -5); o = Math.max(0, 1 - t * 1.25); dim = 0;
        } else {
          const t = Math.min(d, 4);
          sc = 1 - t * .07; x = -t * 7; y = -t * 4.5; r = 0; o = Math.max(0, 1 - t * .3); dim = Math.min(.8, t * .22);
        }
        const tilt = ((i * 37) % 7 - 3) * .35;
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translate(${x.toFixed(2)}%, ${y.toFixed(2)}%) rotate(${(r + tilt).toFixed(2)}deg) scale(${sc.toFixed(3)})`;
        el.style.zIndex = String(60 - Math.round(d * 10));
        el.style.setProperty('--dim', dim.toFixed(3));
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

    strip.style.opacity = sstep(.05, .12, p).toFixed(3);
    let ci = 0;
    CHAPTERS.forEach((c, i) => { if (pr >= c.at) ci = i; });
    if (ci !== chapter) {
      chapter = ci;
      const c = CHAPTERS[ci], n = CHAPTERS[ci + 1];
      chNum.textContent = c.n;
      scramble(chName, c.name, 360);
      chNext.textContent = n ? `Next · ${n.name} ↓` : 'End of transmission · Register is next';
      railButtons.forEach((b, i) => b.classList.toggle('on', i === ci));
    }
    progress.style.width = (pr * 100).toFixed(2) + '%';
    const zt = (z >= 0 ? '+' : '') + z.toFixed(1);
    if (depth.textContent !== zt) depth.textContent = zt;
    const vt = Math.min(99.9, speed).toFixed(1).padStart(4, '0');
    if (vel.textContent !== vt) vel.textContent = vt;
  };
}
