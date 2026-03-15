import { projects } from '../data/portfolioData';
import { useInView } from '../hooks/useInView';

const TYPE_COLORS = {
  'Web App': 'text-blue-400',
  'Tool': 'text-purple-400',
  'AI / GenAI': 'text-emerald-400',
  'AI / Backend': 'text-emerald-400',
};

export default function Projects() {
  const [ref, inView] = useInView();

  return (
    <section
      id="projects"
      ref={ref}
      className={`section-container section-reveal ${inView ? 'section-reveal-visible' : 'section-reveal-hidden'}`}
    >
      <p className="section-label">portfolio</p>
      <h2 className="section-title">Projects</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, i) => (
          <div
            key={i}
            className="card flex flex-col justify-between animate-fade-up"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-primary font-medium">{project.title}</h3>
                <span
                  className={`font-mono text-xs shrink-0 ${
                    TYPE_COLORS[project.type] || 'text-secondary'
                  }`}
                >
                  {project.type}
                </span>
              </div>

              <p className="text-secondary text-sm leading-relaxed mb-4">
                {project.description}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <span key={tech} className="badge">{tech}</span>
                ))}
              </div>

              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-secondary hover:text-primary transition-colors text-sm shrink-0"
                >
                  GitHub →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
