const PREF = 'sh-sound';
const BPM = 88;
const STEP = 60 / BPM / 4;
const CHORDS = [
  { root: 110.0, notes: [220.0, 261.63, 329.63] },
  { root: 87.31, notes: [174.61, 220.0, 261.63] },
  { root: 130.81, notes: [196.0, 261.63, 329.63] },
  { root: 98.0, notes: [196.0, 246.94, 293.66] }
];
const ARP = [0, 1, 2, 3, 2, 1, 0, 2, 1, 3, 2, 0, 1, 2, 3, 1];

let enabled = true;
try { enabled = localStorage.getItem(PREF) !== 'off'; } catch (e) { enabled = true; }

let ctx = null, master = null, music = null, sfxBus = null, padFilter = null, arpGain = null, humGain = null, noiseBuf = null;
let nextTime = 0, step = 0, timer = null, scene = 'room', level = 1;
const listeners = new Set();
const notify = () => listeners.forEach(fn => fn(sound.on));

function makeNoise() {
  const len = ctx.sampleRate * 2;
  const b = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return b;
}

function env(g, t, a, peak, hold, r) {
  g.gain.cancelScheduledValues(t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + a);
  g.gain.setValueAtTime(peak, t + a + hold);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + hold + r);
}

function padVoice(freq, t, dur) {
  const g = ctx.createGain();
  g.connect(padFilter);
  env(g, t, .9, .045, Math.max(.1, dur - 1.2), 1.4);
  for (const det of [-7, 6]) {
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = freq;
    o.detune.value = det;
    o.connect(g);
    o.start(t);
    o.stop(t + dur + 1.6);
  }
}

function bass(freq, t) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.value = freq / 2;
  o.connect(g);
  g.connect(music);
  env(g, t, .02, .22, .25, .5);
  o.start(t);
  o.stop(t + .9);
}

function pluck(freq, t) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'square';
  o.frequency.value = freq;
  o.connect(g);
  g.connect(arpGain);
  env(g, t, .005, .05, .02, .16);
  o.start(t);
  o.stop(t + .25);
}

function schedule() {
  while (nextTime < ctx.currentTime + .25) {
    const bar = Math.floor(step / 16) % CHORDS.length;
    const s = step % 16;
    const chord = CHORDS[bar];
    if (s === 0) chord.notes.forEach(f => padVoice(f, nextTime, STEP * 16));
    if (s === 0 || s === 8) bass(chord.root, nextTime);
    if (s === 10) bass(chord.root * 1.5, nextTime);
    const n = ARP[s];
    const f = n === 3 ? chord.notes[0] * 2 : chord.notes[n] * 2;
    pluck(f, nextTime);
    nextTime += STEP;
    step++;
  }
}

function build() {
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  noiseBuf = makeNoise();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.ratio.value = 4;
  comp.connect(ctx.destination);
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(comp);

  music = ctx.createGain();
  music.gain.value = .8;
  music.connect(master);
  sfxBus = ctx.createGain();
  sfxBus.gain.value = 1;
  sfxBus.connect(master);

  padFilter = ctx.createBiquadFilter();
  padFilter.type = 'lowpass';
  padFilter.frequency.value = 700;
  padFilter.Q.value = 4;
  padFilter.connect(music);
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = .07;
  lfoGain.gain.value = 260;
  lfo.connect(lfoGain);
  lfoGain.connect(padFilter.frequency);
  lfo.start();

  arpGain = ctx.createGain();
  arpGain.gain.value = 0;
  const arpFilter = ctx.createBiquadFilter();
  arpFilter.type = 'lowpass';
  arpFilter.frequency.value = 2200;
  const delay = ctx.createDelay(1);
  delay.delayTime.value = STEP * 3;
  const fb = ctx.createGain();
  fb.gain.value = .34;
  arpGain.connect(arpFilter);
  arpFilter.connect(music);
  arpFilter.connect(delay);
  delay.connect(fb);
  fb.connect(delay);
  delay.connect(music);

  const hiss = ctx.createBufferSource();
  hiss.buffer = noiseBuf;
  hiss.loop = true;
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 3500;
  const hissGain = ctx.createGain();
  hissGain.gain.value = .012;
  hiss.connect(hp);
  hp.connect(hissGain);
  hissGain.connect(music);
  hiss.start();

  const hum = ctx.createOscillator();
  hum.frequency.value = 60;
  humGain = ctx.createGain();
  humGain.gain.value = .025;
  hum.connect(humGain);
  humGain.connect(music);
  hum.start();

  nextTime = ctx.currentTime + .1;
  timer = setInterval(schedule, 40);
  applyScene(true);
}

