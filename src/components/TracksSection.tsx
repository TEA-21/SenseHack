import React, { useState } from 'react';
import { Cpu, Shield, Radio, Zap, Activity, Binary, Sparkles, ChevronRight, X, Layers, Lightbulb } from 'lucide-react';
import { TRACKS, Track } from '../data/hackathonData';

export const TracksSection: React.FC = () => {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const getTrackIcon = (iconName: string, className = "w-6 h-6") => {
    switch (iconName) {
      case 'Shield':
        return <Shield className={className} />;
      case 'Radio':
        return <Radio className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Activity':
        return <Activity className={className} />;
      case 'Binary':
        return <Binary className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Cpu':
      default:
        return <Cpu className={className} />;
    }
  };

  return (
    <section id="tracks" className="py-20 bg-crt-surface/50 border-b border-crt-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crt-amber/10 border border-crt-amber/30 text-crt-amber font-mono text-xs uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>7 Innovation Vectors</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            Target Your <span className="text-crt-amber">Engineering Track</span>
          </h2>
          <p className="mt-4 text-crt-muted text-sm sm:text-base leading-relaxed">
            Select one primary track for your prototype. Each track offers tailored judging criteria, 
            exclusive hardware requisitions, and specialized industry jury evaluation.
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {TRACKS.map((track) => (
            <div
              key={track.id}
              onClick={() => setSelectedTrack(track)}
              className="rounded-2xl bg-crt-card border border-crt-border p-6 hover:border-crt-amber/50 transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:shadow-glow-subtle hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-crt-amber px-2 py-0.5 rounded bg-crt-amber/10 border border-crt-amber/20">
                    TRACK {track.number}
                  </span>
                  <div className="p-2.5 rounded-xl bg-crt-surface border border-crt-border text-crt-amber group-hover:text-black group-hover:bg-crt-amber transition-all">
                    {getTrackIcon(track.iconName, "w-5 h-5")}
                  </div>
                </div>

                <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-crt-amber transition-colors">
                  {track.title}
                </h3>
                <p className="text-crt-muted text-xs leading-relaxed mb-4">
                  {track.tagline}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {track.techStack.slice(0, 3).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded font-mono text-[10px] text-crt-muted bg-crt-surface border border-crt-border"
                    >
                      {tech}
                    </span>
                  ))}
                  {track.techStack.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded font-mono text-[10px] text-crt-amber-text bg-crt-amber/10 border border-crt-amber/20">
                      +{track.techStack.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-crt-border/50 flex items-center justify-between text-xs font-mono text-crt-muted group-hover:text-crt-amber transition-colors">
                <span>View Challenge Ideas</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Selected Track Detail Modal */}
        {selectedTrack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="bg-crt-card border border-crt-border max-w-2xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedTrack(null)}
                className="absolute top-5 right-5 p-2 rounded-lg text-crt-muted hover:text-white hover:bg-crt-surface transition-colors"
                aria-label="Close track details"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs font-bold text-crt-amber px-2.5 py-1 rounded bg-crt-amber/10 border border-crt-amber/30">
                  TRACK {selectedTrack.number}
                </span>
                <div className="p-2 rounded-lg bg-crt-surface border border-crt-border text-crt-amber">
                  {getTrackIcon(selectedTrack.iconName, "w-5 h-5")}
                </div>
              </div>

              <h3 className="font-display font-extrabold text-2xl text-white mb-2">
                {selectedTrack.title}
              </h3>
              <p className="text-crt-amber-text font-mono text-xs mb-6">
                {selectedTrack.tagline}
              </p>

              <div className="mb-6">
                <h4 className="font-mono text-xs uppercase tracking-wider text-crt-muted mb-2 font-semibold">
                  Track Scope &amp; Focus:
                </h4>
                <p className="text-crt-phosphor text-sm leading-relaxed">
                  {selectedTrack.description}
                </p>
              </div>

              {/* Challenge Ideas */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3 text-xs font-mono text-crt-amber uppercase font-semibold">
                  <Lightbulb className="w-4 h-4" />
                  <span>Exemplar Problem Statements &amp; Ideas:</span>
                </div>
                <div className="space-y-2.5">
                  {selectedTrack.challengeIdeas.map((idea, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-crt-surface border border-crt-border text-xs sm:text-sm text-crt-phosphor">
                      <span className="text-crt-amber font-mono font-bold">0{idx + 1}.</span>
                      <span className="leading-snug">{idea}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Technologies */}
              <div className="mb-6">
                <h4 className="font-mono text-xs uppercase tracking-wider text-crt-muted mb-2 font-semibold">
                  Recommended Hardware &amp; Toolchains:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTrack.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md font-mono text-xs text-crt-amber-text bg-crt-amber/10 border border-crt-amber/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-crt-border flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedTrack(null)}
                  className="px-6 py-2.5 rounded-xl font-mono text-xs uppercase font-bold bg-crt-amber text-black hover:bg-amber-400 transition-colors"
                >
                  Close Brief
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
