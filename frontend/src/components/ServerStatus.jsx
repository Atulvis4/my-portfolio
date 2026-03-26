import { useEffect, useState } from 'react';
import { useInView } from '../hooks/useInView';

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function cpuColor(pct) {
  if (pct < 50) return '#4ade80';
  if (pct < 80) return '#facc15';
  return '#f87171';
}

function memColor(pct) {
  if (pct < 60) return '#4ade80';
  if (pct < 85) return '#facc15';
  return '#f87171';
}

export default function ServerStatus() {
  const [ref, inView] = useInView();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/system/stats');
        if (!res.ok) throw new Error('non-ok response');
        const data = await res.json();
        setStats(data);
        setError(false);
      } catch {
        setError(true);
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const memPercent = stats ? Math.round((stats.memory.used / stats.memory.total) * 100) : 0;
  const cpuPct = stats ? stats.cpu : 0;

  return (
    <section
      id="server"
      ref={ref}
      className={`section-container section-reveal ${inView ? 'section-reveal-visible' : 'section-reveal-hidden'}`}
    >
      <p className="section-label">infrastructure</p>

      {/* Headline */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-primary mb-2">
          No cloud.{' '}
          <span className="text-secondary font-normal">Just a phone.</span>
        </h2>
        <p className="text-secondary text-base leading-relaxed max-w-xl">
          This entire portfolio — the AI chat, the RAG pipeline, PostgreSQL, Redis — runs on an old{' '}
          <span className="text-primary font-mono text-sm">Redmi 9</span> sitting on a desk in Mumbai.
          Managed by PM2, tunnelled via Cloudflare. Live stats below, updated every 3s.
        </p>
      </div>

      {error ? (
        <div className="card flex items-center gap-3 max-w-sm">
          <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
          <span className="text-secondary text-sm font-mono">Server offline</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status */}
          <div className="card-featured flex flex-col gap-3 animate-fade-up" style={{ animationDelay: '0s' }}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
              <span className="text-secondary text-xs font-mono uppercase tracking-widest">Status</span>
            </div>
            <p className="text-primary text-sm font-mono">Online</p>
            <p className="text-muted text-xs font-mono">Redmi 9 · Android · Termux</p>
          </div>

          {/* CPU */}
          <div className="card flex flex-col gap-3 animate-fade-up" style={{ animationDelay: '0.07s' }}>
            <span className="text-secondary text-xs font-mono uppercase tracking-widest">CPU</span>
            <p
              className="text-2xl font-semibold tabular-nums transition-colors duration-500"
              style={{ color: stats ? cpuColor(cpuPct) : 'var(--color-primary)' }}
            >
              {stats ? `${stats.cpu}%` : '—'}
            </p>
            <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: stats ? `${Math.min(cpuPct, 100)}%` : '0%',
                  backgroundColor: stats ? cpuColor(cpuPct) : 'var(--color-muted)',
                }}
              />
            </div>
          </div>

          {/* Memory */}
          <div className="card flex flex-col gap-3 animate-fade-up" style={{ animationDelay: '0.14s' }}>
            <span className="text-secondary text-xs font-mono uppercase tracking-widest">Memory</span>
            <p
              className="text-2xl font-semibold tabular-nums transition-colors duration-500"
              style={{ color: stats ? memColor(memPercent) : 'var(--color-primary)' }}
            >
              {stats ? `${stats.memory.used} MB` : '—'}
            </p>
            <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: stats ? `${memPercent}%` : '0%',
                  backgroundColor: stats ? memColor(memPercent) : 'var(--color-muted)',
                }}
              />
            </div>
            <p className="text-muted text-xs font-mono">of {stats ? `${stats.memory.total} MB` : '—'}</p>
          </div>

          {/* Uptime */}
          <div className="card flex flex-col gap-3 animate-fade-up" style={{ animationDelay: '0.21s' }}>
            <span className="text-secondary text-xs font-mono uppercase tracking-widest">Uptime</span>
            <p className="text-primary text-2xl font-semibold tabular-nums">
              {stats ? formatUptime(stats.uptime) : '—'}
            </p>
            <p className="text-muted text-xs font-mono">since last reboot</p>
          </div>
        </div>
      )}

      {/* Stack footnote */}
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1">
        {['Node.js', 'PostgreSQL', 'Redis', 'PM2', 'Cloudflare Tunnel', 'Git'].map((t) => (
          <span key={t} className="font-mono text-xs text-muted">{t}</span>
        ))}
      </div>
    </section>
  );
}
