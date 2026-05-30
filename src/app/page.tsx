'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { 
  Award, 
  BookOpen, 
  ChevronDown, 
  Download, 
  UserCheck 
} from 'lucide-react';import dynamic from 'next/dynamic';

const CanvasContainer = dynamic(() => import('@/components/CanvasContainer'), { ssr: false });
import Preloader from '@/components/Preloader';

import ExpertiseCards from '@/components/ExpertiseCards';
import Timeline from '@/components/Timeline';
import ExperienceCounters from '@/components/ExperienceCounters';
import ContactForm from '@/components/ContactForm';

gsap.registerPlugin(ScrollTrigger);
export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFinalTransition, setIsFinalTransition] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const signatureRef = useRef<SVGSVGElement>(null);

  // Auto-hide navigation on scroll down, show on scroll up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleNavScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 60) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY) {
        setShowHeader(false); // hide on scroll down
      } else {
        setShowHeader(true); // reveal on scroll up
      }
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleNavScroll);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Track scroll progress for R3F Lady Justice positioning
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollY / (totalHeight || 1);
      setScrollProgress(progress);

      // Trigger the special Awwwards transformation when nearing bottom
      if (progress > 0.88) {
        setIsFinalTransition(true);
        if (signatureRef.current) {
          signatureRef.current.classList.add('animate');
        }
      } else {
        setIsFinalTransition(false);
        if (signatureRef.current) {
          signatureRef.current.classList.remove('animate');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cinematic GSAP Scroll-Triggered text animations
    gsap.fromTo(
      '.intro-quote-line',
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.25,
        duration: 1.5,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.intro-quote-container',
          start: 'top 75%',
          end: 'bottom 40%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Fade in and out panels
    gsap.fromTo(
      '.about-content-panel',
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-section',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    return () => {
      lenis.destroy();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoaded]);

  const handlePreloaderComplete = () => {
    setIsLoaded(true);
    // Smooth initial hero animation aligned with the cinematic reveal of the statue
    const tl = gsap.timeline();
    
    // Name reveal starting overlap (at T+0.5s as doors split)
    tl.fromTo('.hero-title', 
      { opacity: 0, y: 60, letterSpacing: '0.08em' }, 
      { opacity: 1, y: 0, letterSpacing: '0.15em', duration: 1.6, ease: 'power4.out' },
      '+=0.5'
    );
    
    // Subtitle line
    tl.fromTo('.hero-subtitle', 
      { opacity: 0, y: 25 }, 
      { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, 
      '-=1.2'
    );
    
    // Tagline
    tl.fromTo('.hero-tagline', 
      { opacity: 0, y: 15 }, 
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, 
      '-=0.8'
    );
    
    // CTA buttons
    tl.fromTo('.hero-cta-btn', 
      { opacity: 0, scale: 0.97 }, 
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, 
      '-=0.9'
    );
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-[#D4AF37] selection:text-[#090909]">
      {/* Immersive 3D Lady Justice background */}
      <CanvasContainer 
        scrollProgress={scrollProgress} 
        isFinalTransition={isFinalTransition} 
        isLoaded={isLoaded}
      />

      {/* Subtle occasionally appearing gold grid lines */}
      {isLoaded && <div className="gold-grid-overlay" />}

      {/* Cinematic preloader overlay */}
      <Preloader onComplete={handlePreloaderComplete} />

      <div className={`relative z-10 w-full overflow-hidden transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          
          {/* Elite Full-Width Auto-Hiding Top Navbar */}
          <header 
            className={`fixed top-0 left-0 w-full z-40 px-8 md:px-16 py-5 flex items-center justify-between border-b border-[rgba(212,175,55,0.06)] backdrop-blur-xl bg-[rgba(9,9,9,0.75)] transition-all duration-500 transform ${
              showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
          >
            {/* Logo / Monogram (Left) */}
            <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={() => scrollToSection('hero')}>
              <span className="font-serif text-[#F8F5EE] tracking-[0.25em] text-lg font-light">S.G.</span>
              <span className="h-[1px] w-5 bg-[#D4AF37]"></span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37]">CHAMBERS</span>
            </div>

            {/* Navigation links (Center-Right, elegant thin font, spaced) */}
            <nav className="hidden lg:flex items-center space-x-8 text-[10px] uppercase tracking-[0.22em] text-[#A0A0A0] font-sans font-medium">
              <span onClick={() => scrollToSection('intro')} className="hover:text-[#D4AF37] cursor-pointer transition-colors duration-300">Story</span>
              <span onClick={() => scrollToSection('about')} className="hover:text-[#D4AF37] cursor-pointer transition-colors duration-300">Profile</span>
              <span onClick={() => scrollToSection('expertise')} className="hover:text-[#D4AF37] cursor-pointer transition-colors duration-300">Practice</span>
              <span onClick={() => scrollToSection('experience')} className="hover:text-[#D4AF37] cursor-pointer transition-colors duration-300">Timeline</span>
              <span onClick={() => scrollToSection('contact')} className="hover:text-[#D4AF37] cursor-pointer transition-colors duration-300">Advisory</span>
            </nav>

            {/* Action Call-to-action button (Right, rounded corners, contrast border) */}
            <div>
              <button 
                onClick={() => scrollToSection('contact')}
                className="px-5 py-2.5 bg-[#D4AF37] border border-[#D4AF37] text-[#090909] text-[9px] uppercase tracking-[0.2em] font-sans font-bold hover:bg-transparent hover:text-[#D4AF37] transition-all duration-500 rounded-[4px] cursor-pointer shadow-[0_5px_15px_rgba(212,175,55,0.1)]"
              >
                Book Advisory
              </button>
            </div>
          </header>

          {/* Hero Section */}
          <section id="hero" className="relative h-screen w-full flex flex-col justify-between items-start px-6 md:px-16 lg:px-24 py-24 select-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(9,9,9,0.3)_0%,rgba(9,9,9,0)_50%,rgba(9,9,9,0.6)_100%)] pointer-events-none" />
            <div /> {/* Spacer */}

            {/* Left side aligned Hero Content */}
            <div className="max-w-2xl text-left relative z-20 hero-text-shadow">
              <span className="text-xs md:text-sm uppercase tracking-[0.4em] text-[#D4AF37] font-sans block mb-3 font-semibold">
                🛡 Chambers of Advocacy
              </span>
              <h1 className="hero-title font-serif text-5xl md:text-7xl lg:text-8xl font-light text-[#F8F5EE] tracking-wide leading-none mb-6">
                SHIVAM GUPTA
              </h1>
              
              <div className="hero-subtitle w-full h-[1px] bg-gradient-to-r from-[rgba(212,175,55,0.4)] to-transparent mb-6" />

              {/* Sub-titles with separator */}
              <div className="hero-subtitle flex flex-wrap gap-y-2 text-xs md:text-sm uppercase tracking-[0.25em] text-[#A0A0A0] font-sans font-light mb-8">
                <span>Legal Researcher</span>
                <span className="text-[#D4AF37] px-3">•</span>
                <span>Drafting Specialist</span>
                <span className="text-[#D4AF37] px-3">•</span>
                <span>Future Advocate</span>
              </div>

              {/* Tagline */}
              <p className="hero-tagline font-serif text-xl md:text-2xl text-[#F8F5EE] italic tracking-wider mb-10 font-light max-w-lg">
                &ldquo;Where Precision Meets Justice.&rdquo;
              </p>

              {/* CTAs */}
              <div className="hero-cta-btn flex flex-wrap gap-4">
                <button
                  onClick={() => scrollToSection('contact')}
                  className="px-8 py-4 bg-[#D4AF37] text-[#090909] text-xs font-sans uppercase tracking-[0.25em] font-bold border border-[#D4AF37] hover:bg-transparent hover:text-[#D4AF37] transition-all duration-500 rounded-none cursor-pointer shadow-[0_10px_20px_rgba(212,175,55,0.15)]"
                >
                  Schedule Consultation
                </button>
                
                <a
                  href="/SHIVAM.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-transparent text-[#F8F5EE] text-xs font-sans uppercase tracking-[0.25em] font-semibold border border-[rgba(248,245,238,0.2)] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-500 rounded-none flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" strokeWidth={1.5} />
                  <span>View Credentials</span>
                </a>
              </div>
            </div>

            {/* Scroll Assist Hint */}
            <div className="w-full flex justify-between items-center text-[10px] uppercase tracking-[0.25em] text-neutral-500 z-20">
              <div className="flex items-center space-x-2">
                <span className="animate-ping w-2 h-2 rounded-full bg-[#D4AF37]" />
                <span>Scroll to examine credentials</span>
              </div>
              <div className="flex items-center space-x-1 cursor-pointer hover:text-[#D4AF37] transition-colors" onClick={() => scrollToSection('intro')}>
                <span>Storyline</span>
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </div>
            </div>
          </section>

          {/* Section 1 – Introduction */}
          <section id="intro" className="relative w-full min-h-[90vh] flex items-center justify-start px-6 md:px-16 lg:px-24 py-24 select-none">
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(9,9,9,0.6)] to-[rgba(9,9,9,0.9)] pointer-events-none" />
            
            <div className="intro-quote-container max-w-4xl relative z-10 text-left">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] block mb-4 font-sans">
                ⚖ Legal Philosophy
              </span>
              <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-light text-[#F8F5EE] tracking-wide leading-snug space-y-4">
                <span className="intro-quote-line block">Law is not merely about statutes.</span>
                <span className="intro-quote-line block text-neutral-400">It is about understanding people,</span>
                <span className="intro-quote-line block text-[#D4AF37]">protecting fundamental rights,</span>
                <span className="intro-quote-line block">and delivering resolute justice.</span>
              </h2>
              <div className="w-16 h-[2px] bg-[#D4AF37] mt-8" />
            </div>
          </section>

          {/* Section 2 – About Shivam */}
          <section id="about" className="about-section relative w-full py-24 px-6 md:px-16 lg:px-24 bg-[#0c0c0c] border-y border-[rgba(212,175,55,0.05)]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(212,175,55,0.01)_0%,rgba(0,0,0,0)_60%)] pointer-events-none" />
            
            <div className="max-w-6xl mx-auto">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] block mb-2 font-sans font-semibold">
                CURRICULUM VITAE
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-[#F8F5EE] tracking-wide mb-12 font-light">
                Professional Profile
              </h2>

              <div className="about-content-panel grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
                
                {/* Profile Image Wrapper */}
                <div className="lg:col-span-4 relative group flex items-center justify-center">
                  <div className="absolute -inset-2 bg-gradient-to-tr from-[#D4AF37] to-[#090909] opacity-10 group-hover:opacity-30 blur-lg transition duration-1000" />
                  <div className="relative border border-[rgba(212,175,55,0.2)] p-2 bg-[#090909] group-hover:border-[#D4AF37] transition-all duration-700 w-full max-w-[320px] aspect-square overflow-hidden shadow-2xl">
                    <Image
                      src="/images/shivam.png"
                      alt="Shivam Gupta Counsel"
                      width={380}
                      height={380}
                      className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-[rgba(9,9,9,0.85)] border border-[rgba(212,175,55,0.15)] py-2 px-3 text-center backdrop-blur-sm">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block">
                        SHIVAM GUPTA
                      </span>
                    </div>
                  </div>
                </div>

                {/* About Details */}
                <div className="lg:col-span-8 flex flex-col justify-between p-8 luxury-card rounded-none">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2 font-sans flex items-center">
                        <UserCheck className="w-4 h-4 mr-2 text-[#D4AF37]" strokeWidth={1.5} />
                        Professional Statement
                      </h3>
                      <p className="text-sm text-[#A0A0A0] leading-relaxed font-sans font-light">
                        A highly disciplined, committed legal professional with a rigorous work ethic, consistently striving for academic and practical advocacy excellence. Exceptionally quick to navigate new statutory structures and procedural changes, establishing a proactive, continuous, and dynamic research strategy.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2 font-sans flex items-center">
                          <BookOpen className="w-4 h-4 mr-2 text-[#D4AF37]" strokeWidth={1.5} />
                          Academic Base
                        </h4>
                        <div className="p-4 bg-neutral-950 border border-neutral-900 border-l-[#D4AF37]">
                          <span className="font-serif text-sm text-[#F8F5EE] block font-semibold">
                            B.B.A LL.B (Hons.)
                          </span>
                          <span className="text-xs text-[#A0A0A0] block mt-1">
                            Government New Law College, Indore
                          </span>
                          <span className="text-[10px] text-neutral-600 block mt-1">
                            June 2022 - June 2027 • DAVV
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2 font-sans flex items-center">
                          <Award className="w-4 h-4 mr-2 text-[#D4AF37]" strokeWidth={1.5} />
                          Key Milestones
                        </h4>
                        <ul className="text-xs text-[#A0A0A0] space-y-2">
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mr-2" />
                            High Court Practice Assisting
                          </li>
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mr-2" />
                            National Moot Adjudication Support
                          </li>
                          <li className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mr-2" />
                            Student Council Vice-Presidency
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Skills Tags */}
                  <div className="mt-8 pt-6 border-t border-neutral-900">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-3 font-sans font-semibold">
                      Admitted Skillsets
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {['Legal Research', 'Legal Drafting', 'Documentation', 'Case Law Analysis', 'Regulatory Audit', 'Courtroom Litigation assist'].map((skill) => (
                        <span 
                          key={skill} 
                          className="px-3 py-1 bg-neutral-950 border border-neutral-800 text-[10px] uppercase tracking-wider text-[#A0A0A0] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </section>

          {/* Section 3 – Expertise */}
          <section id="expertise" className="relative w-full py-24 bg-[#090909]">
            <div className="max-w-6xl mx-auto text-center px-6 mb-16">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] block mb-2 font-sans font-semibold">
                PRACTICE SPECTRUM
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-[#F8F5EE] tracking-wide mb-4 font-light">
                Fields of Competence
              </h2>
              <p className="text-sm text-[#A0A0A0] max-w-md mx-auto font-sans font-light tracking-wide">
                Delivering flawless legal support, statutory alignment review, and bulletproof draftsmanship.
              </p>
              <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mt-6" />
            </div>

            <ExpertiseCards />
          </section>

          {/* Section 4 – Experience */}
          <section id="experience" className="relative w-full py-24 bg-[#0c0c0c] border-y border-[rgba(212,175,55,0.05)]">
            <div className="max-w-6xl mx-auto text-center px-6 mb-16">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] block mb-2 font-sans font-semibold">
                CAREER DEPOSITIONS
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-[#F8F5EE] tracking-wide mb-4 font-light">
                Advocacy Timeline
              </h2>
              <p className="text-sm text-[#A0A0A0] max-w-md mx-auto font-sans font-light tracking-wide">
                Documenting strategic High Court internships, academic achievements, and leadership postings.
              </p>
              <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mt-6" />
            </div>

            <Timeline />
          </section>

          {/* Section 5 – Credibility */}
          <section className="relative w-full py-24 bg-[#090909]">
            <div className="max-w-6xl mx-auto text-center px-6 mb-12">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] block mb-2 font-sans font-semibold">
                LITIGATION METRICS
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-[#F8F5EE] tracking-wide mb-4 font-light">
                Quantifiable Impact
              </h2>
              <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mt-6" />
            </div>

            <ExperienceCounters />
          </section>

          {/* Section 6 – Philosophy */}
          <section className="relative w-full py-32 bg-[#050505] overflow-hidden flex items-center justify-center border-t border-[rgba(212,175,55,0.05)]">
            {/* Cinematic Floating Legal script SVGs (Background) */}
            <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none flex items-center justify-center">
              <svg className="w-[120%] h-[120%] text-[#D4AF37]" viewBox="0 0 1000 600" fill="none">
                <path d="M50 100 Q 250 50, 450 150 T 850 100" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
                <path d="M100 200 C 300 120, 400 280, 700 180" stroke="currentColor" strokeWidth="1" />
                <path d="M50 400 Q 300 480, 600 350 T 950 420" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                {/* Ancient Law script letter replicas */}
                <text x="100" y="150" fill="currentColor" fontSize="24" fontFamily="serif" fontStyle="italic">Juris Prudentia</text>
                <text x="600" y="300" fill="currentColor" fontSize="30" fontFamily="serif" fontStyle="italic">Ratio Decidendi</text>
                <text x="250" y="450" fill="currentColor" fontSize="20" fontFamily="serif" fontStyle="italic">In Limine</text>
              </svg>
            </div>

            <div className="relative z-10 text-center px-6 max-w-4xl">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] block mb-6 font-sans font-semibold">
                🛡 THE CREED
              </span>
              <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-[#F8F5EE] tracking-widest uppercase leading-tight select-none">
                JUSTICE DEMANDS <br />
                <span className="bg-gold-text italic font-normal">PREPARATION.</span>
              </h2>
              <div className="w-24 h-[1px] bg-[#D4AF37] mx-auto mt-8" />
            </div>
          </section>

          {/* Section 7 – Contact & Special Awwwards Feature */}
          <section id="contact" className="relative w-full py-24 bg-[#090909] border-t border-[rgba(212,175,55,0.05)] transition-colors duration-1000 z-10">
            
            {/* Dynamic backdrop shadow to fade layout into pitch black */}
            <div className="absolute inset-0 bg-[#000000] opacity-0 transition-opacity duration-1000 z-0 pointer-events-none is-final-bg" />

            <div className="relative z-10">
              <ContactForm />
            </div>

            {/* Special Awwwards transformation block at the bottom */}
            <div className="relative z-10 w-full mt-32 text-center px-6 max-w-4xl mx-auto border-t border-[rgba(212,175,55,0.05)] pt-24 pb-12">
              <div className="space-y-12">
                
                {/* Final Quote */}
                <div className="max-w-2xl mx-auto">
                  <p className="font-serif text-lg md:text-xl lg:text-2xl text-[#F8F5EE] italic tracking-wide leading-relaxed font-light">
                    &ldquo;Justice is earned through preparation, integrity, and unwavering dedication.&rdquo;
                  </p>
                </div>

                {/* Golden signature-style text drawing animation */}
                <div className="relative h-32 flex items-center justify-center">
                  <svg 
                    ref={signatureRef}
                    className="signature-svg w-72 md:w-96 h-28 text-[#D4AF37]" 
                    viewBox="0 0 400 120" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round"
                  >
                    {/* Exquisite custom handwritten vector script of "Shivam Gupta" */}
                    <path d="M30 65 C45 40, 50 35, 65 65 C72 78, 80 82, 85 65 C95 45, 105 40, 110 75 C112 85, 118 85, 120 70 C125 55, 132 50, 138 72 C142 82, 146 82, 150 70 C158 50, 165 40, 172 85 C178 95, 185 92, 192 70 C202 40, 215 10, 222 105 C224 110, 230 110, 235 95 C242 75, 255 35, 268 85 C272 90, 278 90, 282 85 C290 65, 302 45, 312 75 C315 80, 320 80, 325 75 M30 80 L350 80 M135 60 L160 60" />
                  </svg>
                </div>

                {/* Final Signature Name branding */}
                <div>
                  <h3 className="font-serif text-2xl uppercase tracking-[0.3em] text-[#F8F5EE] font-light">
                    Shivam Gupta
                  </h3>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-sans font-light mt-2">
                    Future Advocate • High Court Counsel
                  </p>
                </div>

                <div className="text-[9px] uppercase tracking-[0.2em] text-neutral-600 font-sans pt-12">
                  © 2026 SHIVAM GUPTA • BUILT WITH LOVE FROM GST
                </div>
              </div>
            </div>

          </section>

      </div>
    </div>
  );
}
