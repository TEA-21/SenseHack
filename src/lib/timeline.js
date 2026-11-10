
import { monotone, sstep } from './utils.js';

export const P_CUT = .16;
const D_OLD = 2.6;
const Q_HOLD = .55;

const PART = {
  numOut: .45,
  travel1: 1.15,
  gallery: 3.0,
  travel2: 1.3,
  disks: 5.4,
  pause: 1
};
const POST_SIG = 1.1;
const POST_OUT = .9;

const HOLD_VH = PART.numOut + PART.travel1 + PART.gallery + PART.travel2 + PART.disks + PART.pause;
const S0 = D_OLD * (P_CUT + (1 - P_CUT) * Q_HOLD);
const S1 = S0 + HOLD_VH;

export const D = S1 + POST_SIG + POST_OUT;
export const TRACK_VH = 100 + D * 100;

const e1 = PART.numOut / HOLD_VH;
const e2 = e1 + PART.travel1 / HOLD_VH;
const e3 = e2 + PART.gallery / HOLD_VH;
const e4 = e3 + PART.travel2 / HOLD_VH;
const e5 = e4 + PART.disks / HOLD_VH;
export const G = {
  numOut: [0, e1],
  travel1: [e1, e2],
  gallery: [e2, e3],
  travel2: [e3, e4],
  disks: [e4, e5],
  pause: [e5, 1]
};

export const Q_DISKS = .634;
const Q_POST_START = .64;
const qHold = monotone([[0, Q_HOLD], [e1, .5525], [e2, .5755], [e3, .600], [e4, .630], [e5, Q_DISKS], [1, Q_POST_START]]);
const Q_SIG_END = .745;

export function warp(pr) {
  const s = pr * D;
  if (s <= S0) return { p: s / D_OLD, g: 0 };
  let q, g = 1;
  if (s < S1) {
    g = (s - S0) / HOLD_VH;
    q = qHold(g);
  } else {
    const u = s - S1;
    q = u < POST_SIG
      ? Q_POST_START + (u / POST_SIG) * (Q_SIG_END - Q_POST_START)
      : Q_SIG_END + Math.min(1, (u - POST_SIG) / POST_OUT) * (1 - Q_SIG_END);
  }
  return { p: P_CUT + (1 - P_CUT) * q, g };
}

export const toRaw = (pOld) => (pOld * D_OLD) / D;

export const galleryRaw = (g) => (S0 + g * HOLD_VH) / D;

export const postRaw = (q) => {
  const u = q < Q_SIG_END
    ? (q - Q_POST_START) / (Q_SIG_END - Q_POST_START) * POST_SIG
    : POST_SIG + (q - Q_SIG_END) / (1 - Q_SIG_END) * POST_OUT;
  return (S1 + u) / D;
};

export const DISK_N = 7;
const DISK_LEAD = .15, DISK_EXTRA = .45;

export function diskScroll(g) {
  const p = Math.min(1, Math.max(0, (g - G.disks[0]) / (G.disks[1] - G.disks[0])));
  return p * (DISK_N + DISK_EXTRA) - DISK_LEAD;
}

export const diskAmt = (i, s) => sstep(i - .1, i + .35, s) * (1 - sstep(i + .65, i + 1.05, s));

export const diskRaw = (i) => {
  const p = (i + .5 + DISK_LEAD) / (DISK_N + DISK_EXTRA);
  return galleryRaw(G.disks[0] + p * (G.disks[1] - G.disks[0]));
};
