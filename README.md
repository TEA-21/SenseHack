# Sense Hack '26

> The flagship annual hackathon presented by **IEEE-VIT** in collaboration with **IEEE ComSoc**.

Sense Hack '26 brings together engineers, designers, and innovators to build cutting-edge solutions across hardware, software, AI, and telecommunications. The web platform features an authentic, interactive vintage CRT television console landing experience built with precision analog simulation.

---

> [!CAUTION]
> ### ⚠️ CRITICAL NOTICE FOR ALL CONTRIBUTORS: DO NOT TOUCH THE HERO / CRT TV
> 
> **The Hero section and all CRT television subsystems are 100% feature-complete, physically calibrated, and strictly LOCKED.**
> 
> **DO NOT MODIFY:**
> - `src/components/Hero.tsx`
> - Any `.crt-*` classes or optical filters in `src/index.css`
> - Base TV plate and knob assets in `public/` (`crt-full-tight.png`, `tuning-knob-cap.png`, `volume-knob-cap.png`)
> 
> **Why is this locked?**
> The CRT console relies on high-precision mathematical calibrations:
> 1. **Sub-Pixel Squircle Masking:** Bezier control points calibrated to $0.005$ tolerances fitting the physical inner shadow groove of the chassis.
> 2. **Endpoint-Pinned Parabolic Warp:** Parabolic barrel distortion ($dy = (0.55 - 0.40v)(1 - u^2)$) mathematically pinned at $u = \pm 1$ to align 1:1 with baked plastic bezel reflections.
> 3. **Rotary Hardware Optics:** Knob rotation centers calculated to exact photographic cylinder axes ($86.21\%$).
> 4. **Optical Filters & Audio:** Hardware-accelerated SVG displacement maps, dynamic channel bounce-light attenuation, and real-time Web Audio API analog cathode frequency synthesizers.
> 
> Any edits to these files risk desynchronizing bezel reflections, tearing displacement maps, causing raster leakage, or breaking rotary mechanical alignment.
> 
> **Work on all other sections is warmly welcomed!**

---

## 🛠️ Areas Open for Contribution

All other sections of the website are modular and ready for features, styling enhancements, and content updates:

| Section | Component File | Description |
| :--- | :--- | :--- |
| **Navigation** | `src/components/Navbar.tsx` | Sticky desktop & mobile header, anchor links, brand badges. |
| **Overview Deck** | `src/components/OverviewDeck.tsx` | Event summary, key metrics, mission statement, target audience. |
| **Tracks** | `src/components/TracksSection.tsx` | Hackathon problem statements, challenge tracks, prize pools. |
| **Schedule** | `src/components/ScheduleSection.tsx` | Interactive timeline, workshop agendas, submission deadlines. |
| **Registration Hub** | `src/components/RegistrationHub.tsx` | Registration tiers, eligibility criteria, portal redirection. |
| **Application Forms** | `src/components/FormsSection.tsx` | Participant applications, team formation, project submissions. |
| **Gallery** | `src/components/GallerySection.tsx` | Photographic highlights from previous editions. |
| **About IEEE** | `src/components/AboutSection.tsx` | Information regarding IEEE-VIT and IEEE ComSoc chapters. |
| **FAQs** | `src/components/FaqSection.tsx` | Accordion for frequently asked questions, rules, and guidelines. |
| **Footer** | `src/components/Footer.tsx` | Social media channels, sponsor links, contact info, copyright. |

---

## 🚀 Tech Stack

- **Framework:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + PostCSS + Autoprefixer
- **Icons:** [Lucide React](https://lucide.dev/)
- **Typography:** Space Grotesk (display), Plus Jakarta Sans (body), JetBrains Mono (code/telemetry)
- **Audio / Graphics:** Web Audio API, Canvas 2D, SVG Filters & Displacement Mapping

---

## 📦 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (version 18 or higher) and `npm` installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/TEA-21/SenseHack.git
   cd SenseHack
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build locally:**
   ```bash
   npm run preview
   ```

---

## 📁 Repository Structure

```
SenseHack/
├── public/                     # Static assets & gallery images
│   ├── gallery/                # Event photography from past editions
│   ├── crt-full-tight.png      # [LOCKED] Master CRT television base plate
│   ├── tuning-knob-cap.png     # [LOCKED] Photographic tuning rotary dial cap
│   └── volume-knob-cap.png     # [LOCKED] Photographic volume rotary dial cap
├── src/
│   ├── components/             # React UI components
│   │   ├── Hero.tsx            # [LOCKED] Vintage CRT Television Experience
│   │   ├── Navbar.tsx          # Navigation header
│   │   ├── OverviewDeck.tsx    # Hackathon overview & statistics
│   │   ├── TracksSection.tsx   # Domain tracks & challenges
│   │   ├── ScheduleSection.tsx # Event timeline & milestones
│   │   ├── RegistrationHub.tsx # Registration information & entry points
│   │   ├── FormsSection.tsx    # Application and registration forms
│   │   ├── GallerySection.tsx  # Interactive photo showcase
│   │   ├── AboutSection.tsx    # About IEEE-VIT & IEEE ComSoc
│   │   ├── FaqSection.tsx      # Frequently asked questions
│   │   └── Footer.tsx          # Footer & links
│   ├── App.tsx                 # Root layout & component assembly
│   ├── index.css               # Tailwind directives & CRT optical styling
│   └── main.tsx                # React DOM entry point
├── package.json
├── tailwind.config.js          # Custom colors, fonts, and shadow tokens
├── tsconfig.json
└── vite.config.ts
```

---

## 🎨 Design Tokens & Guidelines

- **Primary Amber Tone:** `#ff5e00` / `#ff9d00` (vintage CRT phosphor glow)
- **Background Tone:** `#08080a` (hardware-lab dark room vignette)
- **Surface Cards:** `rgba(19, 19, 24, 0.85)` with `backdrop-filter: blur(12px)`
- **Border Highlights:** `rgba(255, 255, 255, 0.07)` hover to `rgba(255, 94, 0, 0.4)`
- **Monospace Accent:** JetBrains Mono for system telemetry, metrics, and terminal prompts

When contributing, ensure all UI components adhere to the hardware-lab aesthetic and test responsive layouts across mobile, tablet, and desktop viewports. Always run `npm run build` prior to opening a Pull Request.

---

## 📄 License

This repository is maintained by **IEEE-VIT** and **IEEE ComSoc**. All rights reserved.
