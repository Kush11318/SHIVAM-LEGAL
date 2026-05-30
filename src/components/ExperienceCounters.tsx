'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS_DATA = [
  {
    target: 12,
    suffix: '+',
    label: 'Legal Projects',
    subtext: 'Drafts, agreements, and pleadings'
  },
  {
    target: 8,
    suffix: '+',
    label: 'Research Work',
    subtext: 'Precedent and case law analysis'
  },
  {
    target: 6,
    suffix: '+',
    label: 'Moot Activities',
    subtext: 'Rounds and committee rulings'
  },
  {
    target: 4,
    suffix: '+',
    label: 'Leadership Roles',
    subtext: 'Vice-president & In-charges'
  }
];

export default function ExperienceCounters() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState(STATS_DATA.map(() => 0));

  useEffect(() => {
    if (!containerRef.current) return;

    // We animate an object with properties representing counts
    const animObj = STATS_DATA.map(() => ({ val: 0 }));

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 85%',
      onEnter: () => {
        STATS_DATA.forEach((stat, index) => {
          gsap.to(animObj[index], {
            val: stat.target,
            duration: 2.0,
            ease: 'power3.out',
            onUpdate: () => {
              setCounts((prev) => {
                const copy = [...prev];
                copy[index] = Math.floor(animObj[index].val);
                return copy;
              });
            }
          });
        });
      }
    });

  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-6 py-12">
      {STATS_DATA.map((item, index) => {
        return (
          <div 
            key={index} 
            className="text-center p-6 border-b lg:border-b-0 lg:border-r border-[rgba(212,175,55,0.08)] last:border-0 relative overflow-hidden group"
          >
            {/* Soft backdrop glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(212,175,55,0.01)] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />

            {/* Glowing gold element in the corner */}
            <div className="absolute top-0 right-0 w-[4px] h-[4px] bg-neutral-900 border border-[#D4AF37] opacity-40" />

            {/* Animate-ready elegant number counter */}
            <div className="font-serif text-5xl md:text-6xl text-[#D4AF37] font-extralight tracking-tight mb-2 flex items-center justify-center">
              <span className="stat-number bg-gold-text">
                {counts[index]}
              </span>
              <span className="text-3xl md:text-4xl text-[#F3E5AB] font-light ml-1 select-none">
                {item.suffix}
              </span>
            </div>

            {/* Stat Label */}
            <h4 className="font-serif text-lg text-[#F8F5EE] tracking-widest uppercase font-medium mb-1">
              {item.label}
            </h4>

            {/* Stat subtext */}
            <p className="text-xs text-[#A0A0A0] font-sans font-light tracking-wider">
              {item.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
