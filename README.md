# SenseHack '26 — Website

A cinematic Three.js opening followed by a responsive event website. Built with Vite, Three.js and Lenis.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

## Before publishing — required content

### 1. Registration URLs

Open `src/config.js` and add the four official Google Form URLs:

- `vitEvent`
- `vitHardware`
- `externalEvent`
- `externalHardware`

The buttons intentionally do not point to invented forms. They display a setup message until real URLs are added.

### 2. Previous SenseHack photographs

The gallery is chapter 04 of the cinematic intro (between "By the numbers" and "Signal lost"). It currently shows six **placeholder photos** in `public/images/gallery/01.jpg` … `06.jpg`.

To use real photos, drop approved event images over those six files (landscape, 4:3 works best, ~1200×900, JPEG/WebP). To change a title or caption, edit the `data-title`, `data-sub`, `data-note` and `alt` attributes on the matching `.gal-card` in `index.html`. To add or remove photos, add/remove a `.gal-card` and a `<i></i>` in `.gal-ticks`; the scroll choreography adapts automatically.

How long the gallery lasts is set by `GALLERY_VH` in `src/lib/timeline.js`.

### 3. Partner logos

The partner marquee currently uses typographic placeholders so that no unofficial or incorrect logos are published. Replace the text marks in `index.html` with the six official transparent logo files when supplied. Keep the duplicated set for a seamless marquee loop and add descriptive `alt` text to each image.

### 4. Track copy

The seven track descriptions and focus areas are the supplied draft copy. Confirm each against the official track briefs before publishing.

## Query form email delivery (Vercel)

The FAQ query form submits to `api/send-query.js`, a Vercel serverless function. It sends email to `ieee@vit.ac.in` through Resend and uses the visitor's email as `Reply-To`.

1. Create/verify a sending domain in Resend.
2. Create a Resend API key.
3. In Vercel → Project → Settings → Environment Variables, set:
   - `RESEND_API_KEY` — your secret Resend API key.
   - `RESEND_FROM_EMAIL` — a sender address on the verified domain, e.g. `SenseHack Website <website@your-domain.com>`.
4. Redeploy the project after adding the variables.
5. Submit a test query and confirm it arrives at `ieee@vit.ac.in`.

The form reports a delivery error if the server is not configured or Resend rejects the message; it never claims a message was sent when delivery failed. Local Vite preview does not run Vercel functions. Use `vercel dev` to test the API locally with the environment variables configured.

## Deployment

Import the project into Vercel. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`. Vercel automatically detects and deploys the `api/` serverless function.

## Main structure

```text
index.html              Page structure and all website sections
src/main.js             Three.js intro choreography
src/styles.css          Intro and responsive website styles
src/config.js           Official registration form URLs
src/lib/timeline.js     Scroll timeline (splices the gallery hold into the intro)
src/ui/site.js          Track disk interaction, FAQ and query form
src/ui/shell.js         Smooth navigation and mobile menu
src/scene/              Three.js TV, space world and post-processing
api/send-query.js       Vercel email-delivery endpoint
```
