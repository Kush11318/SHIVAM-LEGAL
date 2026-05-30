'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TIMELINE_DATA = [
  {
    period: '2022 - 2027',
    role: 'Academic Credentials',
    institution: 'Government New Law College (Devi Ahilya Vishwavidyalaya)',
    mentor: 'B.B.A LL.B (Hons.) Candidate',
    details: 'Pursuing a five-year integrated honors program. Excelling in constitutional law, contract drafting, legal theory, corporate laws, and litigation procedures.'
  },
  {
    period: '2023 - 2024',
    role: 'Moot Court Leadership',
    institution: 'Government New Law College, Indore',
    mentor: 'Moot Court Committee Member',
    details: 'Appointed as a core Committee Member for the Audit and Report Committee (Internal Ranking Rounds) and Accommodation Committee for the prestigious National Moot Court Competition, overseeing hospitality and rules adjudication.'
  },
  {
    period: '2024',
    role: 'Student Representative & Event Leader',
    institution: 'Student Union Council & Academic Events',
    mentor: 'Vice-President & Event In-Charge',
    details: 'Elected Vice-President of the Student Union Council. Acted as the In-Charge for the acclaimed Crime Scene Investigation Event, organizing mock trials, evidentiary workshops, and managing student leadership bodies.'
  },
  {
    period: '2024 - PRESENT',
    role: 'High Court Internship',
    institution: 'High Court of Madhya Pradesh, Indore Bench',
    mentor: 'Under Advocate Piyush Jain',
    details: 'Actively assisted in preparing case briefs, drafting writ petitions, performing intense precedent searches, and attending courtroom proceedings to observe judicial advocacy styles first-hand.'
  }
];

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !lineRef.current) return;

    // Animate the vertical timeline line scaling down on scroll
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: 'top center',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'bottom 50%',
          scrub: true,
        }
      }
    );

    // Animate timeline nodes and cards
    const items = containerRef.current.querySelectorAll('.timeline-item');
    items.forEach((item) => {
      const node = item.querySelector('.timeline-node');
      const card = item.querySelector('.timeline-card');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top 75%',
          end: 'bottom 40%',
          toggleActions: 'play reverse play reverse'
        }
      });

      tl.to(node, {
        scale: 1.4,
        backgroundColor: '#D4AF37',
        borderColor: '#F3E5AB',
        boxShadow: '0 0 20px #D4AF37',
        duration: 0.4
      });

      tl.to(card, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.2');
    });

  }, []);

  return (
    <div ref={containerRef} className="relative max-w-4xl mx-auto px-6 py-12">
      {/* Central vertical gold line */}
      <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-[1px] bg-neutral-800 pointer-events-none" />
      <div 
        ref={lineRef}
        className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#D4AF37] to-[#F3E5AB] origin-top pointer-events-none" 
      />

      {/* Timeline items */}
      <div className="space-y-16 md:space-y-24">
        {TIMELINE_DATA.map((item, index) => {
          const isLeft = index % 2 === 0;

          return (
            <div 
              key={index}
              className="timeline-item relative flex flex-col md:flex-row items-start md:items-center justify-between"
            >
              {/* Timeline Center Node */}
              <div 
                className="timeline-node absolute left-[30px] md:left-1/2 transform -translate-x-[4px] md:-translate-x-1/2 z-10 w-[9px] h-[9px] bg-neutral-900 border border-neutral-700 rounded-full transition-all duration-300 pointer-events-none"
              />

              {/* Layout spacer or content based on side */}
              <div className={`w-full md:w-[45%] ${isLeft ? 'md:order-1' : 'md:order-3 md:text-right hidden md:block'}`}>
                {isLeft && (
                  <TimelineCard item={item} align="left" />
                )}
                {!isLeft && (
                  <div className="pr-12">
                    <span className="font-serif text-[#D4AF37] text-lg tracking-widest block font-light mb-1">
                      {item.period}
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em] text-neutral-600 block">
                      {item.institution}
                    </span>
                  </div>
                )}
              </div>

              {/* Central Spacer */}
              <div className="w-[10%] order-2 hidden md:block" />

              {/* Opposing Side */}
              <div className={`w-full md:w-[45%] ${isLeft ? 'md:order-3' : 'md:order-1'}`}>
                {!isLeft && (
                  <TimelineCard item={item} align="right" />
                )}
                {isLeft && (
                  <div className="pl-12 md:pl-0 md:pr-12 md:text-left hidden md:block">
                    <span className="font-serif text-[#D4AF37] text-lg tracking-widest block font-light mb-1">
                      {item.period}
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em] text-neutral-600 block">
                      {item.institution}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface CardProps {
  item: {
    period: string;
    role: string;
    institution: string;
    mentor: string;
    details: string;
  };
  align: 'left' | 'right';
}

function TimelineCard({ item, align }: CardProps) {
  // Mobile always pushes right, desktops push according to alignment
  const initialX = align === 'left' ? -40 : 40;

  return (
    <div 
      className="timeline-card luxury-card p-6 md:p-8 rounded-none opacity-0 transition-opacity ml-12 md:ml-0"
      style={{ 
        transform: `translateX(${initialX}px)`,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">
          {item.period}
        </span>
        <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-600 font-mono hidden md:inline">
          ⚖ CASE_LOG:0{item.role.charCodeAt(0) % 9}
        </span>
      </div>

      <h4 className="font-serif text-xl md:text-2xl text-[#F8F5EE] tracking-wide mb-1">
        {item.role}
      </h4>
      <p className="text-xs uppercase tracking-[0.15em] text-[#A0A0A0] mb-4">
        {item.institution}
      </p>

      {item.mentor && (
        <div className="px-3 py-1 bg-neutral-900 border-l border-[#D4AF37] text-xs font-sans font-light tracking-wide text-[#F8F5EE] inline-block mb-4">
          {item.mentor}
        </div>
      )}

      <p className="text-sm text-[#A0A0A0] leading-relaxed font-sans font-light">
        {item.details}
      </p>
    </div>
  );
}
