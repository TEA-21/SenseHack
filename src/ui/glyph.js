// "Glyph Tide": one continuous ASCII field behind the whole static site.
// A slow, domain-warped wave field is quantised into characters. Voids stay black,
// the rim of every void is picked out in bright glyphs, and mid-density areas
// become long horizontal streaks, like the reference. Palette stays orange / amber / cream.

const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;

export function startGlyph() {
  const canvas = document.getElementById('glyphBg');
  const site = document.getElementById('site');
  if (!canvas || !site) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let W = 0, H = 0, adv = 9.6, rowH = 16, cols = 0, rows = 0, fontPx = 16, grid = new Float32Array(0), visible = true, last = 0;
  const small = () => innerWidth < 760;

  // Pointer interaction: the field bulges and ripples outward around the cursor.
  const ptr = { x: -9999, y: -9999, sx: -9999, sy: -9999, energy: 0, seen: false };
  const RADIUS = () => (small() ? 120 : 200);
  addEventListener('pointermove', (e) => {
    ptr.x = e.clientX; ptr.y = e.clientY;
    if (!ptr.seen) { ptr.sx = ptr.x; ptr.sy = ptr.y; ptr.seen = true; }
    ptr.energy = 1;
  }, { passive: true });
  document.addEventListener('pointerleave', () => { ptr.energy = 0; });
  addEventListener('blur', () => { ptr.energy = 0; });

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    W = innerWidth;
    H = innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fontPx = small() ? 13 : 16;
    rowH = small() ? 14 : 17;
    ctx.font = `${fontPx}px "IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace`;
    adv = ctx.measureText('M').width || fontPx * .6;
    cols = Math.ceil(W / adv) + 1;
    rows = Math.ceil(H / rowH) + 1;
    grid = new Float32Array(cols * rows);
    draw(performance.now());
  }

  function field(x, y, t) {
    const wx = x + .2 * Math.sin(y * 3.1 + t * .33);
    const wy = y + .2 * Math.cos(x * 2.7 - t * .27);
    const a = Math.sin(wx * 5.2 + t * .21);
    const b = Math.sin(wy * 4.1 - t * .29 + a * 1.3);
    const c = Math.sin((wx + wy) * 3.4 + t * .17 + b);
    return (a + b + c) / 6 + .5;
  }

  const VOID = .36, EDGE = .42;

  function draw(now) {
    const t = now / 1000;
    const scroll = scrollY * .32;
    const R = RADIUS(), R2 = R * R;
    const live = ptr.seen && ptr.energy > .01;
    for (let r = 0; r < rows; r++) {
      const py = r * rowH;
      const ny = (py + scroll) / 620;
      for (let c = 0; c < cols; c++) {
        const px = c * adv;
        let x = px / 620, y = ny, bump = 0;
        if (live) {
          const dx = px - ptr.sx, dy = py - ptr.sy;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2 * 2.2) {
            const f = Math.exp(-d2 / R2) * ptr.energy;
            const d = Math.sqrt(d2);
            // spread: sample the field from nearer the cursor so the pattern swells outward
            x -= dx / 620 * .55 * f;
            y -= dy / 620 * .55 * f;
            // ripple rings travelling out from the cursor
            bump = Math.sin(d / 26 - t * 7) * .09 * f;
          }
        }
        grid[r * cols + c] = field(x, y, t) + bump;
      }
    }

    ctx.clearRect(0, 0, W, H);
    ctx.font = `${fontPx}px "IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace`;
    ctx.textBaseline = 'top';

    const dim = [], plus = [], edge = [];
    const lines = [];
    for (let r = 0; r < rows; r++) {
      let sDim = '', sPlus = '', sEdge = '';
      let runStart = -1;
      for (let c = 0; c < cols; c++) {
        const v = grid[r * cols + c];
        let d = ' ', p = ' ', e = ' ', inLine = false;
        if (v >= VOID) {
          const up = r > 0 ? grid[(r - 1) * cols + c] : v, dn = r < rows - 1 ? grid[(r + 1) * cols + c] : v;
          const lf = c > 0 ? grid[r * cols + c - 1] : v, rt = c < cols - 1 ? grid[r * cols + c + 1] : v;
          const rim = Math.min(up, dn, lf, rt) < VOID;
          const h = ((c * 73856093) ^ (r * 19349663)) & 3;
          if (rim || v < EDGE) e = h < 2 ? '#' : h === 2 ? '*' : '%';
          else if (v < .56) d = h === 0 ? '.' : ':';
          else if (v < .72) inLine = true;
          else p = h < 2 ? '+' : '*';
        }
        sDim += d; sPlus += p; sEdge += e;
        if (inLine) { if (runStart < 0) runStart = c; }
        else if (runStart >= 0) { lines.push(runStart, c, r); runStart = -1; }
      }
      if (runStart >= 0) lines.push(runStart, cols, r);
      dim.push(sDim); plus.push(sPlus); edge.push(sEdge);
    }

    ctx.fillStyle = 'rgba(255,90,31,.15)';
    for (let r = 0; r < rows; r++) if (dim[r].trim()) ctx.fillText(dim[r], 0, r * rowH);

    ctx.fillStyle = 'rgba(255,100,40,.18)';
    for (let i = 0; i < lines.length; i += 3) {
      ctx.fillRect(lines[i] * adv + 1, lines[i + 2] * rowH + rowH * .5, (lines[i + 1] - lines[i]) * adv - 2, 1.4);
    }

    ctx.fillStyle = 'rgba(255,140,70,.34)';
    for (let r = 0; r < rows; r++) if (plus[r].trim()) ctx.fillText(plus[r], 0, r * rowH);

    ctx.fillStyle = 'rgba(255,190,150,.5)';
    for (let r = 0; r < rows; r++) if (edge[r].trim()) ctx.fillText(edge[r], 0, r * rowH);
  }

  function loop(now) {
    requestAnimationFrame(loop);
    if (!visible || document.hidden) return;
    // ease the pointer and let the effect fade once the cursor stops
    ptr.sx += (ptr.x - ptr.sx) * .22;
    ptr.sy += (ptr.y - ptr.sy) * .22;
    ptr.energy *= .96;
    const active = ptr.seen && ptr.energy > .01;
    const gap = active ? 33 : (small() ? 80 : 50);
    if (now - last < gap) return;
    last = now;
    draw(now);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es) => { visible = es.some(e => e.isIntersecting); }, { rootMargin: '0px' }).observe(site);
  }
  addEventListener('resize', resize);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(resize);
  resize();
  if (REDUCE) {
    addEventListener('scroll', () => draw(0), { passive: true });
    return;
  }
  requestAnimationFrame(loop);
}
