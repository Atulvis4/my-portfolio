import { skills } from '../data/portfolioData';
import { useInView } from '../hooks/useInView';

const FEATURED = 'AI / RAG';

export default function Skills() {
  const [ref, inView] = useInView();

  return (
    <section
      id="skills"
      ref={ref}
      className={`section-container section-reveal ${inView ? 'section-reveal-visible' : 'section-reveal-hidden'}`}
    >
      <p className="section-label">expertise</p>
      <h2 className="section-title">Tech Stack</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(skills).map(([category, items], i) => {
          const isFeatured = category === FEATURED;
          return (
            <div
              key={category}
              className={`card animate-fade-up ${isFeatured ? 'sm:col-span-2' : ''}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-xs text-secondary uppercase tracking-widest">
                  {category}
                </p>
                {isFeatured && (
                  <span className="font-mono text-[10px] text-emerald-400 border border-emerald-400/20 rounded px-2 py-0.5">
                    primary focus
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span key={skill} className="badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
