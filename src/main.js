import './styles.css';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import { V, sstep, bump, monotone, fontsReady } from './lib/utils.js';
import { P_CUT, G, Q_DISKS, DISK_N, warp as timelineAt, diskScroll, diskAmt } from './lib/timeline.js';
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

const shell = createShell();
startCountdown();
const boot = startBoot();

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

  fontsReady.then(() => {
    redrawLabels();
    world.diskBox.redraw();
    tv.refreshText();
  });

  // Camera depth along the tunnel for each q. The camera never stops: it drifts on through the
  // gaps between chapters and ends up `boxDist` in front of the floppy box.
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

    // How far back the camera must sit so the whole box AND a fully raised disk fit in the
    // part of the screen that is not covered by the text (right ~half; below the nav bar).
    const tf = Math.tan(THREE.MathUtils.degToRad(baseFov / 2));
    const byH = BOX_FIT.h / (2 * tf * (portrait ? .42 : .68));
    const byW = BOX_FIT.w / (2 * tf * (W / H) * (portrait ? .92 : .52));
    boxDist = Math.min(14, Math.max(byH, byW));
    buildDepth();
  }
  addEventListener('resize', resize);
  resize();

  function roomPose(r) {
    const cam = tv.camera;
    const tf = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const fitH = 6.4 / tf, fitW = (portrait ? 5.5 : 6.8) / (tf * cam.aspect);
    const dist = Math.max(fitH, fitW) * (portrait ? 1.0 : 1.1);
    const start = V(-.2, 1.4, 3 + dist), startLook = V(-.2, .3, 0);
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
  function pick() {
    if (mode === 'room') {
      ray.setFromCamera(mouse.ndc, tv.camera);
      const hit = ray.intersectObjects(tv.hoverables, true);
      return hit.length ? rootOf(hit[0].object, tv.hoverables) : null;
    }
    ray.setFromCamera(mouse.ndc, world.camera);
    const visible = world.hoverables.filter(o => o.visible);
    const hit = ray.intersectObjects(visible, true);
    return hit.length ? rootOf(hit[0].object, visible) : null;
  }

  addEventListener('pointermove', (e) => {
    mouse.tx = e.clientX / innerWidth * 2 - 1;
    mouse.ty = e.clientY / innerHeight * 2 - 1;
    mouse.ndc.set(mouse.tx, -mouse.ty);
    mouse.moved = true;
    const d = world.disk;
    if (d.dragging) {
      const dx = e.clientX - d.lastX;
      d.lastX = e.clientX;
      d.vel = dx * .012;
      d.rot += dx * .012;
    }
  }, { passive: true });

  canvas.addEventListener('pointerdown', (e) => {
    mouse.ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight * 2 - 1));
    const hit = pick();
    if (!hit) return;
    const u = hit.userData;
    if (u.action === 'channel') {
      u.target += .8 * u.dir;
      tv.state.power = 1;
      tv.setChannel(u.dir);
    } else if (u.action === 'power') {
      tv.state.power = tv.state.power > .5 ? 0 : 1;
      shell.say(tv.state.power ? 'Tube warming up.' : 'Off. Scroll down to switch it back on.');
    } else if (u.action === 'screen') {
      shell.say('Scroll to go inside the set.');
    } else if (u.isHero) {
      Object.assign(world.disk, { dragging: true, lastX: e.clientX, downX: e.clientX, downT: performance.now() });
      cursor.grab(true);
    } else {
      u.kick = 9;
      if (u.fall) u.fall.speed += 3;
    }
  });

  addEventListener('pointerup', (e) => {
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

  const clock = new THREE.Clock();
  const tmp = new THREE.Vector3();
  const look = new THREE.Vector3();
  let time = 0, frameN = 0, prevZ = null, warp = 0, first = true;

  function frame() {
    const dt = Math.min(clock.getDelta(), .05);
    const motion = REDUCE ? 0 : 1;
    if (!REDUCE) time += dt;
    frameN++;

    const rect = shell.track.getBoundingClientRect();
    document.documentElement.classList.toggle('intro-finished', rect.bottom < innerHeight * .2);
    const max = rect.height - innerHeight;
    const pr = max > 0 ? Math.min(1, Math.max(0, -rect.top / max)) : 0;
    // pr = real scroll position; p = position on the original intro timeline;
    // g = progress through the gallery hold that sits after "By the numbers".
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
      s.powerT += (want - s.powerT) * (1 - Math.exp(-dt * (want ? 2.4 : 6)));
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

      world.screenCamera.position.set(mouse.x * .5, -mouse.y * .3, WORLD_Z0);
      world.screenCamera.lookAt(0, 0, WORLD_Z0 - 10);
      world.camLight.position.copy(world.screenCamera.position);
      world.diskBox.group.visible = false;   // the box only exists once the camera reaches it
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
      const cam = world.camera;
      z = depthAt(q);
      speed = prevZ === null ? 0 : Math.abs(z - prevZ) / Math.max(dt, 1e-3);
      prevZ = z;
      warp += (Math.min(1, speed / 45) - warp) * (1 - Math.exp(-dt * 4));

      const pos = pathPoint(z);
      const aim = boxAim(q);
      // Frame the box: slightly above it, looking down a touch.
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

      // Camera pan (scene slides sideways so the text / photos / box get their own side):
      //   numbers : tunnel to the right (text on the left), then back to centre while we drift on
      //   gallery : tunnel swings left (photos on the right) and back again
      //   box     : tunnel to the right again (copy on the left, box on the right)
      const [, n1] = G.numOut, [t1a, t1b] = G.travel1, [ga, gb] = G.gallery, [, t2b] = G.travel2;
      const shiftNum = sstep(.42, .47, q) * (1 - sstep(0, n1 + .045, g));
      const shiftGal = sstep(t1b - .05, t1b + .02, g) * (1 - sstep(gb - .03, gb + .03, g));
      const shiftBox = sstep(gb + .045, t2b, g) * (1 - sstep(.645, .675, q))
        * (1 - sstep(G.disks[1] - .04, G.disks[1], g));
      const shiftUp = shiftNum + shiftGal;   // portrait: numbers + gallery panels sit at the bottom
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

      // Floppy box: it arrives while we drift in, each scroll step lifts one disk out, and it
      // is gone again by the time SIGNAL LOST breaks the picture up.
      const ds = diskScroll(g);
      const amts = Array.from({ length: DISK_N }, (_, i) => diskAmt(i, ds));
      const boxIn = sstep(G.travel2[0] + .02, G.travel2[1] - .005, g)
        * (1 - sstep(.655, .675, q))
        * (1 - sstep(G.disks[1] - .04, G.disks[1], g));
      world.diskBox.update({ time, amts, boxIn, mouse, motion, base: world.diskPos });

      // Signal lost -> static site: the picture tears into streaks and blows out to cream.
      post.retro.uSmear.value = sstep(.765, .955, q);
    }

    if (cursor.fine && frameN % 2 === 0 && mouse.moved) {
      const h = pick();
      if (h !== hovered) {
        hovered = h;
        if (h) cursor.hot(h.userData.label);
        else cursor.cold();
      }
    }
    cursor.update(dt);

    layers({ p, pr, q, g, inWorld: mode === 'world', glitch: post.retro.uGlitch.value, z, speed });

    post.retro.uTime.value = time;
    post.render();
    if (first) {
      first = false;
      document.documentElement.classList.add('gl-ready');
      boot.ready();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
