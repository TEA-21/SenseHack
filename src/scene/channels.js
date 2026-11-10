import { remain, pad } from '../ui/countdown.js';
import { TRACKS, STATS } from '../data.js';

const W = 1024, H = 768;
const MONO = '"IBM Plex Mono", monospace';
const DISPLAY = '"Unbounded", "Arial Black", sans-serif';

export const CHANNELS = [
  { id: 'title', name: 'SENSEHACK' },
  { id: 'launch', name: 'LAUNCH WINDOW' },
  { id: 'film', name: 'LAST YEAR · AFTERMOVIE' },
  { id: 'team', name: 'IEEE-VIT · THE TEAM' },
  { id: 'archive', name: 'ARCHIVE · SENSEHACK ’25' },
  { id: 'about', name: 'ABOUT THE EVENT' },
  { id: 'tracks', name: 'SEVEN TRACKS' },
  { id: 'numbers', name: 'LAST TIME IN NUMBERS' }
];

export const VOLUME_STEPS = 5;

const IMAGES = {
  team: '/tv/team.jpg',
  hall: '/tv/hall.jpg',
  g1: '/images/gallery/01.jpg',
  g2: '/images/gallery/02.jpg',
  g3: '/images/gallery/03.jpg',
  g4: '/images/gallery/04.jpg'
};

const SLIDES = [
  { key: 'hall', title: 'THE BUILD FLOOR', sub: 'Teams settling in for the night' },
  { key: 'g1', title: 'THE HALL', sub: 'Phase 1 · Anna Auditorium' },
  { key: 'g2', title: 'THE BUILD', sub: 'Teams at work' },
  { key: 'g3', title: 'THE PITCHES', sub: 'Problem statement round' },
  { key: 'g4', title: 'THE WINNERS', sub: 'Valedictory' }
];

export const media = { imgs: {}, video: null, started: false };

export function loadMedia() {
  if (media.started) return;
  media.started = true;
  for (const [k, src] of Object.entries(IMAGES)) {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    media.imgs[k] = img;
  }
}

export function loadVideo() {
  if (media.video) return media.video;
  const v = document.createElement('video');
  v.src = '/tv/aftermovie.mp4';
  v.preload = 'auto';
  v.loop = true;
  v.playsInline = true;
  v.setAttribute('playsinline', '');
  v.setAttribute('webkit-playsinline', '');
  v.crossOrigin = 'anonymous';
  media.video = v;
  return v;
}

const ready = (img) => img && img.complete && img.naturalWidth > 0;

function cover(ctx, img, fx = .5, fy = .5) {
  const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
  const w = img.naturalWidth * s, h = img.naturalHeight * s;
  ctx.drawImage(img, -(w - W) * fx, -(h - H) * fy, w, h);
}

function contain(ctx, src, sw, sh) {
  const s = Math.min(W / sw, H / sh);
  const w = sw * s, h = sh * s;
  ctx.drawImage(src, (W - w) / 2, (H - h) / 2, w, h);
}

function glow(ctx, t, x, y, font, col, blur = 18, align = 'center') {
  ctx.textAlign = align;
  ctx.font = font;
  ctx.shadowColor = 'rgba(255,110,40,.9)';
  ctx.shadowBlur = blur;
  ctx.fillStyle = col;
  ctx.fillText(t, x, y);
  ctx.shadowBlur = 0;
}

function background(ctx) {
  const bg = ctx.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, W * .62);
  bg.addColorStop(0, '#3a1708');
  bg.addColorStop(.6, '#1c0b04');
  bg.addColorStop(1, '#070302');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
}

function header(ctx, idx) {
  glow(ctx, `CH ${pad(idx + 1)} · ${CHANNELS[idx].name}`, 44, 62, `600 26px ${MONO}`, '#ff7a33', 10, 'left');
}

function caption(ctx, title, sub) {
  const g = ctx.createLinearGradient(0, H * .66, 0, H);
  g.addColorStop(0, 'rgba(7,3,2,0)');
  g.addColorStop(1, 'rgba(7,3,2,.92)');
  ctx.fillStyle = g;
  ctx.fillRect(0, H * .66, W, H * .34);
  glow(ctx, title, 44, H - 74, `700 44px ${DISPLAY}`, '#fff3e6', 18, 'left');
  glow(ctx, sub, 44, H - 32, `500 24px ${MONO}`, '#ffb067', 8, 'left');
}

function topShade(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, 150);
  g.addColorStop(0, 'rgba(7,3,2,.85)');
  g.addColorStop(1, 'rgba(7,3,2,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 150);
}

function osd(ctx, S) {
  if (S.osdCh) {
    glow(ctx, pad(S.ch + 1), W - 52, 96, `700 64px ${MONO}`, '#ff7a33', 14, 'right');
  }
  if (S.osdVol) {
    glow(ctx, 'VOL', 52, H - 52, `700 30px ${MONO}`, '#ff7a33', 10, 'left');
    for (let i = 0; i < VOLUME_STEPS - 1; i++) {
      ctx.fillStyle = i < S.vol ? '#ff7a33' : 'rgba(255,122,51,.22)';
      ctx.fillRect(130 + i * 34, H - 80, 24, 30);
    }
    if (S.vol === 0) glow(ctx, 'MUTE', 130 + 4 * 34 + 8, H - 52, `700 26px ${MONO}`, '#fff3e6', 8, 'left');
  }
}

