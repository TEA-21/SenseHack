import React, { useState } from 'react';
import { Camera, TrendingUp, Maximize2, X, Filter } from 'lucide-react';
import { PAST_STATS, GALLERY_IMAGES, GalleryImage } from '../data/hackathonData';

export const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);

  const categories = ['All', 'Venue', 'Hacking', 'Mentorship', 'Valedictory'];

  const filteredImages = selectedCategory === 'All'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category === selectedCategory);

  return (
    <section id="gallery" className="py-20 bg-crt-bg border-b border-crt-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crt-amber/10 border border-crt-amber/30 text-crt-amber font-mono text-xs uppercase tracking-wider mb-4">
            <Camera className="w-3.5 h-3.5" />
            <span>Previous Edition Highlights</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            Sense Hack in Action. <br />
            <span className="text-crt-amber">
              The Legacy &amp; Visual Archive
            </span>
          </h2>
          <p className="mt-4 text-crt-muted text-sm sm:text-base leading-relaxed">
            Witness the intense overnight engineering and hands-on physical prototype demonstrations 
            from the previous national edition of Sense Hack held at Anna Auditorium, VIT Vellore.
          </p>
        </div>

        {/* Previous Edition Statistics Ribbon */}
        <div className="rounded-2xl bg-crt-card border border-crt-border p-6 sm:p-8 backdrop-blur-md mb-16 shadow-xl">
          <div className="flex items-center gap-2 mb-6 text-xs font-mono text-crt-amber uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Sense Hack Legacy Metrics &amp; Operational Scale</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {PAST_STATS.map((stat, sIdx) => (
              <div key={sIdx} className="flex flex-col items-center">
                <span className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                  {stat.value}
                </span>
                <span className="font-sans font-semibold text-xs sm:text-sm text-crt-phosphor mt-1">
                  {stat.label}
                </span>
                <span className="font-mono text-[11px] text-crt-muted">
                  {stat.sublabel}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-crt-muted mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Archive:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-crt-amber text-black font-bold shadow-glow-amber'
                  : 'bg-crt-card text-crt-muted border border-crt-border hover:border-crt-amber/50 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, idx) => (
            <div
              key={image.id}
              onClick={() => setActiveImage(image)}
              className={`group relative rounded-2xl overflow-hidden bg-crt-card border border-crt-border hover:border-crt-amber/60 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-orange-500/10 ${
                idx === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-crt-amber-text uppercase font-semibold">
                    {image.category}
                  </span>
                </div>

                {/* Maximize Icon */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-crt-amber text-black shadow-lg">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>

                {/* Caption & Title */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 text-left">
                  <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-crt-amber transition-colors">
                    {image.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1 line-clamp-2 leading-relaxed font-sans">
                    {image.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveImage(null)}
        >
          <div 
            className="relative max-w-5xl w-full bg-crt-card border border-crt-border rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-crt-border bg-crt-surface">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-crt-amber/20 text-crt-amber font-mono text-xs font-bold uppercase">
                  {activeImage.category}
                </span>
                <span className="font-display font-bold text-white text-base sm:text-lg">
                  {activeImage.title}
                </span>
              </div>
              <button
                onClick={() => setActiveImage(null)}
                className="p-1.5 rounded-lg bg-crt-surface text-crt-muted hover:text-white hover:bg-crt-card transition-colors"
                aria-label="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative max-h-[75vh] overflow-hidden flex items-center justify-center bg-black/80">
              <img
                src={activeImage.src}
                alt={activeImage.title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Modal Caption */}
            <div className="p-4 sm:p-6 bg-crt-surface border-t border-crt-border">
              <p className="text-sm text-crt-muted leading-relaxed font-sans">
                {activeImage.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
