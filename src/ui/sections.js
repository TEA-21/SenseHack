import { TRACKS, STATS, ARCHIVE, GALLERY } from '../data.js';
import { REDUCE, scramble } from './shell.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ticks = (n, on) => Array.from({ length: n }, (_, i) => `<i${i <= on ? ' class="on"' : ''}></i>`).join('');
const ease = (t) => 1 - Math.pow(1 - t, 3);

export function createSections() {
  const trk = $('lTrk');
  trk.innerHTML = `
    <p class="k trk-cap">Track library · ${TRACKS.length} disks · scroll to pull each one</p>
    <div class="trk-panel" id="trkPanel">
      <p class="k" id="trkKicker"></p>
      <div class="trk-num" id="trkNum" aria-hidden="true"></div>
      <h2 id="trkTitle"></h2>
      <p class="trk-tag" id="trkTag"></p>
      <p class="trk-body" id="trkBody"></p>
      <ul class="trk-chips" id="trkChips"></ul>
      <div class="ticks" id="trkTicks" aria-hidden="true"></div>
    </div>`;
  const panel = $('trkPanel'), tKick = $('trkKicker'), tNum = $('trkNum'), tTitle = $('trkTitle'), tTag = $('trkTag'),
    tBody = $('trkBody'), tChips = $('trkChips'), tTicks = $('trkTicks'), tCap = trk.querySelector('.trk-cap');
  let shownTrack = -1;

  function setTrack(i, a) {
    if (i !== shownTrack) {
      shownTrack = i;
      const t = TRACKS[i];
      tKick.textContent = `Track ${t.n} / ${String(TRACKS.length).padStart(2, '0')}`;
      tNum.textContent = t.n;
      tTitle.textContent = t.name;
      tTag.textContent = t.tag;
      tBody.textContent = t.body;
      tChips.innerHTML = t.chips.map(c => `<li>${esc(c)}</li>`).join('');
      tTicks.innerHTML = ticks(TRACKS.length, i);
    }
    panel.style.opacity = a.toFixed(3);
    panel.style.transform = `translateY(${((1 - a) * 22).toFixed(1)}px)`;
  }
  const setTrackCaption = (a) => { tCap.style.opacity = a.toFixed(3); };

  const arc = $('lArc');
  arc.innerHTML = `
    <div class="arc-in">
      <p class="k">${esc(ARCHIVE.kicker)}</p>
      <h2 class="arc-title">${esc(ARCHIVE.title)} <em>${esc(ARCHIVE.em)}</em></h2>
      <div class="arc-stage">
        <div class="stats" id="stats">
          ${STATS.map(s => `<div class="stat"><b data-n="${s.n}" data-plus="${s.plus ? 1 : 0}">0${s.plus ? '+' : ''}</b><span>${esc(s.label)}</span></div>`).join('')}
        </div>
        <div class="gal" id="gal">
          ${GALLERY.map((g, i) => `
            <article class="slide" aria-hidden="true">
              <figure class="slide-media">
                <img src="${esc(g.src)}" alt="${esc(g.alt)}" decoding="async" ${i === 0 ? '' : 'loading="lazy"'}>
                <b class="cn tl"></b><b class="cn br"></b>
              </figure>
              <div class="slide-meta">
                <div class="slide-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</div>
                <h3>${esc(g.title)}</h3>
                <p class="slide-cap">${esc(g.cap)}</p>
                <div class="ticks" aria-hidden="true">${ticks(GALLERY.length, i)}</div>
                <p class="slide-note">SenseHack '26 · from the archive</p>
              </div>
            </article>`).join('')}
        </div>
      </div>
    </div>`;
  const stats = $('stats'), gal = $('gal');
  const statEls = [...stats.querySelectorAll('b')].map(el => ({ el, n: +el.dataset.n, plus: el.dataset.plus === '1' }));
  const slides = [...gal.querySelectorAll('.slide')];
  let view = '', slide = -1, countRaf = 0;

  function runCount() {
    cancelAnimationFrame(countRaf);
    const t0 = performance.now();
    const paint = (now) => {
      let done = true;
      statEls.forEach((s, i) => {
        const k = REDUCE ? 1 : Math.min(1, Math.max(0, (now - t0 - i * 130) / 1300));
        if (k < 1) done = false;
        const txt = Math.round(s.n * ease(k)) + (k >= 1 && s.plus ? '+' : '');
        if (s.el.textContent !== txt) s.el.textContent = txt;
      });
      if (!done) countRaf = requestAnimationFrame(paint);
    };
    countRaf = requestAnimationFrame(paint);
  }

  function setArchive({ alpha, wantView, slideIdx }) {
    arc.style.opacity = alpha.toFixed(3);
    const visible = alpha > .01;
    if (arc.classList.contains('on') !== visible) {
      arc.classList.toggle('on', visible);
      arc.setAttribute('aria-hidden', String(!visible));
    }
    const v = visible ? wantView : '';
    if (v !== view) {
      view = v;
      stats.classList.toggle('on', v === 'stats');
      gal.classList.toggle('on', v === 'gallery');
      if (v === 'stats') {
        statEls.forEach(s => (s.el.textContent = '0' + (s.plus ? '+' : '')));
        runCount();
      }
      if (v !== 'gallery') { slide = -1; slides.forEach(s => { s.classList.remove('on'); s.setAttribute('aria-hidden', 'true'); }); }
    }
    if (v === 'gallery' && slideIdx !== slide) {
      slide = slideIdx;
      slides.forEach((s, i) => {
        s.classList.toggle('on', i === slide);
        s.classList.toggle('past', i < slide);
        s.setAttribute('aria-hidden', String(i !== slide));
      });
    }
  }

  return { setTrack, setTrackCaption, setArchive, trkEl: trk, arcEl: arc, scramble };
}
