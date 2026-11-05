import React from 'react';
import { Cpu, Radio, ShieldCheck, Zap, Globe, Award } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-crt-bg border-b border-crt-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crt-amber/10 border border-crt-amber/30 text-crt-amber font-mono text-xs uppercase tracking-wider mb-4">
            <Globe className="w-3.5 h-3.5" />
            <span>Conducted By Student Chapters</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            Conducted by <span className="text-crt-amber">IEEE SB VIT</span> &amp; <span className="text-crt-amber-text">IEEE ComSoc SB VIT</span>
          </h2>
          <p className="mt-4 text-crt-muted text-sm sm:text-base leading-relaxed">
            Sense Hack is organized collaboratively by two student chapters at VIT Vellore: IEEE Student Branch (IEEE SB VIT) 
            and IEEE Communications Society Student Branch Chapter (IEEE ComSoc SB VIT), in collaboration with the School of 
            Electronics Engineering (SENSE), Office of Students&apos; Welfare (DSW), and IEEE Madras Section SAC.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Card 1: IEEE SB VIT */}
          <div className="rounded-2xl bg-crt-card border border-crt-border p-7 hover:border-crt-amber/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-crt-amber/10 border border-crt-amber/30 flex items-center justify-center text-crt-amber mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                IEEE SB VIT (Student Branch)
              </h3>
              <p className="text-crt-muted text-xs sm:text-sm leading-relaxed mb-4">
                The premier student branch of IEEE at VIT Vellore. Empowering engineering undergraduates through cutting-edge 
                technical workshops, national-level innovation sprints, open-source hardware, and student leadership across Region 10.
              </p>
            </div>
            <div className="pt-4 border-t border-crt-border/60 font-mono text-[11px] text-crt-amber">
              ORGANIZING STUDENT CHAPTER &bull; VIT VELLORE
            </div>
          </div>

          {/* Card 2: IEEE ComSoc SB VIT */}
          <div className="rounded-2xl bg-crt-card border border-crt-border p-7 hover:border-crt-amber-text/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-crt-amber-text/10 border border-crt-amber-text/30 flex items-center justify-center text-crt-amber-text mb-6 group-hover:scale-110 transition-transform">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                IEEE ComSoc SB VIT (Chapter)
              </h3>
              <p className="text-crt-muted text-xs sm:text-sm leading-relaxed mb-4">
                The specialized IEEE Communications Society Student Branch Chapter at VIT Vellore. Dedicated to advancing wireless communication, 
                IoT telemetry, RF circuits, networking, and digital signal architectures among student innovators.
              </p>
            </div>
            <div className="pt-4 border-t border-crt-border/60 font-mono text-[11px] text-crt-amber-text">
              ORGANIZING STUDENT CHAPTER &bull; VIT VELLORE
            </div>
          </div>

          {/* Card 3: Collaborating School & Welfare */}
          <div className="rounded-2xl bg-crt-card border border-crt-border p-7 hover:border-amber-400/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                SENSE &amp; Office of Students&apos; Welfare
              </h3>
              <p className="text-crt-muted text-xs sm:text-sm leading-relaxed mb-4">
                In close collaboration with the School of Electronics Engineering (SENSE) providing advanced hardware laboratory access, 
                and the Office of Students&apos; Welfare (DSW) facilitating venue logistics, hostel accommodations, and hospitality.
              </p>
            </div>
            <div className="pt-4 border-t border-crt-border/60 font-mono text-[11px] text-amber-400">
              COLLABORATING SCHOOL &amp; DSW VIT
            </div>
          </div>

        </div>

        {/* Core Values Strip */}
        <div className="p-6 rounded-2xl bg-crt-surface border border-crt-border grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-crt-card border border-crt-border text-crt-amber">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-white">Student-Led Flagship</h4>
              <p className="text-[11px] text-crt-muted">Conducted with passion by IEEE SB VIT and IEEE ComSoc SB VIT chapters.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-crt-card border border-crt-border text-crt-amber-text">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-white">Distinguished Alumni Mentors</h4>
              <p className="text-[11px] text-crt-muted">Direct technical guidance from Google, DRDO, Micron, Broadcom &amp; GE.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-crt-card border border-crt-border text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-white">SENSE Lab Infrastructure</h4>
              <p className="text-[11px] text-crt-muted">Complete access to oscilloscopes, power benches, sensors &amp; development kits.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
