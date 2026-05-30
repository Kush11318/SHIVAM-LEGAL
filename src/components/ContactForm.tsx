'use client';

import React, { useState, useRef } from 'react';
import { 
  MessageSquare, 
  Mail, 
  Send,
  CheckCircle2
} from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    query: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setRipples((prev) => [...prev, newRipple]);
    
    // Clear ripple after animation completes
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Clean form
      setFormData({
        name: '',
        email: '',
        phone: '',
        query: ''
      });
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto px-6 relative z-10">
      
      {/* Contact Info Panel */}
      <div className="lg:col-span-5 flex flex-col justify-between p-8 luxury-card border-r-0 lg:border-r border-b lg:border-b-0 border-[rgba(212,175,55,0.15)] rounded-none h-full min-h-[400px]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] block mb-2 font-sans font-semibold">
            Chambers of Shivam Gupta
          </span>
          <h3 className="font-serif text-3xl md:text-4xl text-[#F8F5EE] tracking-wide mb-6 font-light leading-tight">
            Initiate Consultation
          </h3>
          <p className="text-sm text-[#A0A0A0] leading-relaxed font-sans font-light mb-8">
            Seeking legal counsel or strategic research partnership? Provide your case details or contract inquiries to schedule a private advisory session.
          </p>
        </div>

        {/* Premium contact links */}
        <div className="space-y-6">
          <a 
            href="mailto:shivamgupta6170@gmail.com" 
            className="flex items-center space-x-4 group text-[#A0A0A0] hover:text-[#D4AF37] transition-all duration-300"
          >
            <div className="w-10 h-10 flex items-center justify-center border border-neutral-800 group-hover:border-[#D4AF37] text-neutral-500 group-hover:text-[#D4AF37] rounded-none transition-all duration-300">
              <Mail className="w-4 h-4" strokeWidth={1} />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-600 block">Direct Email</span>
              <span className="text-sm font-sans tracking-wide">shivamgupta6170@gmail.com</span>
            </div>
          </a>

          <a 
            href="https://wa.me/918085700321" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-4 group text-[#A0A0A0] hover:text-[#D4AF37] transition-all duration-300"
          >
            <div className="w-10 h-10 flex items-center justify-center border border-neutral-800 group-hover:border-[#D4AF37] text-neutral-500 group-hover:text-[#D4AF37] rounded-none transition-all duration-300">
              <MessageSquare className="w-4 h-4" strokeWidth={1} />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-600 block">WhatsApp Consult</span>
              <span className="text-sm font-sans tracking-wide">+91 80857 00321</span>
            </div>
          </a>

          <a 
            href="https://www.linkedin.com/in/shivam-gupta-a25403307" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-4 group text-[#A0A0A0] hover:text-[#D4AF37] transition-all duration-300"
          >
            <div className="w-10 h-10 flex items-center justify-center border border-neutral-800 group-hover:border-[#D4AF37] text-neutral-500 group-hover:text-[#D4AF37] rounded-none transition-all duration-300">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-600 block">LinkedIn Profile</span>
              <span className="text-sm font-sans tracking-wide">linkedin.com/in/shivam-gupta</span>
            </div>
          </a>
        </div>

        {/* Footer GUI coordinate */}
        <div className="text-[9px] text-neutral-600 tracking-[0.25em] uppercase font-sans mt-8 pt-6 border-t border-neutral-900">
          📍 INDORE HIGH COURT BENCH, MP, INDIA
        </div>
      </div>

      {/* Form Submission Panel */}
      <div className="lg:col-span-7 p-8 luxury-card rounded-none h-full relative overflow-hidden">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            <div className="w-16 h-16 flex items-center justify-center border border-[#D4AF37] text-[#D4AF37] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.2)] mb-6 animate-bounce">
              <CheckCircle2 className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h4 className="font-serif text-2xl text-[#F8F5EE] tracking-wide mb-2">
              Chambers Adduced
            </h4>
            <p className="text-sm text-[#A0A0A0] max-w-sm leading-relaxed mb-8">
              Your inquiry has been successfully filed in the dockets. Advocate Shivam Gupta will review and contact you within 24 hours.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-2 border border-neutral-800 hover:border-[#D4AF37] text-[#A0A0A0] hover:text-[#D4AF37] text-[10px] uppercase tracking-[0.25em] transition-all duration-500 cursor-pointer"
            >
              File New Docket
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input - Name */}
            <div className="relative group">
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder=" "
                className="w-full bg-neutral-950 border border-neutral-800 text-[#F8F5EE] px-4 py-3 rounded-none outline-none font-sans text-sm focus:border-[#D4AF37] focus:shadow-[0_0_10px_rgba(212,175,55,0.15)] transition-all duration-300 peer placeholder-shown:border-neutral-800"
              />
              <label className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xs uppercase tracking-widest text-neutral-500 pointer-events-none transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xs peer-focus:top-[-8px] peer-focus:left-2 peer-focus:text-[9px] peer-focus:px-2 peer-focus:bg-neutral-950 peer-focus:text-[#D4AF37] peer-[:not(:placeholder-shown)]:top-[-8px] peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:bg-neutral-950">
                Full Name / Entity
              </label>
            </div>

            {/* Grid for Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Input - Email */}
              <div className="relative group">
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=" "
                  className="w-full bg-neutral-950 border border-neutral-800 text-[#F8F5EE] px-4 py-3 rounded-none outline-none font-sans text-sm focus:border-[#D4AF37] focus:shadow-[0_0_10px_rgba(212,175,55,0.15)] transition-all duration-300 peer"
                />
                <label className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xs uppercase tracking-widest text-neutral-500 pointer-events-none transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xs peer-focus:top-[-8px] peer-focus:left-2 peer-focus:text-[9px] peer-focus:px-2 peer-focus:bg-neutral-950 peer-focus:text-[#D4AF37] peer-[:not(:placeholder-shown)]:top-[-8px] peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:bg-neutral-950">
                  Email Address
                </label>
              </div>

              {/* Input - Phone */}
              <div className="relative group">
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder=" "
                  className="w-full bg-neutral-950 border border-neutral-800 text-[#F8F5EE] px-4 py-3 rounded-none outline-none font-sans text-sm focus:border-[#D4AF37] focus:shadow-[0_0_10px_rgba(212,175,55,0.15)] transition-all duration-300 peer"
                />
                <label className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xs uppercase tracking-widest text-neutral-500 pointer-events-none transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-xs peer-focus:top-[-8px] peer-focus:left-2 peer-focus:text-[9px] peer-focus:px-2 peer-focus:bg-neutral-950 peer-focus:text-[#D4AF37] peer-[:not(:placeholder-shown)]:top-[-8px] peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:bg-neutral-950">
                  Phone Number
                </label>
              </div>
            </div>

            {/* Input - Legal Query */}
            <div className="relative group">
              <textarea
                required
                name="query"
                rows={6}
                value={formData.query}
                onChange={handleChange}
                placeholder=" "
                className="w-full bg-neutral-950 border border-neutral-800 text-[#F8F5EE] px-4 py-3 rounded-none outline-none font-sans text-sm focus:border-[#D4AF37] focus:shadow-[0_0_10px_rgba(212,175,55,0.15)] transition-all duration-300 peer resize-none"
              />
              <label className="absolute left-4 top-6 text-xs uppercase tracking-widest text-neutral-500 pointer-events-none transition-all duration-300 peer-placeholder-shown:top-6 peer-placeholder-shown:text-xs peer-focus:top-[-8px] peer-focus:left-2 peer-focus:text-[9px] peer-focus:px-2 peer-focus:bg-neutral-950 peer-focus:text-[#D4AF37] peer-[:not(:placeholder-shown)]:top-[-8px] peer-[:not(:placeholder-shown)]:left-2 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:bg-neutral-950">
                Brief of Legal Query / Project Scope
              </label>
            </div>

            {/* Submit Button with Custom Golden Ripple on Click */}
            <button
              ref={buttonRef}
              type="submit"
              disabled={isSubmitting}
              onMouseDown={createRipple}
              className="w-full relative overflow-hidden py-4 bg-transparent border border-[#D4AF37] text-[#D4AF37] text-xs uppercase tracking-[0.3em] font-sans font-bold hover:bg-[#D4AF37] hover:text-[#090909] transition-all duration-500 flex items-center justify-center space-x-3 cursor-pointer"
            >
              {/* Ripple containers */}
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="ripple-effect"
                  style={{
                    left: ripple.x,
                    top: ripple.y
                  }}
                />
              ))}

              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#090909] border-t-transparent rounded-full animate-spin" />
                  <span>Recording Docket...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" strokeWidth={1.5} />
                  <span>Submit Inquiry</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
