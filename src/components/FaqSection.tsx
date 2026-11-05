import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';
import { FAQS } from '../data/hackathonData';

export const FaqSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = ['All', 'General', 'Teams & Eligibility', 'Hardware & Labs', 'Logistics & Accommodation'];

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 bg-crt-surface/40 border-b border-crt-border relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crt-amber/10 border border-crt-amber/30 text-crt-amber font-mono text-xs uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Operational FAQ &amp; Protocols</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            Frequently Asked <span className="text-crt-amber">Questions</span>
          </h2>
          <p className="mt-4 text-crt-muted text-sm sm:text-base leading-relaxed">
            Everything you need to know about eligibility, team configurations, laboratory hardware, and on-campus stay.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="w-5 h-5 text-crt-muted absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords (e.g. accommodation, components, team size, fee)..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-crt-card border border-crt-border text-white text-sm focus:border-crt-amber focus:outline-none placeholder-crt-muted/60 font-sans"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full font-mono text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-crt-amber text-black shadow-glow-amber'
                  : 'bg-crt-card border border-crt-border text-crt-muted hover:text-white hover:border-crt-borderLight'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion Items List */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl bg-crt-card border border-crt-border overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-crt-surface/50"
                  >
                    <span className="font-display font-semibold text-sm sm:text-base text-white">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-crt-amber flex-shrink-0 transition-transform duration-200 ${
                        isExpanded ? 'transform rotate-180 text-crt-amber' : 'text-crt-muted'
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-crt-muted font-sans leading-relaxed border-t border-crt-border/40 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-crt-muted font-mono text-xs">
              No matching questions found for &ldquo;{searchQuery}&rdquo;.
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
