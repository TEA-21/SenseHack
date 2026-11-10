import * as THREE from 'three';
import { canvasTex, sstep } from '../lib/utils.js';
import { TRACKS } from '../data.js';
import { sfx } from '../ui/sound.js';

const N = TRACKS.length;
const K = .5;
const PITCH = .3;
const LEN = (N - 1) * PITCH + .62;
const DEPTH = 2.1;
const HEIGHT = 1.4;
const WALL = .1;
const Y_REST = -.42;
const Y_RISE = 1.55;
const EJECT_T = 1.35;
const RETURN_T = .62;
const LABEL_W = 1024, LABEL_H = 838;
export const BOX_YAW = .5;
export const BOX_FIT = { w: 3.4, h: 3.4, midY: .15 };

const slotX = (i) => (i - (N - 1) / 2) * PITCH;
const pad = (n) => String(n).padStart(2, '0');
const easeInOut = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeIn = (t) => t * t * t;
const outBack = (t) => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const GLYPHS = '▓▒░#%&@$01<>/';
const isDark = (hex) => { const c = new THREE.Color(hex); return c.r * .3 + c.g * .59 + c.b * .11 < .45; };

function wrap(ctx, text, maxW) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function fitFill(ctx, text, x, y, maxW) {
  const w = ctx.measureText(text).width;
  if (w <= maxW) { ctx.fillText(text, x, y); return; }
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(maxW / w, 1);
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function drawLabel(ctx, t, i, reveal) {
  const W = LABEL_W, H = LABEL_H, M = 52;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#efe6da';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(120,90,60,.06)';
  for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1);

  ctx.fillStyle = t.stripe;
  ctx.fillRect(0, 0, W, 78);
  const onStripe = isDark(t.stripe) ? '#efe6da' : '#141110';
  ctx.fillStyle = onStripe;
  ctx.font = '600 30px "IBM Plex Mono", ui-monospace, monospace';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText(`TRACK ${pad(i + 1)} / ${pad(N)}`, M, 40);
  ctx.textAlign = 'right';
  ctx.fillText('MF2HD · 1.44 MB', W - M, 40);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  const k = Math.max(0, Math.min(1, reveal));
  const titleK = sstep(0, .22, k);
  let title = t.name.toUpperCase();
  if (titleK < 1) {
    let out = '';
    for (let c = 0; c < title.length; c++) out += (c / title.length < titleK || title[c] === ' ') ? title[c] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    title = out;
  }
  let size = 92;
  ctx.font = `900 ${size}px "Unbounded", "Arial Black", sans-serif`;
  while (ctx.measureText(t.name.toUpperCase()).width > W - M * 2 && size > 40) {
    size -= 2;
    ctx.font = `900 ${size}px "Unbounded", "Arial Black", sans-serif`;
  }
  ctx.fillStyle = '#141110';
  fitFill(ctx, title, M, 108 + size, W - M * 2 - 8);

  const tagA = sstep(.18, .34, k);
  ctx.globalAlpha = tagA;
  ctx.fillStyle = '#c43d0c';
  ctx.font = '56px "Brigold", "Unbounded", "Arial Black", sans-serif';
  fitFill(ctx, t.tag, M, 108 + size + 70, W - M * 2 - 24);
  ctx.globalAlpha = 1;

  const ruleY = 108 + size + 108;
  ctx.fillStyle = '#141110';
  ctx.fillRect(M, ruleY, (W - M * 2) * sstep(.25, .4, k), 3);

  const chipY = H - 150;
  const descTop = ruleY + 66, descBottom = chipY - 34 - 26;
  let dSize = 36, lines;
  const dFont = () => `500 ${dSize}px "Inter", system-ui, sans-serif`;
  for (;;) {
    ctx.font = dFont();
    lines = wrap(ctx, t.desc, W - M * 2 - 24);
    if (descTop + (lines.length - 1) * dSize * 1.36 <= descBottom || dSize <= 24) break;
    dSize -= 2;
  }
  const lh = dSize * 1.36;
  ctx.fillStyle = '#2a1d16';
  const total = t.desc.length;
  let shown = Math.floor(sstep(.32, .82, k) * total);
  lines.forEach((ln, li) => {
    const part = ln.slice(0, Math.max(0, shown));
    shown -= ln.length + 1;
    ctx.fillText(part, M, descTop + li * lh);
  });
  if (k > .32 && k < .84 && (Date.now() / 300 | 0) % 2 === 0) {
    const li = Math.min(lines.length - 1, lines.findIndex((_, j) => lines.slice(0, j + 1).join(' ').length >= Math.floor(sstep(.32, .82, k) * total)));
    const row = li < 0 ? lines.length - 1 : li;
    const typed = Math.floor(sstep(.32, .82, k) * total) - lines.slice(0, row).join(' ').length - (row ? 1 : 0);
    const x = M + ctx.measureText(lines[row].slice(0, Math.max(0, typed))).width + 4;
    ctx.fillStyle = '#ff5a1f';
    ctx.fillRect(x, descTop + row * lh - dSize * .83, 18, dSize);
  }

  const chips = t.focus.split('·').map(s => s.trim()).filter(Boolean);
  let x = M;
  ctx.font = '600 25px "IBM Plex Mono", ui-monospace, monospace';
  chips.forEach((c, ci) => {
    const a = sstep(.8 + ci * .05, .88 + ci * .05, k);
    if (a <= 0) return;
    const label = c.toUpperCase();
    const w = ctx.measureText(label).width + 36;
    if (x + w > W - M) return;
    ctx.globalAlpha = a;
    ctx.strokeStyle = '#141110';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, chipY - 34, w, 48);
    ctx.fillStyle = '#141110';
    ctx.fillText(label, x + 18, chipY);
    x += w + 14;
  });
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#7a6b60';
  ctx.font = '500 24px "IBM Plex Mono", ui-monospace, monospace';
  ctx.fillText("SENSEHACK '26 · DEC 9–10 · VIT VELLORE", M, H - 48);
  for (let b = 0; b < 22; b++) {
    ctx.fillStyle = '#141110';
    ctx.fillRect(W - M - 170 + b * 8, H - 76, (b * 7) % 3 + 2, 36);
  }
}

