import * as THREE from 'three';
import { canvasTex, sstep } from '../lib/utils.js';
import { makeFloppy, registerRedraw } from './props.js';
import { TRACKS } from '../data.js';

const N = TRACKS.length;
const GAP = .98;                 // slot pitch
const K0 = .24;                  // floppy scale while stored
const INNER_W = N * GAP;
const W = INNER_W + .26;         // rack width
const H = 1.5;                   // rack height
const FRONT_TOP = .25;           // top edge of the front panel (local y)
const Y_REST = .256;             // floppy centre while stored (top ~.45 above the panel)
const Y_CLEAR = 1.3;             // floppy centre once it has cleared the slot
const Z_SLOT = -.12;
const OUT_SPEED = .74;           // 1 / seconds to pull a disk out and present it
const BACK_SPEED = .98;          // 1 / seconds to slide it home

export const RACK = { W, H, anchorY: 1.55 };

const slotX = (i) => (i - (N - 1) / 2) * GAP;

function drawPanel(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#1d1816');
  g.addColorStop(1, '#0f0c0b');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ff5a1f';
  ctx.fillRect(0, 0, w, 5);
  ctx.strokeStyle = 'rgba(243,234,223,.12)';
  ctx.lineWidth = 2;
  const pitch = w * GAP / W;
  for (let i = 0; i <= N; i++) {
    const x = w / 2 + (i - N / 2) * pitch;
    ctx.beginPath();
    ctx.moveTo(x, 26);
    ctx.lineTo(x, h - 60);
    ctx.stroke();
  }
  ctx.textAlign = 'center';
  TRACKS.forEach((t, i) => {
    const x = w / 2 + (i - (N - 1) / 2) * pitch;
    ctx.fillStyle = '#ff5a1f';
    ctx.font = '600 44px "IBM Plex Mono", ui-monospace, monospace';
    ctx.fillText('T' + t.n, x, 92);
    ctx.fillStyle = '#9d9186';
    ctx.font = '500 17px "IBM Plex Mono", ui-monospace, monospace';
    ctx.fillText(t.name.toUpperCase(), x, 130);
  });
  ctx.textAlign = 'left';
  ctx.fillStyle = '#9d9186';
  ctx.font = '500 16px "IBM Plex Mono", ui-monospace, monospace';
  ctx.fillText("SENSE HACK '26 · TRACK LIBRARY", 34, h - 24);
  ctx.textAlign = 'right';
  ctx.fillText(`${N} × 1.44 MB`, w - 34, h - 24);
}

export function createRack(scene) {
  const rack = new THREE.Group();
  scene.add(rack);

  const shell = new THREE.MeshStandardMaterial({ color: '#1a1614', roughness: .55, metalness: .3, envMapIntensity: .8 });
  const inner = new THREE.MeshStandardMaterial({ color: '#0b0908', roughness: .9, metalness: 0 });
  const box = (w, h, d, x, y, z, mat = shell) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    rack.add(m);
    return m;
  };

  box(W, H, .06, 0, 0, -.37, inner);                       // back wall
  box(W, .08, .52, 0, -H / 2 + .04, -.12);                  // floor
  box(.13, H + .06, .54, -W / 2 + .065, 0, -.1);            // end caps
  box(.13, H + .06, .54, W / 2 - .065, 0, -.1);
  for (let i = 1; i < N; i++) box(.03, H - .06, .44, (i - N / 2) * GAP, 0, -.14, inner); // slot dividers

  const panelTex = canvasTex(2048, Math.round(2048 / W), (c, w, h) => drawPanel(c, w, h));
  registerRedraw(() => { drawPanel(panelTex.image.getContext('2d'), panelTex.image.width, panelTex.image.height); panelTex.needsUpdate = true; });
  const panelH = FRONT_TOP + H / 2;
  box(W - .02, panelH, .05, 0, FRONT_TOP - panelH / 2, .07);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(W - .02, panelH), new THREE.MeshStandardMaterial({ map: panelTex, roughness: .7, metalness: .1 }));
  face.position.set(0, FRONT_TOP - panelH / 2, .0965);
  rack.add(face);

  // one amber LED per slot, lit while its disk is out
  const leds = [];
  for (let i = 0; i < N; i++) {
    const led = new THREE.Mesh(new THREE.PlaneGeometry(.2, .035), new THREE.MeshBasicMaterial({ color: '#ffa24a', transparent: true, opacity: .12 }));
    led.position.set(slotX(i), -.58, .099);
    rack.add(led);
    leds.push(led);
  }

  const floppies = TRACKS.map((t, i) => {
    const f = makeFloppy(scene, t.color, t.name.toLowerCase(), t.stripe, `track ${t.n}`);
    rack.add(f);
    f.scale.setScalar(K0);
    f.position.set(slotX(i), Y_REST, Z_SLOT);
    Object.assign(f.userData, { trackIndex: i, t: 0, label: `Track ${t.n} · ${t.name} · click` });
    return f;
  });

  let lead = 0, leadT = 0;

  function update({ dt, time, want, motion, portrait }) {
    rack.scale.setScalar(portrait ? .5 : 1);
    const xd = portrait ? 0 : -2.15;
    const yd = portrait ? 3.3 : 1.9;
    const kd = portrait ? .66 : .58;
    const zd = portrait ? 1.6 : .9;

    const busy = floppies.some((f, i) => i !== want && f.userData.t > .002);
    lead = 0;
    leadT = 0;
    floppies.forEach((f, i) => {
      const u = f.userData;
      const goOut = i === want && !busy;
      if (!motion) u.t = goOut ? 1 : 0;
      else if (goOut) u.t = Math.min(1, u.t + dt * OUT_SPEED);
      else u.t = Math.max(0, u.t - dt * BACK_SPEED);
      if (u.t > leadT) { leadT = u.t; lead = i; }

      const a = sstep(0, .42, u.t);        // slide up out of the slot
      const b = sstep(.4, 1, u.t);         // swing out front and present
      const x = slotX(i) + (xd - slotX(i)) * b;
      const y = Y_REST + (Y_CLEAR - Y_REST) * a + (yd - Y_CLEAR) * b + Math.sin(time * 1.1 + i) * .04 * b * motion;
      const z = Z_SLOT + (zd - Z_SLOT) * b;
      f.position.set(x, y, z);
      f.scale.setScalar(K0 + (kd - K0) * b);
      f.rotation.set(.05 * b, -.3 * b + Math.sin(time * .7 + i) * .05 * b * motion, .035 * b);
      leds[i].material.opacity = .12 + .88 * sstep(.05, .5, u.t);
    });
  }

  return { group: rack, floppies, update, get lead() { return lead; }, get leadT() { return leadT; } };
}
