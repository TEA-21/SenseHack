import React, { useState, useRef, useEffect, useCallback } from 'react';

// Channel definitions
const CHANNELS = ['26', '02', '04', '07', '11', '13'] as const;

// Volume levels with knob degrees, gain multipliers, and OSD readout bars
const VOLUME_LEVELS = [
  { label: 'OFF', gain: 0, deg: -120, bar: 'VOL [MUTED]' },
  { label: 'LOW', gain: 0.035, deg: -40, bar: 'VOL ||....' },
  { label: 'MED', gain: 0.08, deg: 40, bar: 'VOL ||||..' },
  { label: 'MAX', gain: 0.14, deg: 120, bar: 'VOL ||||||' },
];

export const Hero: React.FC = () => {
  // TV Hardware State
  const [isPowerOn, setIsPowerOn] = useState<boolean>(true);
  const [volumeIndex, setVolumeIndex] = useState<number>(0); // 0 = OFF (Muted)
  const [channelIndex, setChannelIndex] = useState<number>(0); // Default CH 26 (SenseHack '26)
  const currentChannel = CHANNELS[channelIndex];

  // Authentic 1980s P31 Green Phosphor OSD HUD State
  const [osdChannel, setOsdChannel] = useState<string | null>(null);
  const [osdVolume, setOsdVolume] = useState<string | null>(null);
  const osdChanTimerRef = useRef<number | null>(null);
  const osdVolTimerRef = useRef<number | null>(null);

  // Web Audio References (Vintage 1970s 3-inch paper-cone speaker pipeline)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const hum60Ref = useRef<OscillatorNode | null>(null);
  const hum120Ref = useRef<OscillatorNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const smpteToneRef = useRef<OscillatorNode | null>(null);
  const smpteGainRef = useRef<GainNode | null>(null);
  const snowGainRef = useRef<GainNode | null>(null);

  // Canvas Refs for Dynamic Channels
  const snowCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const oscCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. Dynamic SVG Displacement Map Generation on Mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imgData = ctx.createImageData(256, 256);
        const data = imgData.data;
        for (let y = 0; y < 256; y++) {
          const v = (y / 128) - 1; // [-1, 1]
          for (let x = 0; x < 256; x++) {
            const u = (x / 128) - 1; // [-1, 1]
            const r2 = u * u + v * v;
            const k = 1 + 0.22 * r2;
            const uWarp = u * k;
            const vWarp = v * k;
            const dx = uWarp - u;
            const dy = vWarp - v;

            const idx = (y * 256 + x) * 4;
            data[idx] = Math.max(0, Math.min(255, Math.round(128 + 127 * dx)));     // R = X displacement
            data[idx + 1] = Math.max(0, Math.min(255, Math.round(128 + 127 * dy))); // G = Y displacement
            data[idx + 2] = 128; // B neutral
            data[idx + 3] = 255;
          }
        }
        ctx.putImageData(imgData, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        const feImg = document.getElementById('barrel-fe-image');
        if (feImg) {
          feImg.setAttribute('href', dataUrl);
        }
        const feImgSubtle = document.getElementById('barrel-fe-image-subtle');
        if (feImgSubtle) {
          feImgSubtle.setAttribute('href', dataUrl);
        }
      }
    } catch (e) {
      console.warn('SVG displacement map init:', e);
    }
  }, []);

  // 2. Vintage 1970s 3-inch Paper-Cone Speaker Audio Engine
  const getOrCreateAudioContext = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;

    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return null;

      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      // Master Gain Node
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGainRef.current = masterGain;

      // Filter 1: 180Hz Highpass (Simulates small 3-inch driver low-end roll-off)
      const hpf = ctx.createBiquadFilter();
      hpf.type = 'highpass';
      hpf.frequency.setValueAtTime(180, ctx.currentTime);
      hpf.Q.setValueAtTime(0.8, ctx.currentTime);

      // Filter 2: 1250Hz Peaking (Chassis and cone midrange vocal resonance)
      const midPeak = ctx.createBiquadFilter();
      midPeak.type = 'peaking';
      midPeak.frequency.setValueAtTime(1250, ctx.currentTime);
      midPeak.gain.setValueAtTime(5.5, ctx.currentTime);
      midPeak.Q.setValueAtTime(1.4, ctx.currentTime);

      // Filter 3: 3400Hz Lowpass (Cuts harsh high frequencies from vintage circuitry)
      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.setValueAtTime(3400, ctx.currentTime);
      lpf.Q.setValueAtTime(0.7, ctx.currentTime);

      // Filter 4: WaveShaper Saturation (Tanh soft-clip for analog transformer warmth)
      const waveShaper = ctx.createWaveShaper();
      const nSamples = 1024;
      const curve = new Float32Array(nSamples);
      for (let i = 0; i < nSamples; i++) {
        const x = (i * 2) / nSamples - 1;
        curve[i] = Math.tanh(1.8 * x);
      }
      waveShaper.curve = curve;
      waveShaper.oversample = '2x';

      // Connect Vintage Speaker Chain: Filter Hub -> Master Gain -> Destination
      hpf.connect(midPeak);
      midPeak.connect(lpf);
      lpf.connect(waveShaper);
      waveShaper.connect(masterGain);
      masterGain.connect(ctx.destination);

      // Sound 1: 60Hz CRT Mains Hum Fundamental
      const osc60 = ctx.createOscillator();
      osc60.type = 'sine';
      osc60.frequency.setValueAtTime(60, ctx.currentTime);
      const gain60 = ctx.createGain();
      gain60.gain.setValueAtTime(0.35, ctx.currentTime);
      osc60.connect(gain60);
      gain60.connect(hpf);
      osc60.start();
      hum60Ref.current = osc60;

      // Sound 2: 120Hz 2nd Harmonic Buzz
      const osc120 = ctx.createOscillator();
      osc120.type = 'sine';
      osc120.frequency.setValueAtTime(120, ctx.currentTime);
      const gain120 = ctx.createGain();
      gain120.gain.setValueAtTime(0.12, ctx.currentTime);
      osc120.connect(gain120);
      gain120.connect(hpf);
      osc120.start();
      hum120Ref.current = osc120;

      // Sound 3: Filtered Pink/White Noise (Cathode hiss)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const channelData = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.997 * b0 + white * 0.05;
        b1 = 0.963 * b1 + white * 0.11;
        b2 = 0.860 * b2 + white * 0.25;
        channelData[i] = (b0 + b1 + b2) * 0.06;
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(550, ctx.currentTime);

      const snowGain = ctx.createGain();
      snowGain.gain.setValueAtTime(0.08, ctx.currentTime);
      snowGainRef.current = snowGain;

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(snowGain);
      snowGain.connect(hpf);
      noiseSource.start();
      noiseSourceRef.current = noiseSource;

      // Sound 4: 1kHz SMPTE Calibration Test Tone (For CH 04)
      const smpteOsc = ctx.createOscillator();
      smpteOsc.type = 'sine';
      smpteOsc.frequency.setValueAtTime(1000, ctx.currentTime);
      const smpteGain = ctx.createGain();
      smpteGain.gain.setValueAtTime(0, ctx.currentTime); // Muted by default
      smpteOsc.connect(smpteGain);
      smpteGain.connect(hpf);
      smpteOsc.start();
      smpteToneRef.current = smpteOsc;
      smpteGainRef.current = smpteGain;
    }

    return audioCtxRef.current;
  }, []);

  // Update channel-specific sound (SMPTE tone / Snow hiss)
  useEffect(() => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    // SMPTE 1kHz tone active only on CH 04
    if (smpteGainRef.current) {
      const targetTone = currentChannel === '04' ? 0.045 : 0;
      smpteGainRef.current.gain.setTargetAtTime(targetTone, ctx.currentTime, 0.04);
    }

    // Snow hiss boosted on CH 02
    if (snowGainRef.current) {
      const targetHiss = currentChannel === '02' ? 0.32 : 0.08;
      snowGainRef.current.gain.setTargetAtTime(targetHiss, ctx.currentTime, 0.04);
    }
  }, [currentChannel]);

  // Momentary analog tuning static burst
  const playTuningStaticBurst = useCallback(() => {
    const ctx = getOrCreateAudioContext();
    if (!ctx || ctx.state !== 'running' || !masterGainRef.current) return;

    try {
      const burstSize = Math.floor(ctx.sampleRate * 0.18);
      const burstBuffer = ctx.createBuffer(1, burstSize, ctx.sampleRate);
      const ch = burstBuffer.getChannelData(0);
      for (let i = 0; i < burstSize; i++) {
        ch[i] = (Math.random() * 2 - 1) * 0.4;
      }
      const burstSource = ctx.createBufferSource();
      burstSource.buffer = burstBuffer;
      const burstGain = ctx.createGain();
      burstGain.gain.setValueAtTime(0.14, ctx.currentTime);
      burstGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      burstSource.connect(burstGain);
      burstGain.connect(masterGainRef.current);
      burstSource.start();
    } catch {}
  }, [getOrCreateAudioContext]);

  // Rotary Volume Dial Click
  const handleVolumeDialClick = () => {
    if (!isPowerOn) return;

    const ctx = getOrCreateAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const nextIndex = (volumeIndex + 1) % VOLUME_LEVELS.length;
    setVolumeIndex(nextIndex);

    // Trigger P31 green phosphor OSD HUD
    setOsdVolume(VOLUME_LEVELS[nextIndex].bar);
    if (osdVolTimerRef.current) window.clearTimeout(osdVolTimerRef.current);
    osdVolTimerRef.current = window.setTimeout(() => setOsdVolume(null), 1800);

    const targetGain = VOLUME_LEVELS[nextIndex].gain;
    if (masterGainRef.current) {
      masterGainRef.current.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.04);
    }
  };

  // Rotary Tuning Dial Click
  const handleTuningDialClick = () => {
    if (!isPowerOn) return;

    const ctx = getOrCreateAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    playTuningStaticBurst();
    const nextChanIndex = (channelIndex + 1) % CHANNELS.length;
    setChannelIndex(nextChanIndex);

    // Trigger P31 green phosphor OSD HUD
    setOsdChannel(`CH ${CHANNELS[nextChanIndex]}`);
    if (osdChanTimerRef.current) window.clearTimeout(osdChanTimerRef.current);
    osdChanTimerRef.current = window.setTimeout(() => setOsdChannel(null), 1800);
  };

  // Power Rocker Switch Toggle
  const handlePowerToggle = () => {
    const nextPower = !isPowerOn;
    setIsPowerOn(nextPower);

    if (audioCtxRef.current && masterGainRef.current) {
      if (!nextPower) {
        masterGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.04);
      } else {
        const targetGain = VOLUME_LEVELS[volumeIndex].gain;
        masterGainRef.current.gain.setTargetAtTime(targetGain, audioCtxRef.current.currentTime, 0.06);
      }
    }
  };

  // Cleanup on Unmount
  useEffect(() => {
    return () => {
      try { hum60Ref.current?.stop(); } catch {}
      try { hum120Ref.current?.stop(); } catch {}
      try { noiseSourceRef.current?.stop(); } catch {}
      try { smpteToneRef.current?.stop(); } catch {}
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // CH 02: Dynamic Static Snow Canvas Loop
  useEffect(() => {
    if (currentChannel !== '02' || !isPowerOn) return;
    const canvas = snowCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const renderSnow = () => {
      const w = canvas.width;
      const h = canvas.height;
      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() > 0.48 ? 255 : Math.floor(Math.random() * 40);
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = 255;
      }
      ctx.putImageData(imgData, 0, 0);
      animId = requestAnimationFrame(renderSnow);
    };

    renderSnow();
    return () => cancelAnimationFrame(animId);
  }, [currentChannel, isPowerOn]);

  // CH 13: Oscilloscope Trace Canvas Loop
  useEffect(() => {
    if (currentChannel !== '13' || !isPowerOn) return;
    const canvas = oscCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const renderOsc = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = '#050c05';
      ctx.fillRect(0, 0, w, h);

      // Grid Lines
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Live Waveform
      ctx.strokeStyle = '#00ff41';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00ff41';
      ctx.shadowBlur = 12;

      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const normX = (x / w) * Math.PI * 8;
        const y = h / 2 +
          Math.sin(normX + phase) * 38 +
          Math.sin(normX * 2.3 - phase * 1.5) * 16 +
          (Math.random() - 0.5) * 4;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      phase += 0.08;
      animId = requestAnimationFrame(renderOsc);
    };

    renderOsc();
    return () => cancelAnimationFrame(animId);
  }, [currentChannel, isPowerOn]);

  const tuningDegree = channelIndex * 60;
  const volumeDegree = VOLUME_LEVELS[volumeIndex].deg;

  // Localized Bezel Rim Bounce-Light Filter
  const bezelRimFilter = !isPowerOn
    ? 'brightness(0.38) saturate(0.18) contrast(1.15)'
    : currentChannel === '02'
    ? 'brightness(0.72) saturate(0.2) hue-rotate(180deg)'
    : currentChannel === '04'
    ? 'brightness(0.85) saturate(0.6)'
    : currentChannel === '13'
    ? 'brightness(0.65) saturate(0.4) hue-rotate(90deg)'
    : 'none';

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-crt-bg px-2 sm:px-4 py-8 sm:py-14 select-none"
    >
      {/* Immersive Dark Hardware-Lab Radial Vignette */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      {/* Atmospheric Hardware-Lab Depth: Subtle Rackmount Silhouettes & Volumetric Falloff */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute top-10 left-[8%] w-48 h-80 rounded border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent" />
        <div className="absolute top-16 right-[10%] w-56 h-72 rounded border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent" />
        <div className="absolute -bottom-10 inset-x-0 h-44 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      {/* SVG Optical System Definitions */}
      <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
        <defs>
          {/* 1. Exact Calibrated Squircle Screen Mask for Tube Viewport (Local Coordinates) */}
          <clipPath id="crt-tube-barrel" clipPathUnits="objectBoundingBox">
            <path
              d="M 0.010 0.220 
                 C 0.010 0.070, 0.070 0.012, 0.220 0.012 
                 C 0.380 0.000, 0.620 0.000, 0.780 0.012 
                 C 0.930 0.012, 0.990 0.070, 0.990 0.220 
                 C 1.000 0.350, 1.000 0.630, 0.990 0.760 
                 C 0.990 0.910, 0.930 0.988, 0.780 0.988 
                 C 0.620 1.000, 0.380 1.000, 0.220 0.988 
                 C 0.070 0.988, 0.010 0.910, 0.010 0.760 
                 C 0.000 0.630, 0.000 0.350, 0.010 0.220 Z"
            />
          </clipPath>

          {/* 2. SVG Squircle Stroke-Mask for Inner Bezel Bounce-Light Attenuation (Plate Coordinates) */}
          <mask id="crt-bezel-rim-mask" maskContentUnits="objectBoundingBox">
            <rect x="0" y="0" width="1" height="1" fill="black" />
            <path
              d="M 0.0916 0.2853 
                 C 0.0916 0.1676, 0.1345 0.1221, 0.2415 0.1221 
                 C 0.3557 0.1127, 0.5270 0.1127, 0.6411 0.1221 
                 C 0.7481 0.1221, 0.7910 0.1676, 0.7910 0.2853 
                 C 0.7981 0.3873, 0.7981 0.6069, 0.7910 0.7089 
                 C 0.7910 0.8266, 0.7481 0.8878, 0.6411 0.8878 
                 C 0.5270 0.8972, 0.3557 0.8972, 0.2415 0.8878 
                 C 0.1345 0.8878, 0.0916 0.8266, 0.0916 0.7089 
                 C 0.0845 0.6069, 0.0845 0.3873, 0.0916 0.2853 Z"
              fill="none"
              stroke="white"
              strokeWidth="0.045"
              filter="url(#bezel-rim-blur)"
            />
          </mask>
          <filter id="bezel-rim-blur">
            <feGaussianBlur stdDeviation="0.016" />
          </filter>

          {/* 3. Hardware-Accelerated Dynamic SVG Barrel Displacement Map (Full Channels) */}
          <filter id="crt-barrel-distortion" x="-10%" y="-10%" width="120%" height="120%">
            <feImage id="barrel-fe-image" href="" result="warpMap" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="warpMap"
              scale="24"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* 4. Subdued Authentic Barrel Warp for CH 26 Broadcast Plate */}
          <filter id="crt-subtle-barrel-warp" x="-10%" y="-10%" width="120%" height="120%">
            <feImage id="barrel-fe-image-subtle" href="" result="warpMap" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="warpMap"
              scale="14"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Main Unified Vintage CRT TV Console Stage */}
      <div className="relative z-10 w-full max-w-[1360px] mx-auto flex items-center justify-center">
        
        {/* ==========================================================================
            FULL-UNIT PHOTOREALISTIC TELEVISION EXPERIENCE (crt-full-tight.png)
            - 100% Photographic Base Plate with Seamless Alpha Feathering
            - Recalibrated Squircle Electron Beam Viewport (1487 x 1153 px)
            - Precision Photographic Rotary Inner Knob Overlays (125px Diameter)
            - Dynamic Hardware-Lab Workbench Amber/Cool Light Spill
            ========================================================================== */}
        <div id="crt-tv-stage" className="crt-tv-stage crt-text-centered">
          
          {/* Dynamic Desk Workbench Light Spill (Reacts to Power & Channel) */}
          <div
            className={`crt-workbench-spill ${
              !isPowerOn
                ? 'opacity-0'
                : currentChannel === '02'
                ? 'crt-workbench-spill-snow opacity-75'
                : 'crt-workbench-spill-amber crt-spill-flicker opacity-90'
            }`}
          />

          {/* TIER 1: Base Housing (Pristine Seamless Inpainted Plate) */}
          <img
            src="/crt-full-tight.png"
            alt="Vintage CRT Television Console"
            className="absolute inset-0 w-full h-full object-contain z-[1] select-none pointer-events-none"
          />

          {/* Pitch-Black Room: Outer Cabinet Shadow & Ambient Falloff */}
          <div className="crt-cabinet-shadow" />

          {/* TIER 2: Localized Inner Bezel Bounce-Light Overlay (Masked strictly to squircle rim) */}
          <div
            className="crt-bezel-rim-overlay"
            style={{
              filter: bezelRimFilter,
              opacity: currentChannel === '26' && isPowerOn ? 0 : 0.88,
            }}
          >
            <img
              src="/crt-full-tight.png"
              alt=""
              className="w-full h-full object-contain select-none pointer-events-none"
            />
          </div>

          {/* TIER 3: Stationary Dead-Glass Occlusion Layer */}
          <div className="crt-barrel-masked crt-dead-glass crt-tube-viewport z-10 pointer-events-none" />

          {/* TIER 4: Tube Viewport Container (Stationary Squircle Boundary) */}
          <div className="crt-barrel-masked crt-tube-viewport z-20 pointer-events-none">
            {/* Collapsible Electron Beam Wrapper */}
            <div
              className={`w-full h-full relative transition-transform ${
                isPowerOn ? '' : 'crt-beam-off'
              }`}
            >
              {/* CHANNEL 26: Authentic SENSE HACK '26 Broadcast with Subtle 3D Curvature & Chromatic Drift */}
              {currentChannel === '26' && (
                <div
                  className="w-full h-full relative crt-ambient-flicker overflow-hidden"
                  style={{ filter: 'url(#crt-subtle-barrel-warp)' }}
                >
                  <img
                    src="/crt-full-tight.png"
                    alt="SenseHack 26 Master Feed"
                    className="absolute select-none pointer-events-none crt-erratic-jitter crt-cathode-drift"
                    style={{
                      width: '140.13%',
                      height: '127.47%',
                      left: '-11.84%',
                      top: '-14.36%',
                      maxWidth: 'none',
                    }}
                  />

                  {/* Physical Scanlines & Rolling Humbar Cutting OVER CH 26 Broadcast Text */}
                  <div className="crt-ch26-scanline-cut" />
                  <div className="crt-ch26-rolling-bar" />
                </div>
              )}

              {/* CHANNEL 02: Dynamic Static Snow */}
              {currentChannel === '02' && (
                <div
                  className="absolute -inset-[5%] w-[110%] h-[110%] flex items-center justify-center bg-black crt-dim-snow"
                  style={{ filter: 'url(#crt-barrel-distortion)' }}
                >
                  <canvas
                    ref={snowCanvasRef}
                    width={320}
                    height={200}
                    className="w-full h-full object-cover opacity-75"
                  />
                  <div className="absolute top-8 left-10 font-mono text-xs sm:text-sm font-bold tracking-widest text-[#00ff41] bg-black/60 px-2 py-0.5 rounded">
                    CH 02 // NO SIGNAL
                  </div>
                </div>
              )}

              {/* CHANNEL 04: SMPTE Color Calibration Bars */}
              {currentChannel === '04' && (
                <div
                  className="absolute -inset-[5%] w-[110%] h-[110%] flex flex-col bg-black crt-rolling-humbar crt-dim-smpte"
                  style={{ filter: 'url(#crt-barrel-distortion)' }}
                >
                  {/* Top 70% Standard Bars */}
                  <div className="w-full h-[70%] flex">
                    <div className="flex-1 bg-[#c0c0c0]" />
                    <div className="flex-1 bg-[#c0c000]" />
                    <div className="flex-1 bg-[#00c0c0]" />
                    <div className="flex-1 bg-[#00c000]" />
                    <div className="flex-1 bg-[#c000c0]" />
                    <div className="flex-1 bg-[#c00000]" />
                    <div className="flex-1 bg-[#0000c0]" />
                  </div>
                  {/* Middle Castellations */}
                  <div className="w-full h-[8%] flex">
                    <div className="flex-1 bg-[#0000c0]" />
                    <div className="flex-1 bg-[#131313]" />
                    <div className="flex-1 bg-[#c000c0]" />
                    <div className="flex-1 bg-[#131313]" />
                    <div className="flex-1 bg-[#00c0c0]" />
                    <div className="flex-1 bg-[#131313]" />
                    <div className="flex-1 bg-[#c0c0c0]" />
                  </div>
                  {/* Bottom PLUGE Pattern */}
                  <div className="w-full h-[22%] flex">
                    <div className="w-[18%] bg-[#00214c]" />
                    <div className="w-[18%] bg-[#ffffff]" />
                    <div className="w-[18%] bg-[#32006a]" />
                    <div className="w-[18%] bg-[#131313]" />
                    <div className="w-[7%] bg-[#080808]" />
                    <div className="w-[7%] bg-[#131313]" />
                    <div className="w-[7%] bg-[#1e1e1e]" />
                    <div className="flex-1 bg-[#131313]" />
                  </div>
                  <div className="absolute top-8 left-10 font-mono text-xs sm:text-sm font-bold tracking-widest text-white bg-black/75 px-2 py-0.5 rounded">
                    CH 04 // SMPTE-170M
                  </div>
                </div>
              )}

              {/* CHANNEL 07: Scrolling Amber Hardware Telemetry */}
              {currentChannel === '07' && (
                <div
                  className="absolute -inset-[5%] w-[110%] h-[110%] bg-[#0b0805] text-[#ff9d00] p-8 sm:p-14 font-mono text-[9px] sm:text-xs overflow-hidden leading-relaxed crt-rolling-humbar crt-dim-telemetry"
                  style={{ filter: 'url(#crt-barrel-distortion)' }}
                >
                  <div className="text-crt-amber font-bold mb-2 pb-1 border-b border-crt-amber/30 flex justify-between">
                    <span>CH 07 // CATHODE TELEMETRY</span>
                    <span>15.734 kHz</span>
                  </div>
                  <div className="space-y-0.5 opacity-90">
                    <p>&gt; YOKE_STATUS: BALANCED (DEFLECTION 90 DEG)</p>
                    <p>&gt; ANODE_POTENTIAL: 24.8 kV NOMINAL</p>
                    <p>&gt; FILAMENT_HEATER: 6.3V AC // 0.6A</p>
                    <p>&gt; BEAM_CURRENT: 420 uA [STABLE]</p>
                    <p>&gt; HORIZ_FLYBACK_PULSE: 12.2 us</p>
                    <p>&gt; VERT_BLANKING_INTERVAL: 1.25 ms</p>
                    <p>&gt; SHADOW_MASK_TEMP: 38.4 C</p>
                    <p>&gt; PHOSPHOR_TYPE: P22-AMBER RASTER</p>
                    <p className="text-white/80">&gt; BROADCAST_SYNC: LOCKED ON CARRIER</p>
                  </div>
                </div>
              )}

              {/* CHANNEL 11: Analog Sync Scramble */}
              {currentChannel === '11' && (
                <div
                  className="absolute -inset-[5%] w-[110%] h-[110%] bg-[#08080c] overflow-hidden crt-rolling-humbar crt-dim-scramble"
                  style={{ filter: 'url(#crt-barrel-distortion)' }}
                >
                  <div className="absolute inset-0 flex flex-col justify-around opacity-75">
                    <div className="h-6 bg-white/20 transform -skew-x-12" />
                    <div className="h-10 bg-crt-amber/30 transform skew-x-6" />
                    <div className="h-4 bg-white/40 transform -skew-x-3" />
                    <div className="h-14 bg-red-600/30 transform skew-x-12" />
                  </div>
                  <div className="absolute top-8 left-10 font-mono text-xs sm:text-sm font-bold tracking-widest text-red-500 bg-black/80 px-2 py-0.5 rounded">
                    CH 11 // SYNC LOSS
                  </div>
                </div>
              )}

              {/* CHANNEL 13: Green Oscilloscope Waveform */}
              {currentChannel === '13' && (
                <div
                  className="absolute -inset-[5%] w-[110%] h-[110%] bg-[#050c05] crt-rolling-humbar crt-dim-osc"
                  style={{ filter: 'url(#crt-barrel-distortion)' }}
                >
                  <canvas
                    ref={oscCanvasRef}
                    width={400}
                    height={260}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-8 left-10 font-mono text-xs sm:text-sm font-bold tracking-widest text-[#00ff41] bg-black/75 px-2 py-0.5 rounded">
                    CH 13 // OSCILLOSCOPE
                  </div>
                </div>
              )}

              {/* Authentic 1980s P31 Green Phosphor OSD HUD */}
              {osdChannel && isPowerOn && (
                <div className="crt-osd-channel">
                  {osdChannel}
                </div>
              )}
              {osdVolume && isPowerOn && (
                <div className="crt-osd-volume">
                  {osdVolume}
                </div>
              )}
            </div>
          </div>

          {/* TIER 5: Persistent Specular Glass Reflections */}
          <div className="crt-specular-composite crt-tube-viewport pointer-events-none">
            <div className="crt-glare-top-left" />
            {(!isPowerOn || currentChannel !== '26') && (
              <div className="crt-specular-square-spot" />
            )}
          </div>

          {/* ==========================================================================
              INTERACTIVE HARDWARE CONTROLS (Zero Fake CSS Widgets)
              - Precision photographic inner dial rotations at exact cylinder center (86.21%)
              - Tactile hit-target button wells over photograph without browser tooltips
              ========================================================================== */}
          
          {/* 1. PHOTOGRAPHIC ROTARY TUNING DIAL */}
          <button
            type="button"
            id="tuning-dial"
            onClick={handleTuningDialClick}
            disabled={!isPowerOn}
            aria-label="Rotate Tuning Dial"
            className="crt-photographic-knob"
            style={{ left: '90.73%', top: '22.01%' }}
          >
            <img
              src="/tuning-knob-cap.png"
              alt="Tuning Dial"
              className="crt-knob-cap-img"
              style={{ transform: `rotate(${tuningDegree}deg)` }}
            />
          </button>

          {/* 2. PHOTOGRAPHIC ROTARY VOLUME DIAL */}
          <button
            type="button"
            id="volume-dial"
            onClick={handleVolumeDialClick}
            disabled={!isPowerOn}
            aria-label="Rotate Volume Dial"
            className="crt-photographic-knob"
            style={{ left: '90.73%', top: '40.32%' }}
          >
            <img
              src="/volume-knob-cap.png"
              alt="Volume Dial"
              className="crt-knob-cap-img"
              style={{ transform: `rotate(${volumeDegree}deg)` }}
            />
          </button>

          {/* 3. HARDWARE POWER PUSHBUTTON HIT-TARGET */}
          <button
            type="button"
            id="power-switch"
            onClick={handlePowerToggle}
            aria-label="Toggle CRT Power"
            className="crt-photographic-power"
            style={{ left: '90.80%', top: '87.61%' }}
          />

          {/* 4. PINHOLE AMBER PILOT LAMP INDICATOR */}
          <div
            className={`crt-pilot-lamp ${isPowerOn ? 'crt-pilot-lamp-on' : 'crt-pilot-lamp-off'}`}
            style={{ left: '90.80%', top: '84.86%' }}
          />

        </div>

      </div>
    </section>
  );
};
