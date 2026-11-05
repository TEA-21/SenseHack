# PLAN: Sense Hack '26 Sleek Portal Website (Revision 5)

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

5. **Build Pipeline & Config:**
   - Explicit `postcss.config.js`.
   - `package.json` script: `"build": "tsc && vite build"` to catch TypeScript errors during automated checks.

## Execution Phases
- **Phase 1: Project Scaffolding & Root Configuration:** Vite React app with TypeScript, `postcss.config.js`, `tsconfig.json`, `index.html`, `tailwind.config.js`, `three`, `lucide-react`.
- **Phase 2: Central Data Store & Strict Interfaces:** `hackathonData.ts` with 2026 dates, schedule, prizes, tracks, winners, FAQs, and guarded URL builder.
- **Phase 3: Interactive 3D WebGL Hero & Dynamic Navbar:** Mount-only Three.js procedural mainframe with zero-cost rAF pause, delta accumulation, mobile `touch-pan-y`, and dual-threshold `IntersectionObserver` navbar.
- **Phase 4: Registration Hub, Schedule & Content Sections:** Dual registration cards, 36H schedule, About IEEE/ComSoc/SENSE, 7 tracks, and past winners.
- **Phase 5: Actionable Forms Suite & FAQ Accordion:** `localStorage` persistence, clear draft, accommodation validation, clipboard try/catch + modal textarea payload preview, and FAQ accordion.
- **Phase 6: E2E Verification & Visual QA:** `npm run build` (`tsc && vite build`), browser verification, form persistence test, and screenshot audit.
