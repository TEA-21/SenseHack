import './styles.css';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import { V, sstep, bump, monotone, fontsReady } from './lib/utils.js';
import { P_CUT, G, Q_DISKS, DISK_N, warp as timelineAt, diskScroll, diskRaw } from './lib/timeline.js';
import { sound, sfx } from './ui/sound.js';
import { createDirector } from './ui/director.js';
import { createShell, REDUCE } from './ui/shell.js';
import { startCountdown } from './ui/countdown.js';
import { startBoot } from './ui/boot.js';
import { createCursor } from './ui/cursor.js';
import { createLayers } from './ui/layers.js';
import { createTV, SCREEN } from './scene/tv.js';
import { createWorld, pathPoint, WORLD_Z0 } from './scene/world.js';
import { BOX_FIT } from './scene/diskbox.js';
import { createPost } from './scene/post.js';
import { redrawLabels } from './scene/props.js';
import { initSite } from './ui/site.js';

const shell = createShell();
startCountdown();
initSite();
const boot = startBoot();
const soundBtns = [...document.querySelectorAll('.sound-btn')];
soundBtns.forEach((btn) => btn.addEventListener('click', (e) => { e.stopPropagation(); if (!sound.on && sound.enabled) sound.start(); else sound.toggle(); }));
sound.onChange((on) => soundBtns.forEach((btn) => { btn.textContent = on ? 'Sound on' : 'Sound off'; btn.setAttribute('aria-pressed', String(on)); }));
const director = createDirector(shell);

const canvas = document.getElementById('gl');
let renderer = null;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch (e) {
  boot.ready();
}

if (renderer) run(renderer);