function drawBack(ctx, t, i) {
  const W = 512, H = 300;
  ctx.fillStyle = '#efe6da';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = t.stripe;
  ctx.fillRect(0, 0, W, 26);
  ctx.fillStyle = '#141110';
  ctx.font = '900 150px "Unbounded", "Arial Black", sans-serif';
  ctx.fillText(pad(i + 1), 28, 200);
  ctx.font = '600 24px "IBM Plex Mono", ui-monospace, monospace';
  ctx.fillText(t.name.toUpperCase(), 32, 262);
}

function makeTrackDisk(t, i) {
  const g = new THREE.Group();
  const shell = new THREE.MeshStandardMaterial({ color: t.color, roughness: .45, metalness: .05, envMapIntensity: .7 });
  g.add(new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.7, .14), shell));

  const metal = new THREE.MeshStandardMaterial({ color: '#7f7a76', metalness: .6, roughness: .5, envMapIntensity: .35 });
  const dark = new THREE.MeshStandardMaterial({ color: '#141110', roughness: .8 });
  const shutter = new THREE.Group();
  shutter.position.set(.15, 1.4, 0);
  shutter.add(new THREE.Mesh(new THREE.BoxGeometry(1.7, .82, .16), metal));
  for (const z of [.082, -.082]) {
    const slot = new THREE.Mesh(new THREE.PlaneGeometry(.36, .56), dark);
    slot.position.set(.38, 0, z);
    if (z < 0) slot.rotation.y = Math.PI;
    shutter.add(slot);
  }
  g.add(shutter);

  const tex = canvasTex(LABEL_W, LABEL_H, (c) => drawLabel(c, t, i, 1));
  tex.anisotropy = 8;
  const label = new THREE.Mesh(new THREE.PlaneGeometry(3.24, 3.24 * LABEL_H / LABEL_W), new THREE.MeshStandardMaterial({ map: tex, roughness: .85, envMapIntensity: .3 }));
  label.position.set(0, -.36, .072);
  g.add(label);

  const backTex = canvasTex(512, 300, (c) => drawBack(c, t, i));
  const back = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.9 * 300 / 512), new THREE.MeshStandardMaterial({ map: backTex, roughness: .85 }));
  back.position.set(.45, -.95, -.072);
  back.rotation.y = Math.PI;
  g.add(back);
  const hub = new THREE.Mesh(new THREE.CircleGeometry(.4, 40), metal);
  hub.position.set(-.55, .3, -.072);
  hub.rotation.y = Math.PI;
  g.add(hub);

  g.userData = {
    trackIndex: i, label: `Track ${pad(i + 1)} · ${t.name} · click`, shutter, tex, backTex,
    phase: 'in', t: 0, reveal: 1, peek: 0, spin: 0, spinVel: 0, drawn: 1
  };
  return g;
}

