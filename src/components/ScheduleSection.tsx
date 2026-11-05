import React, { useState } from 'react';
import { Clock, Coffee, Cpu, Users, Award, Sparkles } from 'lucide-react';
import { SCHEDULE_PHASES, ScheduleMilestone } from '../data/hackathonData';

export const ScheduleSection: React.FC = () => {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const activePhase = SCHEDULE_PHASES[activePhaseIndex];

  const getMilestoneIcon = (type: ScheduleMilestone['type']) => {
    switch (type) {
      case 'mentoring':
        return <Users className="w-4 h-4 text-crt-amber-text" />;
      case 'food':
        return <Coffee className="w-4 h-4 text-amber-400" />;
      case 'ceremony':
        return <Award className="w-4 h-4 text-crt-amber" />;
      case 'activity':
        return <Sparkles className="w-4 h-4 text-amber-300" />;
      case 'milestone':
      default:
        return <Cpu className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getMilestoneBadge = (type: ScheduleMilestone['type']) => {
    switch (type) {
      case 'mentoring':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-300';
      case 'food':
        return 'border-amber-500/30 bg-amber-500/10 text-amber-400';
      case 'ceremony':
        return 'border-orange-500/30 bg-orange-500/10 text-orange-400';
      case 'activity':
        return 'border-amber-400/30 bg-amber-400/10 text-amber-300';
      case 'milestone':
      default:
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
    }
  };

  return (
    <section id="schedule" className="py-20 bg-crt-surface/40 border-b border-crt-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crt-amber/10 border border-crt-amber/30 text-crt-amber font-mono text-xs uppercase tracking-wider mb-4">
            <Clock className="w-3.5 h-3.5" />
            <span>36-Hour Continuous Timeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            The 4-Phase <span className="text-crt-amber">Battle Plan</span>
          </h2>
          <p className="mt-4 text-crt-muted text-sm sm:text-base leading-relaxed">
            From initial component requisition to the high-stakes stage pitch in Anna Auditorium. 
            Structured checkpoints keep your hardware development on schedule.
          </p>
        </div>

        {/* Phase Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {SCHEDULE_PHASES.map((phase, idx) => {
            const isActive = idx === activePhaseIndex;
            return (
              <button
                key={phase.phaseNumber}
                type="button"
                onClick={() => setActivePhaseIndex(idx)}
                className={`p-4 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between ${
                  isActive
                    ? 'bg-crt-card border-crt-amber shadow-glow-amber'
                    : 'bg-crt-card/50 border-crt-border hover:border-crt-borderLight hover:bg-crt-card'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-crt-muted">
                      Phase 0{phase.phaseNumber}
                    </span>
                    <span className="font-mono text-[10px] text-crt-amber font-semibold">
                      {phase.day.split(' ')[0]}
                    </span>
                  </div>
                  <h3 className={`font-display font-bold text-sm sm:text-base line-clamp-1 ${
                    isActive ? 'text-white' : 'text-crt-phosphor'
                  }`}>
                    {phase.phaseTitle}
                  </h3>
                </div>

                <span className="font-mono text-[11px] text-crt-muted mt-3">
                  {phase.timeWindow}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Phase Display Card */}
        <div className="rounded-2xl bg-crt-card border border-crt-border p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-crt-border/60 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-crt-amber font-bold uppercase">
                  Phase 0{activePhase.phaseNumber} // {activePhase.day}
                </span>
                <span className="text-crt-borderLight">&bull;</span>
                <span className="font-mono text-xs text-crt-amber-text">{activePhase.timeWindow}</span>
              </div>
              <h3 className="font-display font-extrabold text-2xl text-white">
                {activePhase.phaseTitle}
              </h3>
            </div>
            <p className="text-crt-muted text-xs sm:text-sm max-w-md">
              {activePhase.description}
            </p>
          </div>

          {/* Milestones Vertical Sequence */}
          <div className="space-y-4">
            {activePhase.milestones.map((m, mIdx) => (
              <div
                key={mIdx}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-crt-surface border border-crt-border hover:border-crt-borderLight transition-all gap-3"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="font-mono text-xs font-bold text-crt-amber min-w-[75px] py-1 px-2 rounded bg-crt-amber/10 border border-crt-amber/20 text-center">
                    {m.time}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm sm:text-base text-white">
                      {m.title}
                    </h4>
                    <p className="text-crt-muted text-xs sm:text-sm mt-0.5">
                      {m.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono uppercase font-semibold ${getMilestoneBadge(m.type)}`}>
                    {getMilestoneIcon(m.type)}
                    <span>{m.type}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
