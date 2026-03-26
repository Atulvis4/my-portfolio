import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { personal } from '../data/portfolioData';
import { useInView } from '../hooks/useInView';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Rate limit: max 2 submissions per 15 minutes (localStorage-based)
const RATE_LIMIT_MAX = 2;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const LS_KEY = 'contact_submissions';

function checkRateLimit() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const timestamps = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length >= RATE_LIMIT_MAX) {
      const retryIn = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - recent[0])) / 60000);
      return { allowed: false, retryIn };
    }
    recent.push(now);
    localStorage.setItem(LS_KEY, JSON.stringify(recent));
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

const LINKS = [
  { label: 'Email',    value: personal.email,            href: `mailto:${personal.email}` },
  { label: 'GitHub',   value: 'github.com/atulvis4',     href: personal.github },
  { label: 'LinkedIn', value: 'linkedin.com/in/atulvis4', href: personal.linkedin },
];

const INITIAL = { name: '', email: '', message: '' };

export default function Contact() {
  const [ref, inView] = useInView();
  const formRef = useRef(null);
  const [fields, setFields] = useState(INITIAL);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error | ratelimit
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === 'sending') return;

    const { allowed, retryIn } = checkRateLimit();
    if (!allowed) {
      setErrorMsg(`Too many messages. Try again in ${retryIn} min.`);
      setStatus('ratelimit');
      return;
    }

    setStatus('sending');
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, { publicKey: PUBLIC_KEY });
      setStatus('success');
      setFields(INITIAL);
    } catch (err) {
      setErrorMsg(err?.text || 'Something went wrong. Try emailing directly.');
      setStatus('error');
    }
  }

  return (
    <section
      id="contact"
      ref={ref}
      className={`section-container section-reveal ${inView ? 'section-reveal-visible' : 'section-reveal-hidden'}`}
    >
      <p className="section-label">reach out</p>
      <h2 className="section-title">Contact</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Left — form */}
        <div>
          <p className="text-secondary text-base leading-relaxed mb-5">
            Open to backend engineering roles and AI/RAG projects.
            Fill the form and it lands directly in my inbox.
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {['Full-time', 'Freelance', 'Contract'].map((type) => (
              <span key={type} className="badge flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                {type}
              </span>
            ))}
          </div>

          {status === 'success' ? (
            <div className="card border-green-400/20 bg-green-400/[0.03]">
              <p className="text-green-400 text-sm font-mono mb-1">Message sent.</p>
              <p className="text-secondary text-sm">I'll get back to you within 24 hours.</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 text-xs text-muted hover:text-primary transition-colors font-mono"
              >
                Send another →
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    required
                    value={fields.name}
                    onChange={handleChange}
                    disabled={status === 'sending'}
                    className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm
                               text-primary placeholder:text-muted focus:outline-none focus:border-border-subtle
                               disabled:opacity-50 transition-colors duration-150"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    value={fields.email}
                    onChange={handleChange}
                    disabled={status === 'sending'}
                    className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm
                               text-primary placeholder:text-muted focus:outline-none focus:border-border-subtle
                               disabled:opacity-50 transition-colors duration-150"
                  />
                </div>
              </div>
              <textarea
                name="message"
                placeholder="What are you working on?"
                required
                rows={4}
                value={fields.message}
                onChange={handleChange}
                disabled={status === 'sending'}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm
                           text-primary placeholder:text-muted focus:outline-none focus:border-border-subtle
                           disabled:opacity-50 transition-colors duration-150 resize-none"
              />

              {(status === 'error' || status === 'ratelimit') && (
                <p className="text-red-400 text-xs font-mono">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending' || !fields.name || !fields.email || !fields.message}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              >
                {status === 'sending' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                    Sending…
                  </span>
                ) : (
                  'Send Message →'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right — links */}
        <div className="space-y-3">
          {LINKS.map(({ label, value, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="flex items-center justify-between card group cursor-pointer"
            >
              <span className="text-secondary text-sm">{label}</span>
              <span className="font-mono text-xs text-muted group-hover:text-primary transition-colors">
                {value} →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
