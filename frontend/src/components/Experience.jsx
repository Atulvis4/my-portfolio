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
        <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />

        <div className="space-y-12 pl-8">
          {experience.map((job, i) => (
            <div
              key={i}
              className="relative animate-fade-up"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="absolute -left-8 top-1.5 w-2 h-2 rounded-full bg-muted border border-border-subtle" />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                <div>
                  <h3 className="text-primary font-medium">{job.role}</h3>
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
          ))}
        </div>
      </div>
    </section>
  );
}
