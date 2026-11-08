import Lenis from 'lenis';

export const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;

export const CHAPTERS = [
  { n: '01', name: 'On air', at: 0, go: 0 },
  { n: '02', name: 'Seven tracks', at: .24, go: .27 },
  { n: '03', name: 'By the numbers', at: .52, go: .58 },
  { n: '04', name: 'Signal lost', at: .69, go: .72 },
  { n: '05', name: 'Back on air', at: .81, go: .97 }
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
      lenis = new Lenis({ lerp: .085, smoothWheel: true, wheelMultiplier: .9 });
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    } catch (e) {
      lenis = null;
    }
  }
  const scrollToY = (y) => {
    if (lenis) lenis.scrollTo(y, { duration: 2.4 });
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

  return { lenis, say, track, progressToY, railButtons: [...rail.querySelectorAll('button')] };
}
