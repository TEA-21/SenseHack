# PLAN.md: Phase 25 - Natural CRT Environment (Bias Lighting, Surface Plane & Trailing Cables)

## Objective
Introduce subtle, realistic environmental grounding behind the CRT TV without visual clutter:
1. Dynamic reactive bias lighting (wall halo) reflecting tube phosphor colors and power states.
2. Grounded studio workbench horizon plane with soft contact occlusion.
3. Realistic matte black trailing power cord and coaxial cables snaking out behind the chassis.

## Architecture & Visual Layers
- **Layer 0A: Dynamic Reactive Wall Bias Light**
  - Position: Behind `#crt-tv-stage` (`z-0`).
  - Geometry: Soft elliptical radial glow extending ~15-20% beyond cabinet perimeter onto the back wall.
  - Channels:
    - `Power OFF`: Fades to 0 opacity.
    - `CH 26 / 07`: Amber phosphor wall bounce (`#ff6a14`, `opacity: 0.85`).
    - `CH 04`: Neutral/cool white broadcast wall bounce (`#b0c8e8`, `opacity: 0.70`).
    - `CH 02`: Static snow glow (`#9bbce0`, `opacity: 0.65`).
    - `CH 13`: Emerald oscilloscope glow (`#22c55e`, `opacity: 0.75`).
    - `CH 11`: Dark sync flicker (`#883020`, `opacity: 0.50`).
- **Layer 0B: Studio Workbench Surface Horizon Plane**
  - Position: Horizontal band aligned with the bottom contact line of the CRT television (~68%–72% height).
  - Appearance: Faint top horizon highlight (`border-t border-white/[0.04]`), dark matte surface gradient, and ambient contact shadow directly underneath the unit.
- **Layer 0C: Trailing Hardware Cables (SVG Organic Béziers)**
  - Position: Behind the TV cabinet (`z-[0]`), casting soft drop-shadows onto the workbench surface.
  - Cable 1 (Power Cord): Thick 3-prong industrial rubber cable (~8px thick, deep matte charcoal `#121216` with `#24242e` subtle specular highlight ridge) emerging from behind the lower-left rear chassis and curving out toward the edge of the workbench.
  - Cable 2 (Coaxial BNC / Antenna): Slender 75Ω coaxial cable (~4.5px thick, dark warm gray `#181614`) drooping from upper-right rear connector down behind the right cabinet side.

## Execution Steps
1. **CSS Definitions in `src/index.css`:**
   - Define `.crt-bias-light` base styles and channel-reactive state classes (`.crt-bias-amber`, `.crt-bias-smpte`, `.crt-bias-snow`, `.crt-bias-green`, `.crt-bias-scramble`).
   - Define `.crt-desk-horizon` and ambient contact shadow styles.
2. **Component Integration in `src/components/Hero.tsx`:**
   - Add the reactive bias light container behind `#crt-tv-stage`.
   - Add the workbench horizon surface behind the unit.
   - Add the SVG trailing cables layer with realistic Bézier paths and ambient drop shadows.
3. **Build & Type Check:**
   - Run `npm run build` to ensure zero compilation or bundle errors.
4. **Mandatory Phase-End E2E Verification (Playwright):**
   - Test power switch toggle: verify bias light fades out smoothly when power is turned OFF and restores on ON.
   - Test channel dial rotation across Channels 26, 04, 02, 13, 07: verify bias lighting shifts color cleanly and cables stay grounded.
   - Capture desktop (1440x900) and mobile viewports to ensure seamless responsive scaling without horizontal overflow.
5. **Update `PROGRESS.md` & `walkthrough.md`.**
