import { useEffect, useRef, useState } from 'react';
import { personal } from '../data/portfolioData';

export default function Hero() {
  const [displayName, setDisplayName] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    const name = personal.name;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (indexRef.current < name.length) {
          setDisplayName(name.slice(0, indexRef.current + 1));
          indexRef.current += 1;
        } else {
          setDone(true);
          clearInterval(interval);
        }
      }, 62);
      return () => clearInterval(interval);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center max-w-6xl mx-auto px-5 sm:px-8 pt-14 overflow-hidden"
    >
      {/* Ambient glow — white top-left */}
      <div
        className="pointer-events-none absolute -top-48 -left-24 w-[750px] h-[750px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.032) 0%, transparent 65%)' }}
      />
      {/* Ambient glow — green bottom-right hint */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.025) 0%, transparent 65%)' }}
      />

      <div className="relative z-10">
        {/* Prompt */}
        <p
          className="font-mono text-secondary text-sm mb-6 animate-slide-up"
          style={{ animationDelay: '0.05s' }}
        >
          <span className="text-muted mr-2">$</span>whoami
        </p>

        {/* Name */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-semibold text-primary tracking-tight mb-4 leading-tight animate-slide-up"
          style={{ animationDelay: '0.15s' }}
        >
          {displayName}
          <span
            className={`inline-block w-0.5 h-10 md:h-12 bg-primary ml-1 align-middle ${
              done ? 'animate-cursor-blink' : ''
            }`}
          />
        </h1>

        {/* Role */}
        <p
          className="text-lg sm:text-xl text-secondary mt-4 mb-3 max-w-xl animate-slide-up"
          style={{ animationDelay: '0.3s' }}
        >
          Backend Engineer &amp; AI Systems
        </p>

        {/* Tagline */}
        <p
          className="text-secondary text-base max-w-xl leading-relaxed mb-7 animate-slide-up"
          style={{ animationDelay: '0.4s' }}
        >
          {personal.tagline}
        </p>

        {/* CTAs */}
        <div
          className="flex flex-wrap gap-3 mb-7 animate-slide-up"
          style={{ animationDelay: '0.5s' }}
        >
          <a href="#projects" className="btn-primary">
            View Work
          </a>
          <a href="#chat" className="btn-secondary">
            Chat with Resume
            <span className="text-xs text-muted">AI</span>
          </a>
          <a
            href="/Atulkumar_Vishwakarma_Resume.pdf"
            download="Atulkumar_Vishwakarma_Resume.pdf"
            className="btn-secondary"
          >
            Resume
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </a>
        </div>

        {/* Meta info */}
        <div
          className="flex flex-wrap items-center gap-6 text-sm text-secondary font-mono mb-6 animate-slide-up"
          style={{ animationDelay: '0.6s' }}
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            {personal.location}
          </span>
          <span>{personal.experience} experience</span>
          {personal.available && (
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
              Available for hire
            </span>
          )}
        </div>

        {/* Social links */}
        <div
          className="flex flex-wrap items-center gap-5 pt-6 border-t border-border animate-slide-up"
          style={{ animationDelay: '0.7s' }}
        >
          <a
            href={personal.github}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-muted hover:text-primary transition-colors duration-150"
          >
            github.com/atulvis4 →
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-muted hover:text-primary transition-colors duration-150"
          >
            linkedin.com/in/atulvis4 →
          </a>
          <a
            href={`mailto:${personal.email}`}
            className="font-mono text-xs text-muted hover:text-primary transition-colors duration-150"
          >
            {personal.email} →
          </a>
        </div>
      </div>
    </section>
  );
}
