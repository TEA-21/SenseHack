import React, { useState } from 'react';
import { Menu, X, Terminal, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  isVisible: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isVisible }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Register', href: '#register' },
    { label: 'About', href: '#about' },
    { label: 'Tracks', href: '#tracks' },
    { label: 'Schedule', href: '#schedule' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Requisition', href: '#forms' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-crt-bg/95 backdrop-blur-md border-b border-crt-border shadow-lg shadow-black/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand mark & Beacon */}
          <div className="flex items-center gap-3">
            <a href="#hero" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-crt-amber/10 border border-crt-amber/40 flex items-center justify-center text-crt-amber group-hover:border-crt-amber transition-colors">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm tracking-wider text-white group-hover:text-crt-amber transition-colors">
                  SENSE HACK &apos;26
                </span>
                <span className="font-mono text-[10px] text-crt-muted -mt-0.5 tracking-tight">
                  IEEE VIT &bull; COMSOC
                </span>
              </div>
            </a>

            {/* Live System Beacon */}
            <div className="hidden sm:flex items-center gap-1.5 ml-3 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-[10px] uppercase font-semibold text-emerald-400 tracking-wider">
                System Live
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-wider text-crt-muted hover:text-crt-amber transition-colors py-1 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-crt-amber transition-all duration-200 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#register"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-xs uppercase font-bold tracking-wider bg-crt-amber text-black hover:bg-amber-400 transition-all shadow-glow-amber hover:shadow-orange-500/50"
            >
              <span>Register Now</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-crt-muted hover:text-white hover:bg-crt-surface border border-transparent hover:border-crt-border focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-crt-surface/98 backdrop-blur-xl border-b border-crt-border px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-crt-border/50">
            <span className="font-mono text-[11px] text-crt-muted uppercase">Navigation Terminal</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-[10px] text-emerald-400">VIT Vellore</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded bg-crt-card border border-crt-border font-mono text-xs text-crt-phosphor hover:text-crt-amber hover:border-crt-amber/50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-2">
            <a
              href="#register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-mono text-xs uppercase font-bold bg-crt-amber text-black shadow-glow-amber"
            >
              <span>Register for Sense Hack '26</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
