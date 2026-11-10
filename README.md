# SenseHack '26

Official website for **SenseHack '26**, a 36-hour national flagship hackathon hosted at **Anna Auditorium, VIT Vellore** on **9–10 December 2026**.

**Live site:** https://sensehack26.vercel.app/

---

## Table of contents

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Contact](#contact)

---

## Tech stack

| Area | Tools |
| --- | --- |
| Build | [Vite](https://vitejs.dev/) 5 |
| 3D and post-processing | [Three.js](https://threejs.org/) 0.160 |
| Smooth scroll | [Lenis](https://lenis.darkroom.engineering/) 1.1 |
| Server function | Vercel Serverless Function + [Resend](https://resend.com/) |
| Language | Vanilla JavaScript (ES modules), HTML, CSS |

Node.js 18 or newer is recommended.

## Getting started

```bash
# install dependencies
npm install

# start the dev server
npm run dev

# production build (outputs to dist/)
npm run build

# preview the production build locally
npm run preview
```

The Vite dev server does not run the `api/` function. To test the query form end to end, use `vercel dev` with the environment variables set (see below).

## Project structure

```text
index.html               Page markup and all website sections
api/
  send-query.js          Vercel serverless function: sends query emails via Resend
public/
  images/                Logo, partner logos, gallery photos
  tv/                    Media shown on the in-scene TV (aftermovie, photos)
  fonts/                 Optional custom fonts (see public/fonts/README.txt)
src/
  main.js                Intro choreography and render loop
  config.js              Registration links and contact email
  data.js, data/         Stats, track and gallery content
  styles.css             All styles (intro and website)
  lib/                   Timeline and utilities
  scene/                 Three.js TV, world, props, channels, post-processing
  ui/                    Boot screen, countdown, cursor, navigation, tracks,
                         FAQ/query form, sound, layers
```


## Contact

Questions about the event: **ieee@vit.ac.in**

---