function run(renderer) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  const envTex = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const world = createWorld(envTex);
  const tv = createTV(envTex);
  const post = createPost(renderer, tv.scene, tv.camera);
  const cursor = createCursor();
  const layers = createLayers(shell.railButtons, shell);

  const canvasFonts = ['700 56px "Unbounded"', '900 92px "Unbounded"', '500 36px "IBM Plex Mono"', '600 25px "IBM Plex Mono"', '500 36px "Inter"'];
  const redrawAll = () => { redrawLabels(); world.diskBox.redraw(); tv.refreshText(); };
  Promise.all(canvasFonts.map((f) => (document.fonts ? document.fonts.load(f).catch(() => {}) : null))).then(redrawAll);
  if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', redrawAll);
  fontsReady.then(() => {
    redrawLabels();
    world.diskBox.redraw();
    tv.refreshText();
  });

  let depthAt = () => WORLD_Z0, boxDist = 6;
  const boxTarget = world.diskPos.clone().add(V(0, BOX_FIT.midY, 0));
  const boxAim = (q) => sstep(.600, .628, q) * (1 - sstep(.655, .685, q));
  function buildDepth() {
    const zBox = world.diskPos.z + boxDist;
    depthAt = monotone([[0, WORLD_Z0], [.10, 3.5], [.40, -58], [.47, -63], [.55, -66], [.5525, -66.6], [.5755, zBox + 12],
      [.60, zBox + 6], [.63, zBox], [Q_DISKS, zBox - .5], [.70, -97], [.745, -106], [.80, -128], [1, -156]]);
  }

  let W = 0, H = 0, portrait = false, baseFov = 50;
  function resize() {
    W = innerWidth;
    H = innerHeight;
    portrait = W / H < .8;
    const dpr = Math.min(devicePixelRatio || 1, W < 760 ? 1.5 : 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H, false);
    post.setSize(W, H, dpr);
    world.camera.aspect = W / H;
    tv.camera.aspect = W / H;
    baseFov = portrait ? 64 : 50;
    tv.camera.fov = portrait ? 52 : 40;
    tv.camera.updateProjectionMatrix();

    const tf = Math.tan(THREE.MathUtils.degToRad(baseFov / 2));
    const byH = BOX_FIT.h / (2 * tf * (portrait ? .4 : .5));
    const byW = BOX_FIT.w / (2 * tf * (W / H) * (portrait ? .9 : .5));
    boxDist = Math.min(14, Math.max(byH, byW));
    buildDepth();
  }
  addEventListener('resize', resize);
  resize();

  function roomPose(r) {
    const cam = tv.camera;
    const tf = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const fitH = 6.0 / tf, fitW = (portrait ? 5.0 : 5.6) / (tf * cam.aspect);
    const dist = Math.max(fitH, fitW) * (portrait ? 1.0 : 1.0);
    const start = V(-.2, 1.7, 3 + dist), startLook = V(-.2, 1.0, 0);
    const endDist = Math.max(2.5 / tf, 3.3 / (tf * cam.aspect)) * .9;
    const end = V(SCREEN.x, SCREEN.y, SCREEN.z + .3 + endDist), endLook = V(SCREEN.x, SCREEN.y, SCREEN.z);
    const e = r * r * r * (r * (6 * r - 15) + 10);
    return { pos: start.lerp(end, e), look: startLook.lerp(endLook, e), e };
  }

  const mouse = { x: 0, y: 0, tx: 0, ty: 0, ndc: new THREE.Vector2(9, 9), moved: false };
  const ray = new THREE.Raycaster();
  let mode = 'room';
  let hovered = null;

  const rootOf = (o, list) => { while (o && !list.includes(o)) o = o.parent; return o; };
  const overUi = (el) => !!(el && el.closest && el.closest('a,button,input,textarea,summary,label,.menu,.top,.gal-card,.trk2d,.site'));
  function pick(target) {
    if (document.documentElement.classList.contains('intro-finished')) return null;
    if (target && target !== canvas && target.closest && !target.closest('.track')) return null;
    if (overUi(target)) return null;
    if (mode === 'room') {
      ray.setFromCamera(mouse.ndc, tv.camera);
      const hit = ray.intersectObjects(tv.hoverables, true);
      return hit.length ? rootOf(hit[0].object, tv.hoverables) : null;
    }
    if (!world.diskBox.group.visible) return null;
    ray.setFromCamera(mouse.ndc, world.camera);
    const hit = ray.intersectObjects(world.diskBox.hoverables, true);
    return hit.length ? rootOf(hit[0].object, world.diskBox.hoverables) : null;
  }
  let lastTarget = null;

  addEventListener('pointermove', (e) => {
    mouse.tx = e.clientX / innerWidth * 2 - 1;
    mouse.ty = e.clientY / innerHeight * 2 - 1;
    mouse.ndc.set(mouse.tx, -mouse.ty);
    mouse.moved = true;
    lastTarget = e.target;
    world.diskBox.drag(e.clientX);
    const d = world.disk;
    if (d.dragging) {
      const dx = e.clientX - d.lastX;
      d.lastX = e.clientX;
      d.vel = dx * .012;
      d.rot += dx * .012;
    }
  }, { passive: true });

  addEventListener('pointerdown', (e) => {
    mouse.ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight * 2 - 1));
    const hit = pick(e.target);
    if (!hit) return;
    const u = hit.userData;
    if (u.trackIndex !== undefined) {
      if (world.diskBox.isOut(u.trackIndex)) {
        world.diskBox.grab(e.clientX);
        cursor.grab(true);
      } else if (world.diskBox.pick(u.trackIndex)) {
        director.manual();
        shell.lenis ? shell.lenis.scrollTo(shell.progressToY(diskRaw(u.trackIndex)), { duration: 1.1 }) : shell.scrollToY(shell.progressToY(diskRaw(u.trackIndex)));
      }
      return;
    }
    if (u.action === 'channel' || u.action === 'volume' || u.action === 'power') director.halt();
    if (u.action === 'channel') {
      sfx.static(.32);
      sfx.click();
      u.target += .8 * u.dir;
      tv.state.power = 1;
      tv.setChannel(u.dir);
    } else if (u.action === 'volume') {
      sfx.click();
      const level = tv.stepVolume(1);
      sound.setVolume(level);
      u.target = tv.volume * .9;
    } else if (u.action === 'power') {
      sfx.click();
      tv.state.power = tv.state.power > .5 ? 0 : 1;
      shell.say(tv.state.power ? 'Tube warming up.' : 'Off. Scroll down to switch it back on.');
    }
  });

  addEventListener('pointerup', (e) => {
    world.diskBox.release();
    cursor.grab(false);
    const d = world.disk;
    if (!d.dragging) return;
    d.dragging = false;
    cursor.grab(false);
    if (Math.abs(e.clientX - d.downX) < 5 && performance.now() - d.downT < 350) {
      d.open = d.open ? 0 : 1;
      d.vel += .35;
      shell.say(d.open ? 'Shutter open · 1,474,560 bytes of ideas.' : 'Shutter closed.');
    }
  });

  let booted = REDUCE || boot.isDone();
  addEventListener('boot:done', () => { booted = true; });
  if (REDUCE) tv.state.powerT = 1;

  const inWorldNow = (md) => (md === 'world' ? 1 : 0);
  const clock = new THREE.Clock();
  const tmp = new THREE.Vector3();
  const look = new THREE.Vector3();
  let time = 0, frameN = 0, prevZ = null, warp = 0, first = true, lastQ = 0, wasOn = 0;

  function frame() {
    const dt = Math.min(clock.getDelta(), .05);
    const motion = REDUCE ? 0 : 1;
    if (!REDUCE) time += dt;
    frameN++;

    const rect = shell.track.getBoundingClientRect();
    document.documentElement.classList.toggle('intro-finished', rect.bottom < innerHeight * .2);
    const max = rect.height - innerHeight;
    const pr = max > 0 ? Math.min(1, Math.max(0, -rect.top / max)) : 0;
    const { p, g } = timelineAt(pr);
    const q = Math.max(0, (p - P_CUT) / (1 - P_CUT));
    const ease = 1 - Math.exp(-dt * 3);
    mouse.x += (mouse.tx - mouse.x) * ease;
    mouse.y += (mouse.ty - mouse.y) * ease;

    const nextMode = p < P_CUT ? 'room' : 'world';
    if (nextMode !== mode) {
      mode = nextMode;
      hovered = null;
      cursor.cold();
      tv.state.burst = Math.max(tv.state.burst, .3);
      if (mode === 'world') sfx.whoosh();
      sfx.static(.45, .2);
    }
    const scene = document.documentElement.classList.contains('intro-finished') ? 'site'
      : mode === 'room' ? 'room' : (q > .632 && q < .76) ? 'glitch' : 'world';
    sound.setScene(scene);
    if (q > .64 && lastQ <= .64) sfx.glitch(1.6);
    lastQ = q;

    if (shell.lenis) {
      const gs = G.gallery;
      const slowNum = inWorldNow(mode) * bump(.44, .47, .56, .60, q);
      const slowGal = inWorldNow(mode) * bump(gs[0], gs[0] + .03, gs[1] - .03, gs[1], g);
      const calm = (mode === 'world' && q > .69) || document.documentElement.classList.contains('intro-finished') ? 1 : 0;
      const target = Math.max(.18, 1 - .72 * slowNum - .68 * slowGal - .5 * calm);
      const o = shell.lenis.options;
      o.wheelMultiplier += (target - o.wheelMultiplier) * Math.min(1, dt * 5);
    }
    world.update({ time, dt, q, motion });
    tv.state.burst = Math.max(0, tv.state.burst - dt);

    let z = WORLD_Z0, speed = 0;

    if (mode === 'room') {
      const r = p / P_CUT;
      const cam = tv.camera;
      const { pos, look: target, e } = roomPose(r);
      const amp = (1 - e) * .9;
      cam.position.copy(pos).add(tmp.set(mouse.x * amp, -mouse.y * amp * .5, 0));
      cam.lookAt(target.add(tmp.set(mouse.x * amp * .15, 0, 0)));
      cam.setViewOffset(W, H, 0, H * (portrait ? .1 : .07) * (1 - e), W, H);
      tv.tv.rotation.y = mouse.x * .07 * (1 - e) + Math.sin(time * .3) * .015 * (1 - e);
      post.show(tv.scene, cam);

      const s = tv.state;
      if (r > .05) s.power = 1;
      const want = booted ? s.power : 0;
      s.powerT += (want - s.powerT) * (1 - Math.exp(-dt * (want ? 5 : 6)));
      if (want && !wasOn) sfx.powerOn();
      wasOn = want;
      const u = tv.screenMat.uniforms;
      u.uPower.value = s.powerT;
      u.uMix.value = 1 - sstep(.18, .62, r);
      u.uStatic.value = .015 + s.burst * 2.2 + bump(.15, .25, .35, .5, r) * .35 + sstep(.95, 1, r) * .7;
      u.uTime.value = time;
      tv.screenLight.intensity = (30 + Math.sin(time * 9) * 3 + Math.random() * 4) * s.powerT;
      tv.led.material.emissiveIntensity = s.power ? 2 : .2;
      tv.pool.material.opacity = .32 * s.powerT;
      tv.halo.material.opacity = .16 * (.3 + .7 * s.powerT);
      for (const k of tv.knobs) {
        k.userData.rot += (k.userData.target - k.userData.rot) * (1 - Math.exp(-dt * 10));
        k.rotation.z = -k.userData.rot;
      }
      tv.dust.rotation.y += dt * .01 * motion;
      tv.setActive(true);
      tv.tick(dt);

      world.screenCamera.position.set(mouse.x * .5, -mouse.y * .3, WORLD_Z0);
      world.screenCamera.lookAt(0, 0, WORLD_Z0 - 10);
      world.camLight.position.copy(world.screenCamera.position);
      world.diskBox.group.visible = false;
      if (u.uMix.value < .999 || frameN % 6 === 0) {
        world.glow.visible = true;
        renderer.setRenderTarget(tv.worldTarget);
        renderer.render(world.scene, world.screenCamera);
        renderer.setRenderTarget(null);
      }

      post.retro.uCRT.value = 0;
      post.retro.uGlitch.value = sstep(.9, 1, r) * .5 + s.burst * .8;
      post.retro.uSmear.value = 0;
      post.retro.uAb.value = .006 + sstep(.7, 1, r) * .01;
      prevZ = null;
      warp = 0;
    } else {
      tv.setActive(false);
      const cam = world.camera;
      z = depthAt(q);
      speed = prevZ === null ? 0 : Math.abs(z - prevZ) / Math.max(dt, 1e-3);
      prevZ = z;
      warp += (Math.min(1, speed / 45) - warp) * (1 - Math.exp(-dt * 4));

      const pos = pathPoint(z);
      const aim = boxAim(q);
      pos.x += (boxTarget.x + .12 - pos.x) * aim;
      pos.y += (boxTarget.y + .85 - pos.y) * aim;
      const inside = sstep(2, -8, z), outside = sstep(-121, -132, z);
      const amp = (1 - inside) * .5 + inside * .22 + outside * .6;
      cam.position.copy(pos).add(tmp.set(mouse.x * amp, -mouse.y * amp * .6, 0));
      look.copy(pathPoint(z - 10));
      look.lerp(boxTarget, aim);
      look.add(tmp.set(mouse.x * amp * .3, -mouse.y * amp * .2 + outside * Math.sin(time * .2) * 1.2, 0));
      cam.lookAt(look);
      const ahead = pathPoint(z - 4);
      cam.rotateZ(-mouse.x * .04 - inside * (1 - outside) * (ahead.x - pos.x) * .9 + warp * Math.sin(time * 1.3) * .03);
      world.camLight.position.copy(cam.position);

      const [, n1] = G.numOut, [t1a, t1b] = G.travel1, [ga, gb] = G.gallery, [, t2b] = G.travel2;
      const shiftNum = sstep(.42, .47, q) * (1 - sstep(0, n1 + .045, g));
      const shiftGal = sstep(t1b - .05, t1b + .02, g) * (1 - sstep(gb - .03, gb + .03, g));
      const shiftBox = sstep(gb + .045, t2b, g) * (1 - sstep(.645, .675, q))
        * (1 - sstep(G.disks[1] - .04, G.disks[1], g)) * 0;
      const shiftUp = shiftNum + shiftGal;
      cam.fov = baseFov + warp * 16;
      cam.setViewOffset(W, H,
        portrait ? 0 : W * (.2 * shiftGal - .2 * shiftNum - .22 * shiftBox),
        portrait ? H * (.17 * shiftUp - .08 * shiftBox) : 0, W, H);
      post.show(world.scene, cam);
      world.glow.visible = z > -123;
      world.glow.scale.setScalar(46 + sstep(-90, -122, z) * 40);

      const glitch = bump(.635, .665, .71, .745, q) + (REDUCE ? 0 : warp * .08) + tv.state.burst * 1.2;
      world.tunnel.uniforms.uAlt.value = bump(.63, .66, .72, .76, q);
      world.tunnel.uniforms.uWarp.value = warp;
      post.retro.uGlitch.value = REDUCE ? glitch * .25 : glitch;
      post.retro.uAb.value = .006 + warp * .02;
      post.retro.uCRT.value = 1 - sstep(0, .08, q);

      world.updateDisk({ time, dt, q, mouse, motion });

      const ds = diskScroll(g);
      const wantDisk = ds < -.02 || ds >= DISK_N - .05 ? -1 : Math.min(DISK_N - 1, Math.max(0, Math.floor(ds)));
      const boxIn = sstep(G.travel2[0] + .02, G.travel2[1] - .005, g)
        * (1 - sstep(.655, .675, q))
        * (1 - sstep(G.disks[1] - .04, G.disks[1], g));
      world.diskBox.update({ dt, time, want: wantDisk, boxIn, mouse, motion, camera: cam, base: world.diskPos });

      post.retro.uSmear.value = sstep(.765, .955, q);
    }

    if (cursor.fine && frameN % 2 === 0 && mouse.moved) {
      const h = pick(lastTarget);
      if (h !== hovered) {
        hovered = h;
        world.diskBox.hover(h && h.userData.trackIndex !== undefined ? h.userData.trackIndex : -1);
        if (h && h.userData.trackIndex !== undefined && !world.diskBox.isOut(h.userData.trackIndex)) sfx.tick();
        if (h) cursor.hot(h.userData.label);
        else cursor.cold();
      }
    }
    cursor.update(dt);

    layers({ p, pr, q, g, inWorld: mode === 'world', glitch: post.retro.uGlitch.value, z, speed });

    if (rect.bottom > -50) {
      post.retro.uTime.value = time;
      post.render();
    }
    if (first) {
      first = false;
      document.documentElement.classList.add('gl-ready');
      boot.ready();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
