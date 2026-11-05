# PROGRESS.md

## Current Active Phase
Phase 21 Complete: Bezel Reflection Alignment & Phosphor Glass Inset Calibration

## Completed Steps & Exact Techniques/Libraries Used
- **1:1 Base-Plate Lock for Channel 26 Broadcast ([`src/components/Hero.tsx`](file:///d:/Projects/SenseHack/src/components/Hero.tsx)):**
  - Removed artificial displacement filter on Channel 26 feed image so letters line up 100% with the baked 3D bezel reflections on the left ("S") and right ("6").
  - Recalibrated Channel 26 nested plate image scale and offsets (`width: 145.095%`, `height: 133.836%`, `left: -13.896%`, `top: -17.248%`).
  - Preserved authentic CRT cathode jitter, chromatic drop-shadow drift, and scanline cut directly over the text.
- **Physical Phosphor Glass Inset Snapping ([`src/index.css`](file:///d:/Projects/SenseHack/src/index.css)):**
  - Snapped `.crt-tube-viewport` strictly to physical phosphor glass apexes ($X \in [204, 1672]$, $Y \in [183, 1244]$ in 2130x1420 space):
    - `left: 9.5775%`, `top: 12.8873%`, `width: 68.9202%`, `height: 74.7183%`.
- **Perimeter Scanline Alpha Feathering ([`src/index.css`](file:///d:/Projects/SenseHack/src/index.css)):**
  - Added `-webkit-mask-image: radial-gradient(ellipse 96% 94% at 50% 50%, black 86%, transparent 100%)` to `.crt-ch26-scanline-cut` and `.crt-ch26-rolling-bar`.
  - Scanlines and rolling hum-bars now dissolve smoothly into the dark tube groove without bleeding onto the outer plastic bezel.
- **Verification:**
  - `npm run build` passed with 0 errors in 26.38s.
  - Playwright visual capture at 1440x900:
    - [`verify-reflection-left.png`](file:///C:/Users/user/.gemini/antigravity/brain/62fae0a2-57b2-41b2-8c76-8d29cba083c3/verify-reflection-left.png): Left bezel reflection aligned precisely with "S".
    - [`verify-reflection-right.png`](file:///C:/Users/user/.gemini/antigravity/brain/62fae0a2-57b2-41b2-8c76-8d29cba083c3/verify-reflection-right.png): Right bezel amber bounce reflection aligned precisely with "'26".
    - [`verify-screen-full.png`](file:///C:/Users/user/.gemini/antigravity/brain/62fae0a2-57b2-41b2-8c76-8d29cba083c3/verify-screen-full.png): Full phosphor face showing clean glass groove boundary and zero scanline bleeding.

## Files Created or Modified
- `d:\Projects\SenseHack\src\components\Hero.tsx`
- `d:\Projects\SenseHack\src\index.css`
- `d:\Projects\SenseHack\PLAN.md`
- `d:\Projects\SenseHack\PROGRESS.md`
- `d:\Projects\SenseHack\walkthrough.md`
