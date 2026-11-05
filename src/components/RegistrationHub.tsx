import React from 'react';
import { Users, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { HACKATHON_CONFIG } from '../data/hackathonData';

export const RegistrationHub: React.FC = () => {
  return (
    <section id="register" className="py-20 bg-crt-bg border-b border-crt-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crt-amber/10 border border-crt-amber/30 text-crt-amber font-mono text-xs uppercase tracking-wider mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>Dual Registration Channels</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            Reserve Your Terminal for <br />
            <span className="text-crt-amber">Sense Hack &apos;26</span>
          </h2>
          <p className="mt-4 text-crt-muted text-sm sm:text-base leading-relaxed">
            Select the appropriate registration pathway based on your institutional affiliation. 
            Both internal and external participant slots are subject to technical abstract screening.
          </p>
        </div>

        {/* Dual Cards Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Card 1: Internal VIT Students */}
          <div className="rounded-2xl bg-crt-card border border-crt-border p-8 flex flex-col justify-between hover:border-crt-amber/50 transition-all shadow-xl group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="crt-badge border-crt-amber/40 bg-crt-amber/10 text-crt-amber">
                  Channel A // Internal
                </span>
                <span className="font-mono text-xs text-crt-muted">VIT Vellore Campus</span>
              </div>

              <h3 className="font-display font-bold text-2xl text-white mb-2 group-hover:text-crt-amber transition-colors">
                VIT Vellore Students
              </h3>
              <p className="text-crt-muted text-sm mb-6 leading-relaxed">
                Direct registration for currently enrolled VIT Vellore undergraduate and postgraduate students. 
                Fast-track clearance using your official VTOP registration number.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  'Free admission for validated VIT student teams',
                  'Team size: 2 to 4 members (inter-department allowed)',
                  'Direct access to SENSE hardware labs & measurement rigs',
                  'Verified On-Duty (OD) attendance provided for all 36 hours',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-crt-phosphor">
                    <CheckCircle2 className="w-4 h-4 text-crt-amber flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <a
                href={HACKATHON_CONFIG.registrationLinks.internalVit}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-mono text-xs uppercase font-bold tracking-wider bg-crt-amber text-black hover:bg-amber-400 transition-all shadow-glow-amber"
              >
                <span>Register via Internal Form</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-[11px] font-mono text-crt-muted text-center mt-2.5">
                Requires official @vitstudent.ac.in authentication
              </p>
            </div>
          </div>

          {/* Card 2: External Non-VIT Participants */}
          <div className="rounded-2xl bg-crt-card border border-crt-border p-8 flex flex-col justify-between hover:border-crt-amber/50 transition-all shadow-xl group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="crt-badge border-crt-amber-text/40 bg-crt-amber/10 text-crt-amber-text">
                  Channel B // National
                </span>
                <span className="font-mono text-xs text-crt-muted">All India Universities</span>
              </div>

              <h3 className="font-display font-bold text-2xl text-white mb-2 group-hover:text-crt-amber-text transition-colors">
                External College Delegates
              </h3>
              <p className="text-crt-muted text-sm mb-6 leading-relaxed">
                National portal for students representing engineering colleges, IITs, NITs, and universities across India. 
                Processed via the centralized VIT Events gateway.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  'Official VIT Events clearance and visitor smart passes',
                  'On-campus hostel accommodation (separate boys/girls wings)',
                  'All meals, midnight buffets, high tea & snacks included',
                  'Hardware requisition support & mentorship from top tech giants',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-crt-phosphor">
                    <CheckCircle2 className="w-4 h-4 text-crt-amber-text flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <a
                href={HACKATHON_CONFIG.registrationLinks.externalParticipants}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-mono text-xs uppercase font-bold tracking-wider bg-crt-surface border border-crt-amber text-crt-amber hover:bg-crt-amber hover:text-black transition-all shadow-glow-amber"
              >
                <span>Register on VIT Events Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-[11px] font-mono text-crt-muted text-center mt-2.5">
                Make sure to also fill the Accommodation Form in our Requisition Desk
              </p>
            </div>
          </div>

        </div>

        {/* Regulatory & Guidelines Notice Banner */}
        <div className="rounded-xl bg-crt-surface border border-crt-border p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 text-xs font-mono text-crt-muted">
          <div className="flex items-center gap-2 text-crt-amber flex-shrink-0 font-bold uppercase">
            <AlertCircle className="w-4 h-4" />
            <span>Important Protocol:</span>
          </div>
          <p className="text-center sm:text-left leading-relaxed">
            All teams must bring valid College Photo ID cards. Shortlisted teams will receive official technical clearance and laboratory bench assignments 72 hours prior to the event.
          </p>
        </div>

      </div>
    </section>
  );
};
