import React, { useEffect, useState } from 'react';
import { ArrowRight, Calendar, MapPin, Sparkles, Terminal } from 'lucide-react';
import { HACKATHON_CONFIG } from '../data/hackathonData';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const OverviewDeck: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(HACKATHON_CONFIG.startDateIso).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="overview" className="py-16 bg-crt-bg border-b border-crt-border relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Edition Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-crt-amber/10 border border-crt-amber/30 backdrop-blur-md mb-6 shadow-glow-subtle">
          <Sparkles className="w-3.5 h-3.5 text-crt-amber" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-crt-amber">
            36-Hour Premier National Flagship Hackathon
          </span>
        </div>

        {/* Grounded Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-crt-muted font-sans font-normal mb-8 leading-relaxed">
          36 hours of rigorous embedded prototyping, hardware verification, 
          and communication systems engineering at Anna Auditorium, VIT Vellore.
        </p>

        {/* Key Event Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-10 text-xs sm:text-sm font-mono text-crt-phosphor">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-crt-surface border border-crt-border">
            <Calendar className="w-4 h-4 text-crt-amber" />
            <span>{HACKATHON_CONFIG.dates}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-crt-surface border border-crt-border">
            <MapPin className="w-4 h-4 text-crt-amber" />
            <span>{HACKATHON_CONFIG.venue}</span>
          </div>
        </div>

        {/* Live Countdown Clock */}
        <div className="max-w-xl mx-auto grid grid-cols-4 gap-2 sm:gap-4 mb-10">
          {[
            { label: 'DAYS', value: timeLeft.days },
            { label: 'HOURS', value: timeLeft.hours },
            { label: 'MINUTES', value: timeLeft.minutes },
            { label: 'SECONDS', value: timeLeft.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-4 rounded-xl bg-crt-card border border-crt-border backdrop-blur-md shadow-lg flex flex-col items-center justify-center group hover:border-crt-amber/50 transition-colors"
            >
              <span className="font-mono font-bold text-2xl sm:text-4xl text-crt-phosphor group-hover:text-crt-amber transition-colors">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="font-mono text-[10px] sm:text-xs text-crt-muted font-semibold tracking-widest mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-mono text-sm uppercase font-bold tracking-wider bg-crt-amber text-black hover:bg-amber-400 transition-all shadow-glow-amber transform hover:-translate-y-0.5"
          >
            <span>Register Your Team</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#tracks"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-mono text-sm uppercase font-semibold tracking-wider bg-crt-surface text-crt-phosphor hover:text-white border border-crt-border hover:border-crt-amber/50 transition-all backdrop-blur-md transform hover:-translate-y-0.5"
          >
            <span>Explore 7 Tracks</span>
          </a>

          <a
            href="#forms"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-mono text-sm uppercase font-semibold tracking-wider bg-crt-surface text-crt-muted hover:text-crt-amber border border-crt-border hover:border-crt-amber/40 transition-all backdrop-blur-md transform hover:-translate-y-0.5"
          >
            <Terminal className="w-4 h-4" />
            <span>Hardware Desk</span>
          </a>
        </div>
      </div>
    </section>
  );
};
