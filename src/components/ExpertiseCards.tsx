'use client';

import React from 'react';
import { 
  Search, 
  FileText, 
  ShieldCheck, 
  Scale, 
  FileCheck, 
  Briefcase 
} from 'lucide-react';

const EXPERTISE_DATA = [
  {
    icon: Search,
    title: 'Legal Research',
    description: 'Exhaustive exploration of jurisprudential precedents, statutory provisions, and judicial doctrines to fortify courtroom arguments and advisory opinions.'
  },
  {
    icon: FileText,
    title: 'Legal Drafting',
    description: 'Precision-oriented drafting of litigation pleadings, affidavits, statements of claim, and appellate briefs, tailored to meet strict judicial standard parameters.'
  },
  {
    icon: Briefcase,
    title: 'Documentation',
    description: 'Creating ironclad corporate documents, memorandum of association, partnership articles, and transactional papers protecting client interests.'
  },
  {
    icon: Scale,
    title: 'Case Law Analysis',
    description: 'Dissecting complex historical decisions, extraction of ratio decidendi, and strategic implementation of legal findings to present robust client cases.'
  },
  {
    icon: FileCheck,
    title: 'Contract Review',
    description: 'In-depth scrutiny of agreements, risk exposure assessments, indemnity analyses, and meticulous negotiation point formulation.'
  },
  {
    icon: ShieldCheck,
    title: 'Compliance Assistance',
    description: 'Guiding corporate entities and startups through evolving regulatory mazes, corporate governance mandates, and statutory declarations.'
  }
];

export default function ExpertiseCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto px-6">
      {EXPERTISE_DATA.map((item, index) => {
        const IconComponent = item.icon;
        // Introduce different initial offsets for parallax depth effect in scroll
        const parallaxOffsetClass = 
          index % 3 === 0 
            ? 'translate-y-0 md:translate-y-4' 
            : index % 3 === 1 
              ? 'translate-y-0 md:translate-y-12' 
              : 'translate-y-0 md:translate-y-8';

        return (
          <div
            key={index}
            className={`luxury-card p-8 group relative overflow-hidden flex flex-col justify-between h-[320px] transition-all duration-700 cursor-default ${parallaxOffsetClass}`}
          >
            {/* Ambient Card Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.06)_0%,rgba(0,0,0,0)_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            {/* Top decorative gold thread */}
            <div className="absolute top-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] group-hover:w-full transition-all duration-700" />
            
            <div>
              {/* Luxury Icon Frame */}
              <div className="w-12 h-12 flex items-center justify-center border border-[rgba(212,175,55,0.15)] group-hover:border-[#D4AF37] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] rounded-none mb-6 text-[#A0A0A0] group-hover:text-[#D4AF37] transition-all duration-500">
                <IconComponent className="w-5 h-5" strokeWidth={1} />
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl text-[#F8F5EE] group-hover:text-[#D4AF37] transition-colors duration-500 font-medium mb-3 tracking-wider">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#A0A0A0] group-hover:text-[#F8F5EE] leading-relaxed font-sans font-light transition-colors duration-500">
                {item.description}
              </p>
            </div>

            {/* Premium Card Footer GUI line */}
            <div className="flex items-center justify-between mt-6 text-[10px] uppercase tracking-[0.2em] text-neutral-600 group-hover:text-[#D4AF37] transition-colors duration-500 font-sans">
              <span>{`0${index + 1} / DEPTH_0${(index % 3) + 1}`}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                ⚖ Precision drafting
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
