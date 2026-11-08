# Sense Hack '26 — landing

Retro CRT hero built with Three.js and Vite.

## Run

```
npm install
npm run dev
```

Open http://localhost:5173

## Build

```
npm run build
npm run preview
```

## Structure

```
index.html            page markup (nav, chapter text, boot screen)
src/main.js           wires everything: renderer, scroll choreography, input
src/styles.css        all styles
src/scene/tv.js       the CRT TV, its screen and channels
src/scene/world.js    the world inside the TV: tunnel, planets, disks, beam
src/scene/props.js    planet, floppy and CD builders
src/scene/post.js     grain, glitch and CRT post-processing
src/ui/shell.js       smooth scroll, menu, chapter rail, toasts
src/ui/layers.js      chapter text that fades in and out with scroll
src/ui/boot.js        boot screen
src/ui/countdown.js   event countdown (December 9, 2026, 08:00 IST)
src/ui/cursor.js      custom cursor and hover labels
src/lib/utils.js      shared helpers and textures
```