function drawPlate(ctx, w, h) {
  ctx.fillStyle = '#efe6da';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ff5a1f';
  ctx.fillRect(0, 0, w, 16);
  ctx.fillStyle = '#6b5f55';
  ctx.font = '600 38px "IBM Plex Mono", ui-monospace, monospace';
  ctx.fillText("SENSEHACK '26 · TRACK DISKS", 46, 100);
  ctx.fillStyle = '#24140a';
  ctx.font = '150px "Brigold", "Unbounded", "Arial Black", sans-serif';
  ctx.fillText('07 tracks', 46, 240);
}

export function createDiskBox(scene) {
  const root = new THREE.Group();
  root.visible = false;
  scene.add(root);
  const box = new THREE.Group();
  root.add(box);

  const body = new THREE.MeshStandardMaterial({ color: '#3b3633', roughness: .62, metalness: .12, envMapIntensity: .9 });
  const inner = new THREE.MeshStandardMaterial({ color: '#16120f', roughness: .95, metalness: 0 });
  const stripe = new THREE.MeshStandardMaterial({ color: '#ff5a1f', roughness: .5, metalness: 0, emissive: '#ff5a1f', emissiveIntensity: .25 });
  const part = (w, h, d, x, y, z, mat = body) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    box.add(m);
    return m;
  };
  part(LEN, HEIGHT, WALL, 0, -HEIGHT / 2, DEPTH / 2 - WALL / 2);
  part(LEN, HEIGHT, WALL, 0, -HEIGHT / 2, -DEPTH / 2 + WALL / 2, inner);
  part(WALL, HEIGHT, DEPTH, -LEN / 2 + WALL / 2, -HEIGHT / 2, 0);
  part(WALL, HEIGHT, DEPTH, LEN / 2 - WALL / 2, -HEIGHT / 2, 0);
  part(LEN - WALL, WALL, DEPTH - WALL, 0, -HEIGHT + WALL / 2, 0, inner);
  part(LEN + .04, .09, .06, 0, -.16, DEPTH / 2 + .03, stripe);

  const plateTex = canvasTex(1024, 330, (c, w, h) => drawPlate(c, w, h));
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.7 * 330 / 1024), new THREE.MeshStandardMaterial({ map: plateTex, roughness: .85 }));
  plate.position.set(-.1, -.72, DEPTH / 2 + .003);
  box.add(plate);

  const leds = TRACKS.map((t, i) => {
    const led = new THREE.Mesh(new THREE.CircleGeometry(.035, 16), new THREE.MeshBasicMaterial({ color: '#ffa24a', transparent: true, opacity: .15 }));
    led.position.set(slotX(i), -1.18, DEPTH / 2 + .004);
    box.add(led);
    return led;
  });

  const disks = TRACKS.map((t, i) => {
    const d = makeTrackDisk(t, i);
    d.scale.setScalar(K);
    d.position.set(slotX(i), Y_REST, 0);
    d.rotation.set(0, Math.PI / 2, 0);
    root.add(d);
    return d;
  });

  const tmpV = new THREE.Vector3(), up = new THREE.Vector3(), fwd = new THREE.Vector3();
  const slotQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
  const presentQ = new THREE.Quaternion(), rootQ = new THREE.Quaternion(), extraQ = new THREE.Quaternion(), workQ = new THREE.Quaternion();
  const extraE = new THREE.Euler();
  const yAxis = new THREE.Vector3(0, 1, 0), zAxis = new THREE.Vector3(0, 0, 1);

  let dragVel = 0, dragT = 0, active = -1, override = null, overrideT = 0, hoverIdx = -1, jolt = 0, dragging = false, dragX = 0, dragMoved = 0, clock = 0;

  function presentPose(camera, out) {
    const d = 3.4;
    const visH = 2 * d * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const s = Math.min(.56 * visH / 3.7, .86 * visH * camera.aspect / 3.5);
    camera.getWorldDirection(fwd);
    up.set(0, 1, 0).applyQuaternion(camera.quaternion);
    tmpV.copy(camera.position).addScaledVector(fwd, d).addScaledVector(up, visH * .07);
    root.updateMatrixWorld(true);
    out.pos.copy(root.worldToLocal(tmpV.clone()));
    root.getWorldQuaternion(rootQ);
    out.quat.copy(rootQ).invert().multiply(camera.quaternion);
    out.scale = s / root.scale.x;
    return out;
  }
  const pose = { pos: new THREE.Vector3(), quat: new THREE.Quaternion(), scale: 1 };

  function redrawLabel(d, k) {
    const u = d.userData;
    drawLabel(u.tex.image.getContext('2d'), TRACKS[u.trackIndex], u.trackIndex, k);
    u.tex.needsUpdate = true;
    u.drawn = k;
  }

  function update({ dt, time, want, boxIn, mouse, motion, camera, base }) {
    clock += dt;
    root.visible = boxIn > .002;
    if (!root.visible) return;
    const arrive = boxIn * boxIn * (3 - 2 * boxIn);
    jolt *= Math.exp(-dt * 7);
    root.position.set(base.x, base.y - (1 - arrive) * 1.6, base.z);
    root.scale.setScalar(.2 + .8 * arrive);
    root.rotation.set(0, BOX_YAW + (mouse.x * .1 + Math.sin(time * .3) * .03) * motion, 0);
    box.position.y = -Math.sin(clock * 38) * .05 * jolt;
    box.scale.set(1 + .04 * jolt, 1 - .06 * jolt, 1 + .04 * jolt);

    if (override !== null && (want === override || clock - overrideT > 3.2)) override = null;
    const desired = boxIn > .6 ? (override !== null ? override : want) : -1;

    if (active >= 0) {
      const u = disks[active].userData;
      if (desired !== active && (u.phase === 'out' || u.phase === 'eject')) {
        u.phase = 'return';
        u.t = 0;
        u.from = { pos: disks[active].position.clone(), quat: disks[active].quaternion.clone(), scale: disks[active].scale.x };
        sfx.spin();
      }
    } else if (desired >= 0) {
      active = desired;
      const u = disks[active].userData;
      u.phase = 'eject';
      u.t = 0;
      u.spin = 0;
      u.spinVel = 0;
      u.reveal = 0;
      redrawLabel(disks[active], 0);
      sfx.eject();
    }

    presentPose(camera, pose);

    disks.forEach((d, i) => {
      const u = d.userData;
      const sx = slotX(i);
      u.peek += ((i === hoverIdx && u.phase === 'in' ? 1 : 0) - u.peek) * (1 - Math.exp(-dt * 12));
      const slotY = Y_REST + u.peek * .32 + (i === active ? 0 : Math.sin(clock * 38 + i) * .02 * jolt);

      if (u.phase === 'in') {
        d.position.set(sx, slotY, 0);
        d.quaternion.copy(slotQ);
        d.scale.setScalar(K);
        leds[i].material.opacity += (.15 - leds[i].material.opacity) * .2;
        return;
      }

      leds[i].material.opacity = u.phase === 'eject' ? (Math.sin(clock * 30) > 0 ? 1 : .3) : 1;

      if (u.phase === 'eject') {
        u.t = motion ? Math.min(1, u.t + dt / EJECT_T) : 1;
        const a = easeInOut(sstep(0, .24, u.t));
        const b = easeInOut(sstep(.2, .78, u.t));
        const c = sstep(.62, 1, u.t);
        tmpV.set(sx, Y_REST + (Y_RISE - Y_REST) * a + Math.sin(u.t * 40) * .03 * (1 - a), 0);
        d.position.copy(tmpV).lerp(pose.pos, b);
        workQ.copy(slotQ).slerp(pose.quat, b);
        extraQ.setFromAxisAngle(yAxis, Math.PI * 2 * easeInOut(sstep(.24, .9, u.t)));
        d.quaternion.copy(workQ).multiply(extraQ);
        const sc = K + (pose.scale - K) * b;
        d.scale.setScalar(c > 0 ? K + (pose.scale - K) * outBack(Math.min(1, b)) : sc);
        u.shutter.position.x = .15 - .62 * sstep(.75, 1, u.t);
        if (u.t > .6) u.reveal = Math.min(1, u.reveal + dt / 1.7);
        if (u.t >= 1) { u.phase = 'out'; u.label = 'Drag to spin · click to twirl'; sfx.click(); }
      } else if (u.phase === 'out') {
        if (motion) u.reveal = Math.min(1, u.reveal + dt / 1.7);
        else u.reveal = 1;
        if (dragging) {
          u.spinVel = 0;
        } else {
          const target = Math.round(u.spin / (Math.PI * 2)) * Math.PI * 2;
          u.spinVel += (target - u.spin) * 7 * dt;
          u.spinVel *= Math.exp(-dt * 3);
          u.spin += u.spinVel * dt;
        }
        d.position.copy(pose.pos);
        d.position.y += Math.sin(time * 1.3) * .05 * motion / root.scale.x;
        extraE.set(-mouse.y * .16 * motion + Math.sin(time * .8) * .025 * motion, mouse.x * .3 * motion + u.spin, Math.sin(time * .6) * .02 * motion);
        extraQ.setFromEuler(extraE);
        d.quaternion.copy(pose.quat).multiply(extraQ);
        d.scale.setScalar(pose.scale);
        u.shutter.position.x = .15 - .62;
      } else if (u.phase === 'return') {
        u.t = motion ? Math.min(1, u.t + dt / RETURN_T) : 1;
        const r = easeIn(Math.min(1, u.t / .72));
        const drop = easeInOut(sstep(.62, 1, u.t));
        tmpV.set(sx, Y_RISE, 0);
        d.position.copy(u.from.pos).lerp(tmpV, r);
        d.position.y += (Y_REST - Y_RISE) * drop;
        workQ.copy(u.from.quat).slerp(slotQ, easeInOut(Math.min(1, u.t / .8)));
        extraQ.setFromAxisAngle(zAxis, Math.sin(Math.min(1, u.t / .8) * Math.PI) * .9);
        d.quaternion.copy(workQ).multiply(extraQ);
        d.scale.setScalar(u.from.scale + (K - u.from.scale) * r);
        u.shutter.position.x = .15 - .62 * (1 - r);
        if (u.t >= 1) {
          u.phase = 'in';
          u.label = `Track ${pad(i + 1)} · ${TRACKS[i].name} · click`;
          u.reveal = 1;
          redrawLabel(d, 1);
          active = -1;
          jolt = 1;
          sfx.insert();
        }
      }

      if (u.phase !== 'in' && u.reveal < 1 && Math.abs(u.reveal - u.drawn) > .004) redrawLabel(d, u.reveal);
      else if (u.phase === 'out' && u.drawn < 1 && u.reveal >= 1) redrawLabel(d, 1);
    });
  }

  return {
    group: root,
    hoverables: disks,
    update,
    isOut: (i) => i === active && disks[i].userData.phase === 'out',
    hover(i) { hoverIdx = i; },
    pick(i) {
      if (i === active) return false;
      override = i;
      overrideT = clock;
      sfx.click();
      return true;
    },
    grab(x) { dragging = true; dragX = x; dragMoved = 0; dragVel = 0; dragT = performance.now(); },
    drag(x) {
      if (!dragging || active < 0) return;
      const dx = x - dragX;
      dragX = x;
      dragMoved += Math.abs(dx);
      const now = performance.now();
      const dts = Math.max(.008, (now - dragT) / 1000);
      dragT = now;
      dragVel = dragVel * .6 + (dx * .014 / dts) * .4;
      disks[active].userData.spin += dx * .014;
    },
    release() {
      if (!dragging) return;
      dragging = false;
      if (active < 0) return;
      const u = disks[active].userData;
      if (dragMoved < 5) {
        u.spinVel += 15;
        sfx.spin();
      } else if (performance.now() - dragT < 120) {
        u.spinVel = Math.max(-16, Math.min(16, dragVel));
        sfx.spin();
      }
    },
    redraw() {
      drawPlate(plateTex.image.getContext('2d'), plateTex.image.width, plateTex.image.height);
      plateTex.needsUpdate = true;
      disks.forEach(d => {
        const u = d.userData;
        redrawLabel(d, u.phase === 'in' ? 1 : u.reveal);
        drawBack(u.backTex.image.getContext('2d'), TRACKS[u.trackIndex], u.trackIndex);
        u.backTex.needsUpdate = true;
      });
    }
  };
}
