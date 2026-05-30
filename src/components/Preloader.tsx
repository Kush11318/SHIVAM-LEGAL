'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [percent, setPercent] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const transitionStarted = useRef(false);

  // Exquisite smooth visual progress counter guaranteed over exactly 2.0 seconds
  useEffect(() => {
    const anim = { val: 0 };
    gsap.to(anim, {
      val: 100,
      duration: 2.0,
      ease: 'power2.out',
      onUpdate: () => {
        setPercent(Math.floor(anim.val));
      },
      onComplete: () => {
        setIsReady(true);
      }
    });
  }, []);

  const handleEnter = useCallback(() => {
    if (transitionStarted.current) return;
    transitionStarted.current = true;

    // Proactively trigger main reveal sequence in parallel
    onComplete();

    const tl = gsap.timeline({
      onComplete: () => {
        setHasEntered(true);
      }
    });

    // 1. T+0.0s: Fade out GUI preloader elements swiftly
    tl.to('.preloader-ui', {
      opacity: 0,
      y: -25,
      duration: 0.4,
      ease: 'power3.inOut'
    });

    // 2. T+0.3s: Open doors swiftly to let the page content reveal and paint immediately
    tl.to('.preloader-bg-half-top', {
      yPercent: -100,
      duration: 0.6,
      ease: 'power4.inOut'
    }, '+=0.1');

    tl.to('.preloader-bg-half-bottom', {
      yPercent: 100,
      duration: 0.6,
      ease: 'power4.inOut'
    }, '-=0.6');
  }, [onComplete]);

  // Cinematic Auto-Entry once loading is complete
  useEffect(() => {
    if (isReady && !transitionStarted.current) {
      const timer = setTimeout(() => {
        handleEnter();
      }, 400); // 400ms pause to see "Chambers Open" then auto-transition
      return () => clearTimeout(timer);
    }
  }, [isReady, handleEnter]);

  if (hasEntered) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Cinematic Split Background */}
      <div className="preloader-bg-half-top absolute top-0 left-0 w-full h-[50.5vh] bg-[#060606] border-b border-[rgba(212,175,55,0.05)]" />
      <div className="preloader-bg-half-bottom absolute bottom-0 left-0 w-full h-[50.5vh] bg-[#060606] border-t border-[rgba(212,175,55,0.05)]" />

      {/* Elegant Line Patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.02)_0%,rgba(0,0,0,0)_80%)] pointer-events-none" />

      {/* Cinematic GUI UI Overlay */}
      <div className="preloader-ui relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-xl">
        
        {/* Elite Calligraphic Seal of Justice */}
        <div className="relative w-32 h-32 mb-6 flex items-center justify-center scale-105">
          {/* Pulsing Outer Glow */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,rgba(0,0,0,0)_70%)] animate-pulse" />
          
          {/* Rotating Outer Dotted Ring */}
          <svg className="absolute w-full h-full animate-[spin_35s_linear_infinite] text-[#D4AF37] opacity-40" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.25" />
          </svg>
          
          {/* Inner Seal with Laurel Wreath and Text */}
          <svg className="w-24 h-24 text-[#D4AF37] opacity-80" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            {/* Laurel Wreaths */}
            <path d="M28 65 C22 55, 22 45, 28 35 C32 30, 40 28, 45 32 M72 65 C78 55, 78 45, 72 35 C68 30, 60 28, 55 32" strokeWidth="0.75" strokeLinecap="round" />
            
            {/* Elegant Scales of Justice */}
            <path d="M50 24 v44 M35 34 h30 M35 34 l5 15 h-10 z M65 34 l5 15 h-10 z M42 68 h16" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Balanced Hanging Chains */}
            <path d="M35 34 l-5 15 M45 34 l-5 15 M65 34 l-5 15 M75 34 l-5 15" strokeWidth="0.5" opacity="0.6" />
            
            <circle cx="50" cy="50" r="38" strokeWidth="0.5" strokeDasharray="6 2" opacity="0.3" />
          </svg>
        </div>

        <h2 className="font-serif text-3xl md:text-4xl uppercase tracking-[0.25em] text-[#F8F5EE] mb-2 font-light">
          Shivam Gupta
        </h2>
        <p className="text-[10px] uppercase tracking-[0.45em] text-[#D4AF37] mb-10 font-sans font-light opacity-90">
          Chambers of Advocacy
        </p>

        {/* Loading Indicator with golden pulse glow */}
        <div className="w-56 h-[1px] bg-neutral-950 relative overflow-hidden mb-6 border-b border-[rgba(212,175,55,0.05)]">
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-transparent via-[#D4AF37] to-[#F8F5EE] transition-all duration-300 shadow-[0_0_8px_rgba(212,175,55,0.4)]"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Dynamic Legal Procedural Stage Messages */}
        <div className="h-16 flex flex-col items-center justify-center">
          <div className="font-serif text-2xl font-light text-[#F8F5EE] tracking-[0.2em] opacity-90 transition-all duration-500">
            {percent}%
          </div>
          <span className="text-[9px] font-sans tracking-[0.35em] uppercase block mt-2 text-[#A0A0A0] opacity-80 min-h-[15px] animate-pulse">
            {percent < 30 ? 'Marshalling Facts...' : percent < 65 ? 'Adducing Evidence...' : percent < 95 ? 'Formulating Arguments...' : 'Chambers Open'}
          </span>
        </div>

        <div className="absolute bottom-[-150px] left-1/2 transform -translate-x-1/2 w-80 text-[10px] text-neutral-600 tracking-[0.2em] uppercase font-sans">
          Indore High Court Bench • B.B.A LL.B (Hons.)
        </div>
      </div>
    </div>
  );
}
