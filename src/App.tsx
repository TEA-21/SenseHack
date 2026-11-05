import { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { OverviewDeck } from './components/OverviewDeck';
import { RegistrationHub } from './components/RegistrationHub';
import { AboutSection } from './components/AboutSection';
import { TracksSection } from './components/TracksSection';
import { ScheduleSection } from './components/ScheduleSection';
import { GallerySection } from './components/GallerySection';
import { FormsSection } from './components/FormsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';

export default function App() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    // IntersectionObserver for Navbar slide-in when hero is mostly scrolled past
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setIsNavbarVisible(entry.intersectionRatio < 0.15);
      },
      {
        threshold: [0, 0.15],
      }
    );

    observer.observe(heroEl);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-crt-bg text-crt-phosphor flex flex-col font-sans selection:bg-crt-amber selection:text-black">
      {/* Dynamic Slide-in Navbar */}
      <Navbar isVisible={isNavbarVisible} />

      {/* Main Content Flow */}
      <main className="flex-grow">
        {/* Vintage CRT Hero Landing */}
        <div ref={heroRef}>
          <Hero />
        </div>

        {/* Overview Deck with Live Countdown & Quick Event Details */}
        <OverviewDeck />

        {/* Dual Registration Hub (Internal VIT Google Form & External VIT Events Portal) */}
        <RegistrationHub />

        {/* About IEEE SB VIT & IEEE ComSoc SB VIT */}
        <AboutSection />

        {/* 7 Innovation Tracks with Deep Problem Statements */}
        <TracksSection />

        {/* 36-Hour 4-Phase Schedule Timeline */}
        <ScheduleSection />

        {/* Previous Sense Hack Edition: Legacy Statistics & Photo Archive */}
        <GallerySection />

        {/* Actionable Hardware Requisition & Accommodation Forms */}
        <FormsSection />

        {/* Operational FAQ Accordion */}
        <FaqSection />
      </main>

      {/* Telemetry Footer */}
      <Footer />
    </div>
  );
}
