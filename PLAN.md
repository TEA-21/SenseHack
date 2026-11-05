# PLAN: Sense Hack '26 Sleek Portal Website (Revision 6)

## Architectural & Technical Specifications

1. **Zero-Cost WebGL rAF Pause & Smooth Resume (`Hero.tsx`):**
   - Three.js setup initialized in `useEffect(..., [])` (mount-only).
   - When `isWebGLActive === false`: `cancelAnimationFrame(animationFrameIdRef.current)`, setting ID to `null` (zero idle callbacks).
   - When `isWebGLActive === true`: restarts rAF loop via `useEffect([isWebGLActive])`.
   - Tracks accumulated delta time (`activeTimeRef.current += delta`) to eliminate `THREE.Clock` time-jump spikes upon re-entry.

2. **Native Mobile Vertical Scrolling (`Hero.tsx`):**
   - Canvas container explicitly styled with `touch-pan-y` / `style={{ touchAction: 'pan-y' }}`.
   - Touch listeners attached with `{ passive: true }` so vertical mobile touch gestures never get trapped or intercepted.

3. **Guarded Clipboard Handshake & Modal Payload Preview (`FormsSection.tsx`):**
   - `navigator.clipboard.writeText()` wrapped in a `try/catch` block.
   - Formatted requisition summary rendered inside a styled `<textarea readOnly />` in the modal as an explicit visual fallback.
   - Prefill query parameters appended only for `docs.google.com/forms`; clean URL opened directly for `forms.gle` shortlinks.
   - "Clear Draft" button purges stored `localStorage` keys and resets state.

4. **Accommodation Form Integrity (`FormsSection.tsx`):**
   - Auto-computes `totalMembers = Number(maleCount) + Number(femaleCount)`.
   - Enforces `new Date(departureDate) >= new Date(arrivalDate)` with inline error feedback.

5. **Physical CRT Alignment & Glass Boundary Calibration (Phase 21):**
   - 1:1 Base-Plate Lock: Remove displacement drift from Channel 26 feed image so letters line up with physical bezel reflections.
   - Viewport boundary recalibration: $X \in [204, 1672]$, $Y \in [183, 1244]$ in 2130x1420 image space.
   - Nested plate image alignment: `left: -13.896%`, `top: -17.248%`, `width: 145.095%`, `height: 133.836%`.
   - Scanline perimeter alpha feather: 12px smooth gradient so scanlines never bleed outside the glass face.

## Execution Phases
- **Phase 1 to 20:** Prior iterations (scaffolding, audio, photographic CRT unit, channels, control deck exposure, aspect ratio fixes).
- **Phase 21: Bezel Reflection Alignment & Glass Boundary Inset:**
  1. Remove `url(#crt-subtle-barrel-warp)` from Channel 26 image plate to achieve 1:1 lock with bezel reflections.
  2. Recalibrate `.crt-tube-viewport` in `src/index.css` to match physical glass boundaries ($9.577\% \text{ left}, 12.887\% \text{ top}, 68.920\% \text{ width}, 74.718\% \text{ height}$).
  3. Recalibrate inner image positioning in `src/components/Hero.tsx` to match the new viewport.
  4. Recalibrate SVG `#crt-tube-barrel` squircle path.
  5. Add perimeter alpha feather mask to scanlines and rolling hum-bar.
  6. E2E verification in Playwright (macro crops of bezel reflections + full unit).