export function drawChannel(ctx, idx, S) {
  const id = CHANNELS[idx].id;
  const r = remain();
  ctx.textBaseline = 'alphabetic';
  background(ctx);

  if (id === 'title') {
    const blink = (Date.now() / 530 | 0) % 2 === 0;
    ctx.font = `900 112px ${DISPLAY}`;
    const a = 'SENSEHACK ', b = '’26';
    const wa = ctx.measureText(a).width, wb = ctx.measureText(b).width;
    const scale = Math.min(1, 900 / (wa + wb));
    ctx.save();
    ctx.translate(W / 2, 390);
    ctx.scale(scale, scale);
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(255,140,80,.95)';
    ctx.shadowBlur = 28;
    ctx.fillStyle = '#fff3e6';
    ctx.fillText(a, -(wa + wb) / 2, 0);
    ctx.fillStyle = '#ff5a1f';
    ctx.fillText(b, -(wa + wb) / 2 + wa, 0);
    ctx.restore();
    ctx.shadowBlur = 0;
    glow(ctx, '[ SCROLL TO ENTER ]' + (blink ? ' █' : '  '), W / 2, 520, `500 30px ${MONO}`, '#ff7a33', 12);
    glow(ctx, 'TURN THE KNOB TO CHANGE CHANNEL', W / 2, 600, `500 20px ${MONO}`, '#d19a76', 6);
  } else if (id === 'launch') {
    header(ctx, idx);
    glow(ctx, `${pad(r.d)}:${pad(r.h)}:${pad(r.m)}:${pad(r.s)}`, W / 2, 400, `700 120px ${DISPLAY}`, '#fff3e6', 26);
    glow(ctx, 'DAYS     HRS      MIN      SEC', W / 2, 460, `500 26px ${MONO}`, '#c8a58a', 6);
    glow(ctx, 'DEC 9–10 · ANNA AUDITORIUM · VIT VELLORE', W / 2, 580, `500 26px ${MONO}`, '#ff7a33', 10);
  } else if (id === 'film') {
    const v = media.video;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    if (v && v.readyState >= 2 && v.videoWidth) {
      contain(ctx, v, v.videoWidth, v.videoHeight);
    } else {
      glow(ctx, 'TUNING…', W / 2, H / 2, `700 44px ${MONO}`, '#ff7a33', 12);
    }
    topShade(ctx);
    header(ctx, idx);
  } else if (id === 'team') {
    const img = media.imgs.team;
    if (ready(img)) cover(ctx, img, .5, .55);
    topShade(ctx);
    header(ctx, idx);
    caption(ctx, 'IEEE-VIT', 'The team behind SenseHack');
  } else if (id === 'archive') {
    const i = Math.floor(Date.now() / 2600) % SLIDES.length;
    const s = SLIDES[i];
    const img = media.imgs[s.key];
    if (ready(img)) cover(ctx, img, .5, s.key === 'hall' ? .5 : .45);
    topShade(ctx);
    header(ctx, idx);
    caption(ctx, s.title, s.sub);
    for (let k = 0; k < SLIDES.length; k++) {
      ctx.fillStyle = k === i ? '#ff7a33' : 'rgba(255,255,255,.3)';
      ctx.fillRect(W - 44 - (SLIDES.length - k) * 30, H - 46, 22, 4);
    }
  } else if (id === 'about') {
    header(ctx, idx);
    glow(ctx, 'A 36-HOUR', W / 2, 250, `700 56px ${DISPLAY}`, '#fff3e6', 22);
    glow(ctx, 'NATIONAL HACKATHON', W / 2, 330, `700 56px ${DISPLAY}`, '#ff5a1f', 22);
    const lines = ['Hardware + software · 7 tracks', 'Dec 9–10, 2026 · Anna Auditorium', 'VIT Vellore · open to students nationwide'];
    lines.forEach((l, i) => glow(ctx, l, W / 2, 430 + i * 50, `500 28px ${MONO}`, i === 1 ? '#ffb067' : '#d9c3b0', 8));
    glow(ctx, 'By IEEE-VIT × IEEE ComSoc', W / 2, 640, `500 22px ${MONO}`, '#a37556', 6);
  } else if (id === 'tracks') {
    header(ctx, idx);
    TRACKS.forEach((t, i) => {
      const col = i < 4 ? 0 : 1;
      const row = i < 4 ? i : i - 4;
      const x = 70 + col * 470, y = 190 + row * 100;
      glow(ctx, pad(i + 1), x, y, `700 34px ${MONO}`, '#ff5a1f', 10, 'left');
      glow(ctx, t.name.toUpperCase(), x + 70, y, `700 30px ${DISPLAY}`, '#fff3e6', 12, 'left');
    });
  } else if (id === 'numbers') {
    header(ctx, idx);
    glow(ctx, 'LAST TIME, ON THE BENCH', W / 2, 200, `500 26px ${MONO}`, '#c8a58a', 6);
    const four = STATS.slice(0, 4);
    four.forEach((s, i) => {
      const x = 270 + (i % 2) * 484, y = 350 + Math.floor(i / 2) * 190;
      glow(ctx, `${s.n}${s.plus ? '+' : ''}`, x, y, `900 92px ${DISPLAY}`, '#fff3e6', 22);
      glow(ctx, s.label.toUpperCase(), x, y + 46, `500 26px ${MONO}`, '#ff7a33', 8);
    });
  }

  osd(ctx, S);
}
