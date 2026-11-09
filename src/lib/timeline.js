// Scroll timeline for the pinned cinematic intro.
//
//   room -> tunnel -> BY THE NUMBERS -> (drift through space) -> GALLERY
//        -> (drift through space) -> FLOPPY BOX (one scroll step per disk)
//        -> one-scroll pause -> SIGNAL LOST -> glitch smear -> static website
//
// Everything after "By the numbers" is the "hold": a stretch of real scroll in which the
// camera keeps travelling down the tunnel while each chapter plays. The hold is described
// once, in viewport-heights, so retiming a chapter is a one-number change below.
//
//   raw scroll (0..1)  ->  warp()  ->  { p, g }
//     p : progress on the ORIGINAL timeline (what the world / layers already use)
//     g : 0..1 progress through the hold (0 before it, 1 after it)

import { monotone, sstep } from './utils.js';

export const P_CUT = .16;          // room -> world cut (original timeline)
const D_OLD = 2.6;                 // original scroll distance, in viewport heights
const Q_HOLD = .55;                // the hold starts once the numbers have settled

// ---- the hold, in viewport heights of scroll -------------------------------------------
const PART = {
  numOut: .45,     // numbers leave
  travel1: 1.15,   // empty space, the camera keeps moving; view swings to the right
  gallery: 3.0,    // photos
  travel2: 1.3,    // empty space again; view swings to the right for the box
  disks: 5.4,      // the floppy box: ~0.72vh of scroll per disk
  pause: 1         // hold after the disks before SIGNAL LOST
};
const POST_SIG = 1.1;              // SIGNAL LOST
const POST_OUT = .9;               // glitch smear into the static site

const HOLD_VH = PART.numOut + PART.travel1 + PART.gallery + PART.travel2 + PART.disks + PART.pause;
const S0 = D_OLD * (P_CUT + (1 - P_CUT) * Q_HOLD);   // hold starts (vh of scroll)
const S1 = S0 + HOLD_VH;                              // hold ends

export const D = S1 + POST_SIG + POST_OUT;
export const TRACK_VH = 100 + D * 100;

// Phase boundaries expressed in g (0..1 across the hold).
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

// How far down the tunnel (q, original timeline) the camera is at each phase boundary.
export const Q_DISKS = .634;       // q while the box is on screen (camera barely moves)
const Q_POST_START = .64;         // keep drifting forward during the pause before signal loss
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

// Where a point on the ORIGINAL timeline (before the hold) sits on the real scroll track.
export const toRaw = (pOld) => (pOld * D_OLD) / D;

// Where a point inside the hold (0..1) sits on the real scroll track.
export const galleryRaw = (g) => (S0 + g * HOLD_VH) / D;

// Where a point after the hold (q between Q_DISKS and 1) sits on the real scroll track.
export const postRaw = (q) => {
  const u = q < Q_SIG_END
    ? (q - Q_POST_START) / (Q_SIG_END - Q_POST_START) * POST_SIG
    : POST_SIG + (q - Q_SIG_END) / (1 - Q_SIG_END) * POST_OUT;
  return (S1 + u) / D;
};

// ---- floppy box: one scroll step per disk --------------------------------------------
export const DISK_N = 7;
const DISK_LEAD = .15, DISK_EXTRA = .45;

// "disk time": disk i is held out of the box around s = i + .5
export function diskScroll(g) {
  const p = Math.min(1, Math.max(0, (g - G.disks[0]) / (G.disks[1] - G.disks[0])));
  return p * (DISK_N + DISK_EXTRA) - DISK_LEAD;
}

// 0 = sitting in its slot, 1 = fully out and presented. Disk i is slid back in while
// disk i+1 is only just beginning to rise, so one goes in as the next comes out.
export const diskAmt = (i, s) => sstep(i - .1, i + .35, s) * (1 - sstep(i + .65, i + 1.05, s));

export const diskRaw = (i) => {
  const p = (i + .5 + DISK_LEAD) / (DISK_N + DISK_EXTRA);
  return galleryRaw(G.disks[0] + p * (G.disks[1] - G.disks[0]));
};
