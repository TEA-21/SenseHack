import React from 'react';
import { Terminal, Github, Linkedin, Instagram, Mail, ArrowUp } from 'lucide-react';
import { HACKATHON_CONFIG } from '../data/hackathonData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-crt-bg border-t border-crt-border text-crt-muted relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-crt-amber/10 border border-crt-amber/40 flex items-center justify-center text-crt-amber">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-display font-extrabold text-lg text-white tracking-wider">
                SENSE HACK &apos;26
              </span>
            </div>

            <p className="text-xs sm:text-sm text-crt-muted max-w-sm leading-relaxed">
              36-Hour Premier National Flagship Hardware &amp; Telemetry Hackathon. 
              Conducted by IEEE SB VIT &amp; IEEE ComSoc SB VIT student chapters in collaboration with the School of Electronics Engineering (SENSE) and Office of Students&apos; Welfare (DSW), VIT Vellore.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={HACKATHON_CONFIG.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-crt-card border border-crt-border flex items-center justify-center text-crt-muted hover:text-white hover:border-crt-amber transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <a
                href={HACKATHON_CONFIG.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-crt-card border border-crt-border flex items-center justify-center text-crt-muted hover:text-white hover:border-crt-amber transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={HACKATHON_CONFIG.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-crt-card border border-crt-border flex items-center justify-center text-crt-muted hover:text-white hover:border-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${HACKATHON_CONFIG.socialLinks.email}`}
                className="w-8 h-8 rounded-lg bg-crt-card border border-crt-border flex items-center justify-center text-crt-muted hover:text-white hover:border-amber-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-white font-semibold mb-4">
              Terminal Navigation
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <a href="#hero" className="hover:text-crt-amber transition-colors">Hero Command</a>
              </li>
              <li>
                <a href="#about" className="hover:text-crt-amber transition-colors">About IEEE &amp; SENSE</a>
              </li>
              <li>
                <a href="#tracks" className="hover:text-crt-amber transition-colors">7 Innovation Tracks</a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-crt-amber transition-colors">36-Hour Schedule</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-crt-amber transition-colors">Gallery &amp; Stats</a>
              </li>
              <li>
                <a href="#forms" className="hover:text-crt-amber transition-colors">Requisition Desk</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-crt-amber transition-colors">Operational FAQs</a>
              </li>
            </ul>
          </div>

          {/* Venue & Coordinates */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-white font-semibold mb-4">
              Event Command Post
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <p className="text-white font-semibold">{HACKATHON_CONFIG.venue}</p>
              <p className="text-crt-muted leading-relaxed">
                Vellore Institute of Technology, Katpadi, Vellore, Tamil Nadu 632014
              </p>
              <div className="pt-2">
                <span className="crt-badge border-crt-amber/30 bg-crt-amber/10 text-crt-amber text-[10px]">
                  COORDINATES // 12.9698° N, 79.1559° E
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Back to Top */}
        <div className="pt-8 border-t border-crt-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-crt-muted">
            <span>&copy; {new Date().getFullYear()} Sense Hack &apos;26. Built with precision for</span>
            <span className="text-white font-semibold">IEEE VIT &amp; ComSoc</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-crt-card border border-crt-border hover:border-crt-amber text-crt-muted hover:text-white transition-all text-xs"
          >
            <span>Top of Page</span>
            <ArrowUp className="w-3.5 h-3.5 text-crt-amber" />
          </button>
        </div>

      </div>
    </footer>
  );
};
