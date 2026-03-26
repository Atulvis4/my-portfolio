import { experience } from '../data/portfolioData';
import { useInView } from '../hooks/useInView';

export default function Experience() {
  const [ref, inView] = useInView();

  return (
    <section
      id="experience"
      ref={ref}
      className={`section-container section-reveal ${inView ? 'section-reveal-visible' : 'section-reveal-hidden'}`}
    >
      <p className="section-label">career</p>
      <h2 className="section-title">Experience</h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />

        <div className="space-y-12 pl-8">
          {experience.map((job, i) => {
            const isCurrent = i === 0;
            return (
              <div
                key={i}
                className="relative animate-fade-up"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                {/* Timeline dot — green + pulse for current role */}
                <div
                  className={`absolute -left-8 top-1.5 w-2 h-2 rounded-full border ${
                    isCurrent
                      ? 'bg-green-400 border-green-400/50'
                      : 'bg-muted border-border-subtle'
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-40" />
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-primary font-medium">{job.role}</h3>
                      {isCurrent && (
                        <span className="font-mono text-[10px] text-green-400 border border-green-400/20 rounded px-1.5 py-0.5">
                          current
                        </span>
                      )}
                    </div>
                    <p className="text-secondary text-sm">{job.company} · {job.location}</p>
                  </div>
                  <span className="font-mono text-xs text-muted whitespace-nowrap">{job.period}</span>
                </div>

                <ul className="space-y-1.5 mb-4">
                  {job.points.map((point, j) => (
                    <li key={j} className="text-secondary text-sm flex gap-2">
                      <span className="text-muted mt-0.5 shrink-0">—</span>
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5">
                  {job.stack.map((tech) => (
                    <span key={tech} className="badge">{tech}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
