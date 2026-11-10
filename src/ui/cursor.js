import { REDUCE } from './shell.js';

const DOM_HOT = 'a[href],button:not([disabled]),summary,[data-cursor],.gal-card';

export function createCursor() {
  const fine = matchMedia('(pointer: fine)').matches && !REDUCE;
  const el = document.getElementById('cur');
  const label = document.getElementById('curLbl');
  let x = -100, y = -100, tx = -100, ty = -100;
  let glHot = false, domHot = false;

  const apply = () => el.classList.toggle('hot', glHot || domHot);

  if (fine) {
    document.documentElement.classList.add('has-cursor');
    addEventListener('pointermove', (e) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }, { passive: true });
    // Only real controls get the "hot" ring. Static things never do.
    addEventListener('pointerover', (e) => {
      const t = e.target.closest ? e.target.closest(DOM_HOT) : null;
      if (t && t.closest('.layer:not(.on)')) { domHot = false; apply(); return; }
      domHot = !!t;
      if (t && !glHot) label.textContent = t.dataset.cursor || '';
      apply();
    }, { passive: true });
  }

  return {
    fine,
    hot(text) {
      glHot = true;
      label.textContent = text || '';
      apply();
    },
    cold() {
      glHot = false;
      apply();
    },
    grab(on) {
      el.classList.toggle('grab', on);
    },
    update() {}
  };
}
