import { personal } from '../data/portfolioData';
import { useInView } from '../hooks/useInView';

const LINKS = [
  {
    label: 'Email',
    value: personal.email,
    href: `mailto:${personal.email}`,
  },
  {
    label: 'Phone',
    value: personal.phone,
    href: `tel:${personal.phone}`,
  },
  {
    label: 'GitHub',
    value: 'github.com/atulvis4',
    href: personal.github,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/atulvis4',
    href: personal.linkedin,
  },
];

export default function Contact() {
  const [ref, inView] = useInView();

  return (
    <section
      id="contact"
      ref={ref}
      className={`section-container section-reveal ${inView ? 'section-reveal-visible' : 'section-reveal-hidden'}`}
    >
      <p className="section-label">reach out</p>
      <h2 className="section-title">Contact</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <p className="text-secondary text-base leading-relaxed mb-6">
            Open to backend engineering roles, AI/RAG system projects, and freelance work.
            Drop a message and I&apos;ll get back within 24 hours.
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {['Full-time', 'Freelance', 'Contract'].map((type) => (
              <span key={type} className="badge flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                {type}
              </span>
            ))}
          </div>

          <a href={`mailto:${personal.email}`} className="btn-primary">
            Send Email →
          </a>
        </div>

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
