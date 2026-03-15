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
      }, 65);
      return () => clearInterval(interval);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center max-w-5xl mx-auto px-6 pt-14 overflow-hidden"
    >
      {/* Subtle radial glow behind the name */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }}
      />

      <div className="animate-fade-up relative z-10" style={{ animationDelay: '0.1s' }}>
        <p className="font-mono text-secondary text-sm mb-6">
          <span className="text-muted mr-2">$</span>whoami
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-primary tracking-tight mb-4 leading-tight">
          {displayName}
          <span
            className={`inline-block w-0.5 h-10 md:h-12 bg-primary ml-1 align-middle ${
              done ? 'animate-cursor-blink' : ''
            }`}
          />
        </h1>

        <p className="text-lg sm:text-xl text-secondary mt-4 mb-3 max-w-xl">
          Backend Engineer &amp; AI Systems
        </p>

        <p className="text-secondary text-base max-w-xl leading-relaxed mb-10">
          {personal.tagline}
        </p>

        <div className="flex flex-wrap gap-3 mb-12">
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

        <div className="flex flex-wrap items-center gap-6 text-sm text-secondary font-mono mb-8">
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
        <div className="flex items-center gap-5 pt-6 border-t border-border">
          <a
            href={personal.github}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-muted hover:text-primary transition-colors"
          >
            github.com/atulvis4 →
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-muted hover:text-primary transition-colors"
          >
            linkedin.com/in/atulvis4 →
          </a>
          <a
            href={`mailto:${personal.email}`}
            className="font-mono text-xs text-muted hover:text-primary transition-colors"
          >
            {personal.email} →
          </a>
        </div>
      </div>
    </section>
  );
}
