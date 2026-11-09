import Lenis from 'lenis';
import { toRaw, galleryRaw, postRaw, G, diskRaw, TRACK_VH } from '../lib/timeline.js';

export const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;

export const CHAPTERS = [
  { n: '01', name: 'On air', at: 0, go: 0 },
  { n: '02', name: 'Seven tracks', at: toRaw(.24), go: toRaw(.27) },
  { n: '03', name: 'By the numbers', at: toRaw(.52), go: toRaw(.58) },
  { n: '04', name: 'Gallery', at: galleryRaw(G.gallery[0] + .03), go: galleryRaw(G.gallery[0] + .09) },
  { n: '05', name: 'Track archive', at: galleryRaw(G.travel2[1] - .01), go: diskRaw(0) },
  { n: '06', name: 'Signal lost', at: postRaw(.655), go: postRaw(.69) }
];

const GLYPHS = '▓▒░#%&@$01<>/\\';

export function scramble(el, text, dur = 420) {
  if (REDUCE) {
    el.textContent = text;
    return;
  }
  const t0 = performance.now();
  (function step(now) {
    const k = Math.min(1, (now - t0) / dur);
    let out = '';
    for (let i = 0; i < text.length; i++) {
      out += (i / text.length < k || text[i] === ' ') ? text[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (k < 1) requestAnimationFrame(step);
  })(t0);
}

export function createShell() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  const toast = document.getElementById('toast');
  let toastTimer;
  const say = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  };

  let lenis = null;
  if (!REDUCE) {
    try {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1.0 });
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    } catch (e) {
      lenis = null;
    }
  }
  const scrollToY = (y) => {
    window.dispatchEvent(new Event('nav:manual'));
    if (lenis) lenis.scrollTo(y, { duration: 0.9 });
    else window.scrollTo({ top: y, behavior: REDUCE ? 'auto' : 'smooth' });
  };

  const menu = document.getElementById('menu');
  const menuBtn = document.getElementById('menuBtn');
  const setMenu = (open) => {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Close' : 'Menu';
    document.body.style.overflow = open ? 'hidden' : '';
    if (lenis) open ? lenis.stop() : lenis.start();
  };
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));

  document.querySelectorAll('[data-soon]').forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault();
    setMenu(false);
    say(a.dataset.soon + ' links to its section once this hero joins the main site.');
  }));

  const track = document.getElementById('top');
  track.style.height = TRACK_VH + 'vh';
  const progressToY = (p) => track.offsetTop + (track.offsetHeight - innerHeight) * p;

  const rail = document.getElementById('rail');
  CHAPTERS.forEach(c => {
    const b = document.createElement('button');
    b.innerHTML = `<span>${c.n} · ${c.name}</span><i></i>`;
    b.setAttribute('aria-label', `Go to chapter ${c.n}, ${c.name}`);
    b.addEventListener('click', () => scrollToY(progressToY(c.go)));
    rail.appendChild(b);
  });

  document.querySelectorAll('[data-jump]').forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault();
    setMenu(false);
    scrollToY(0);
  }));
  document.querySelectorAll('[data-jump-ch]').forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault();
    scrollToY(progressToY(CHAPTERS[+a.dataset.jumpCh].go));
  }));

  document.querySelectorAll('[data-scramble]').forEach(a => {
    const t = a.textContent;
    a.addEventListener('mouseenter', () => scramble(a, t));
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      if (id === 'tracks') {
        e.preventDefault(); setMenu(false); scrollToY(progressToY(CHAPTERS[4].go)); history.replaceState(null, '', '#tracks'); return;
      }
      if (id === 'gallery') {
        e.preventDefault();
        setMenu(false);
        scrollToY(progressToY(CHAPTERS[3].go));
        history.replaceState(null, '', '#gallery');
        return;
      }
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      setMenu(false);
      const y = target.getBoundingClientRect().top + window.scrollY;
      scrollToY(Math.max(0, y));
      history.replaceState(null, '', `#${id}`);
    });
  });

  return { lenis, say, track, scrollToY, progressToY, railButtons: [...rail.querySelectorAll('button')] };
}
