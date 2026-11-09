import * as THREE from 'three';
import { canvasTex, sstep } from '../lib/utils.js';
import { makeFloppy } from './props.js';
import { TRACKS } from '../data.js';

// A box of seven floppy disks. Disks stand in the box with their faces across the row;
// the active one rises straight out, turns to face the camera and hangs there. All
// poses are driven by the scroll amounts handed to update(); nothing here runs on a timer.

const N = TRACKS.length;
const K = .52;                       // floppy scale while stored (a floppy is 3.5 x 3.7 units at scale 1)
const K_OUT = K * 1.12;              // a little larger once presented
const PITCH = .30;                   // distance between neighbouring disks
const LEN = (N - 1) * PITCH + .6;    // box length (x)
const DEPTH = 2.1;                   // box depth (z); a disk is 1.82 wide
const HEIGHT = 1.4;                  // box height (the box hangs below y = 0)
const WALL = .1;
const Y_REST = -.40;                 // disk centre while stored: the top .56 sticks out of the box
const Y_UP = 1.62;                   // disk centre while presented: bottom clears its neighbours
const Z_OUT = .45;                   // presented disks come slightly forward
export const BOX_YAW = .5;           // the box is turned so the camera sees its front and left side

// Everything that must stay inside the screen, in box units (used to size the camera distance):
//   bottom of the box  y = -1.4,   top of a presented disk  y = Y_UP + 1.85 * 1.12 * .52 ~ 2.7
export const BOX_FIT = { w: 3.4, h: 4.3, midY: .65 };

const slotX = (i) => (i - (N - 1) / 2) * PITCH;

function drawPlate(ctx, w, h) {
  ctx.fillStyle = '#efe6da';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ff5a1f';
  ctx.fillRect(0, 0, w, 16);
  ctx.fillStyle = '#6b5f55';
  ctx.font = '600 38px "IBM Plex Mono", ui-monospace, monospace';
  ctx.fillText("SENSE HACK '26 · TRACK DISKS", 46, 100);
  ctx.fillStyle = '#24140a';
  ctx.font = 'italic 150px "Instrument Serif", Georgia, serif';
  ctx.fillText('07 tracks', 46, 240);
}

export function createDiskBox(scene) {
  const root = new THREE.Group();
  root.visible = false;
  scene.add(root);

  const body = new THREE.MeshStandardMaterial({ color: '#3b3633', roughness: .62, metalness: .12, envMapIntensity: .9 });
  const inner = new THREE.MeshStandardMaterial({ color: '#16120f', roughness: .95, metalness: 0 });
  const stripe = new THREE.MeshStandardMaterial({ color: '#ff5a1f', roughness: .5, metalness: 0, emissive: '#ff5a1f', emissiveIntensity: .25 });
  const part = (w, h, d, x, y, z, mat = body) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    root.add(m);
    return m;
  };
  part(LEN, HEIGHT, WALL, 0, -HEIGHT / 2, DEPTH / 2 - WALL / 2);           // front
  part(LEN, HEIGHT, WALL, 0, -HEIGHT / 2, -DEPTH / 2 + WALL / 2, inner);   // back
  part(WALL, HEIGHT, DEPTH, -LEN / 2 + WALL / 2, -HEIGHT / 2, 0);          // left
  part(WALL, HEIGHT, DEPTH, LEN / 2 - WALL / 2, -HEIGHT / 2, 0);           // right
  part(LEN - WALL, WALL, DEPTH - WALL, 0, -HEIGHT + WALL / 2, 0, inner);   // floor
  part(LEN + .04, .09, .06, 0, -.16, DEPTH / 2 + .03, stripe);             // orange stripe on the front

  const plateTex = canvasTex(1024, 330, (c, w, h) => drawPlate(c, w, h));
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.7 * 330 / 1024), new THREE.MeshStandardMaterial({ map: plateTex, roughness: .85 }));
  plate.position.set(-.1, -.7, DEPTH / 2 + .003);
  root.add(plate);

  const disks = TRACKS.map((t, i) => {
    const f = makeFloppy(scene, t.color, t.name.toLowerCase(), t.stripe, `track ${t.n} / ${String(N).padStart(2, '0')}`);
    root.add(f);
    f.userData.label = '';
    f.rotation.set(0, Math.PI / 2, 0);
    f.scale.setScalar(K);
    f.position.set(slotX(i), Y_REST, 0);
    return f;
  });

  // `amts[i]` = 0 stored .. 1 presented; `boxIn` = 0 away .. 1 arrived.
  function update({ time, amts, boxIn, mouse, motion, base }) {
    root.visible = boxIn > .002;
    if (!root.visible) return;
    const arrive = boxIn * boxIn * (3 - 2 * boxIn);
    root.position.set(base.x, base.y - (1 - arrive) * 1.6, base.z);
    root.scale.setScalar(.2 + .8 * arrive);
    root.rotation.set(0, BOX_YAW + (mouse.x * .12 + Math.sin(time * .3) * .03) * motion, 0);

    disks.forEach((f, i) => {
      const a = amts[i];
      const up = sstep(0, .42, a);          // slide straight up out of the slot
      const turn = sstep(.42, .95, a);      // then turn to face the camera
      const bob = Math.sin(time * 1.2 + i) * .03 * turn * motion;
      f.position.set(slotX(i) * (1 - turn), Y_REST + (Y_UP - Y_REST) * up + bob, Z_OUT * turn);
      f.scale.setScalar(K + (K_OUT - K) * turn);
      f.rotation.set(-.2 * turn, (Math.PI / 2) * (1 - turn) + (-BOX_YAW + .1 + mouse.x * .12 * motion) * turn, Math.sin(time * .7 + i) * .025 * turn * motion);
    });
  }

  return {
    group: root,
    update,
    redraw() { drawPlate(plateTex.image.getContext('2d'), plateTex.image.width, plateTex.image.height); plateTex.needsUpdate = true; }
  };
}
