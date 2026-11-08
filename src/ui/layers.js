import { sstep, bump } from '../lib/utils.js';
import { CHAPTERS, REDUCE, scramble } from './shell.js';

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

export function createLayers(railButtons) {
  const air = $('lAir'), num = $('lNum'), sig = $('lSig'), beam = $('lBeam');
  const caption = $('trCap');
  const words = [...document.querySelectorAll('.kw')].map((el, i) => ({ el, at: .12 + i * .042 }));
  const counts = [...document.querySelectorAll('[data-count]')].map(el => ({ el, n: +el.dataset.count, plus: el.hasAttribute('data-plus') }));
  const frame = document.querySelector('.frame');
  const flash = $('flash'), strip = $('strip'), depth = $('depth'), vel = $('vel');
  const chNum = $('chNum'), chName = $('chName'), chNext = $('chNext'), progress = $('progBar'), sigLine = $('sigLine');
  let chapter = -1;
  let sigShown = false;

  return function update({ p, q, inWorld, glitch, z, speed }) {
    const airA = 1 - sstep(.015, .06, p);
    setLayer(air, airA, `translateY(${(sstep(.015, .06, p) * 40).toFixed(1)}px)`);

    caption.style.opacity = (bump(.09, .12, .38, .42, q) * (inWorld ? 1 : 0)).toFixed(3);
    for (const w of words) {
      const u = (q - w.at) / .036;
      const a = inWorld ? Math.max(0, 1 - Math.abs(u)) : 0;
      const s = .35 + Math.max(0, u + 1) * 1.25;
      w.el.style.opacity = Math.min(1, a * 1.8).toFixed(3);
      w.el.style.transform = `translate(-50%, -50%) scale(${s.toFixed(3)})`;
    }

    const numA = bump(.455, .49, .6, .63, q);
    setLayer(num, numA, `translateY(${((1 - sstep(.455, .5, q)) * 40 - sstep(.6, .63, q) * 40).toFixed(1)}px)`);
    const counted = sstep(.465, .53, q);
    for (const c of counts) {
      const t = Math.round(c.n * counted) + (c.plus && counted > .98 ? '+' : '');
      if (c.el.textContent !== t) c.el.textContent = t;
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

    const beamA = sstep(.85, .92, q);
    setLayer(beam, beamA, `scale(${(.94 + .06 * beamA).toFixed(4)})`);

    flash.style.opacity = (bump(.775, .795, .8, .83, q) * .9).toFixed(3);
    frame.style.setProperty('--scrim', (inWorld ? sstep(.84, .95, q) * .6 : airA).toFixed(3));

    strip.style.opacity = sstep(.05, .12, p).toFixed(3);
    let ci = 0;
    CHAPTERS.forEach((c, i) => { if (p >= c.at) ci = i; });
    if (ci !== chapter) {
      chapter = ci;
      const c = CHAPTERS[ci], n = CHAPTERS[ci + 1];
      chNum.textContent = c.n;
      scramble(chName, c.name, 360);
      chNext.textContent = n ? `Next · ${n.name} ↓` : 'End of transmission · Register is next';
      railButtons.forEach((b, i) => b.classList.toggle('on', i === ci));
    }
    progress.style.width = (p * 100).toFixed(2) + '%';
    const zt = (z >= 0 ? '+' : '') + z.toFixed(1);
    if (depth.textContent !== zt) depth.textContent = zt;
    const vt = Math.min(99.9, speed).toFixed(1).padStart(4, '0');
    if (vel.textContent !== vt) vel.textContent = vt;
  };
}
