import { personal } from '../data/portfolioData';

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} {personal.name}
        </span>
        <span className="font-mono text-xs text-muted">
          Node.js · OpenAI · Gemini · Qdrant · Docker · React
        </span>
      </div>
    </footer>
  );
}