function applyScene(now) {
  if (!ctx) return;
  const t = ctx.currentTime, k = now ? .05 : 1.5;
  const cfg = {
    room: { cut: 650, arp: 0, hum: .025, music: .75 },
    world: { cut: 1500, arp: 1, hum: 0, music: .85 },
    glitch: { cut: 400, arp: .2, hum: 0, music: .35 },
    site: { cut: 900, arp: .35, hum: 0, music: .4 }
  }[scene];
  padFilter.frequency.setTargetAtTime(cfg.cut, t, k / 3);
  arpGain.gain.setTargetAtTime(cfg.arp, t, k / 3);
  humGain.gain.setTargetAtTime(cfg.hum, t, k / 3);
  music.gain.setTargetAtTime(cfg.music, t, k / 3);
}

function noise(dur, { type = 'bandpass', freq = 2500, q = .7, gain = .2, sweepTo = null, delay = 0 } = {}) {
  if (!sound.on) return;
  const t = ctx.currentTime + delay;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.setValueAtTime(freq, t);
  if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
  f.Q.value = q;
  const g = ctx.createGain();
  env(g, t, .01, gain, Math.max(0, dur - .06), .05);
  src.connect(f);
  f.connect(g);
  g.connect(sfxBus);
  src.start(t, Math.random());
  src.stop(t + dur + .1);
}

function tone(type, from, to, dur, gain, delay = 0) {
  if (!sound.on) return;
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(from, t);
  o.frequency.exponentialRampToValueAtTime(to, t + dur);
  o.connect(g);
  g.connect(sfxBus);
  env(g, t, .006, gain, dur * .4, dur * .6);
  o.start(t);
  o.stop(t + dur + .05);
}

export const sound = {
  get on() { return !!ctx && enabled && ctx.state === 'running'; },
  get enabled() { return enabled; },
  start() {
    if (!enabled) return;
    if (!ctx) build();
    if (ctx.state !== 'running') ctx.resume();
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(.55 * level, ctx.currentTime, .6);
    setTimeout(notify, 60);
  },
  toggle() {
    enabled = !enabled;
    try { localStorage.setItem(PREF, enabled ? 'on' : 'off'); } catch (e) { void e; }
    if (enabled) this.start();
    else if (ctx) master.gain.setTargetAtTime(0, ctx.currentTime, .15);
    notify();
  },
  onChange(fn) { listeners.add(fn); fn(this.on); },
  setVolume(v) {
    level = Math.min(1, Math.max(0, v));
    if (ctx && master && enabled) master.gain.setTargetAtTime(.55 * level, ctx.currentTime, .08);
  },
  setScene(name) {
    if (name === scene) return;
    scene = name;
    applyScene(false);
  },
  armOnFirstGesture() {
    const go = () => {
      if (enabled) this.start();
      ['pointerdown', 'keydown', 'touchstart'].forEach(e => removeEventListener(e, go, true));
    };
    ['pointerdown', 'keydown', 'touchstart'].forEach(e => addEventListener(e, go, true));
  }
};

export const sfx = {
  static(dur = .3, gain = .16) { noise(dur, { freq: 3000, q: .5, gain }); },
  click() {
    tone('square', 2400, 1800, .03, .05);
    noise(.03, { type: 'highpass', freq: 4000, gain: .08 });
  },
  tick() { tone('triangle', 1600, 1200, .05, .04); },
  whoosh() {
    noise(1.3, { type: 'lowpass', freq: 250, sweepTo: 5000, q: 1.2, gain: .22 });
    tone('sine', 60, 220, 1.2, .12);
  },
  eject() {
    tone('square', 900, 1300, .04, .05);
    noise(.55, { freq: 500, sweepTo: 2600, q: 3, gain: .1, delay: .05 });
    tone('sawtooth', 110, 330, .5, .035, .05);
    tone('sine', 520, 880, .25, .07, .55);
  },
  insert() {
    noise(.3, { freq: 2200, sweepTo: 600, q: 2, gain: .07 });
    tone('sine', 150, 48, .22, .32, .26);
    noise(.05, { type: 'highpass', freq: 3000, gain: .1, delay: .26 });
  },
  spin() { noise(.4, { freq: 800, sweepTo: 3200, q: 4, gain: .06 }); },
  glitch(dur = 1.4) {
    if (!sound.on) return;
    for (let t = 0; t < dur; t += .06 + Math.random() * .12) {
      if (Math.random() < .6) noise(.04 + Math.random() * .1, { freq: 400 + Math.random() * 4000, q: 1 + Math.random() * 6, gain: .14, delay: t });
      else tone('square', 200 + Math.random() * 1800, 100 + Math.random() * 900, .05, .04, t);
    }
  },
  powerOn() {
    tone('sine', 40, 15000, .45, .025);
    noise(.4, { freq: 3000, q: .5, gain: .12, delay: .1 });
  }
};
