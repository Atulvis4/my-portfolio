import { useState, useRef, useEffect } from 'react';
import { suggestedQuestions } from '../data/portfolioData';
import { useInView } from '../hooks/useInView';

const INITIAL_MESSAGE =
  "Hi! I'm an AI trained on Atul's resume. Ask me about his experience with multi-agent RAG systems, the OneMi App, his tech stack, or anything else.";

const generateSessionId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

function useTypewriter(text, speed = 18) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed('');
    setDone(false);
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          i++;
          setDisplayed(text.slice(0, i));
        } else {
          setDone(true);
          clearInterval(interval);
        }
      }, speed);
      return () => clearInterval(interval);
    }, 700);
    return () => clearTimeout(delay);
  }, []);

  return { displayed, done };
}

function InitialMessage() {
  const { displayed, done } = useTypewriter(INITIAL_MESSAGE);
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-7 h-7 rounded-full bg-surface-2 border border-border flex items-center justify-center shrink-0 mt-0.5">
        <span className="font-mono text-[10px] text-secondary">AI</span>
      </div>
      <div className="max-w-[78%] rounded-xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed bg-surface-2 border border-border text-primary">
        {displayed}
        {!done && (
          <span className="inline-block w-0.5 h-3.5 bg-secondary ml-0.5 align-middle animate-cursor-blink" />
        )}
      </div>
    </div>
  );
}

function Message({ role, content }) {
  const isUser = role === 'user';
  return (
    <div className={`flex gap-3 animate-message-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-surface-2 border border-border flex items-center justify-center shrink-0 mt-0.5">
          <span className="font-mono text-[10px] text-secondary">AI</span>
        </div>
      )}
      <div
        className={`max-w-[78%] rounded-xl text-sm leading-relaxed px-4 py-2.5 ${
          isUser
            ? 'rounded-tr-sm bg-accent text-background'
            : 'rounded-tl-sm bg-surface-2 border border-border text-primary'
        }`}
      >
        {content}
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-surface-2 border border-border flex items-center justify-center shrink-0 mt-0.5">
          <span className="font-mono text-[10px] text-secondary">you</span>
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-7 h-7 rounded-full bg-surface-2 border border-border flex items-center justify-center shrink-0">
        <span className="font-mono text-[10px] text-secondary">AI</span>
      </div>
      <div className="bg-surface-2 border border-border rounded-xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-muted inline-block"
            style={{ animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(generateSessionId);
  const messagesRef = useRef(null);
  const inputRef = useRef(null);
  const [sectionRef, inView] = useInView();

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, sessionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Sorry, something went wrong: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <section
      id="chat"
      ref={sectionRef}
      className={`section-container section-reveal ${inView ? 'section-reveal-visible' : 'section-reveal-hidden'}`}
    >
      {/* Live pill */}
      <div className="mb-6">
        <span className="live-pill">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
          live · running on a Redmi 9 in Mumbai via Cloudflare Tunnel
        </span>
      </div>

      <p className="section-label">AI-powered</p>
      <h2 className="section-title">Chat with Resume</h2>

      {/* Chat window with green glow */}
      <div
        className="rounded-xl overflow-hidden flex flex-col animate-scale-in"
        style={{
          height: '520px',
          border: '1px solid rgba(74, 222, 128, 0.2)',
          boxShadow: '0 0 0 1px rgba(74, 222, 128, 0.06), 0 0 60px rgba(74, 222, 128, 0.06), 0 20px 60px rgba(0,0,0,0.4)',
          background: 'var(--color-surface)',
        }}
      >
        {/* Terminal header */}
        <div
          className="px-4 py-3 border-b flex items-center justify-between shrink-0"
          style={{ borderColor: 'rgba(74, 222, 128, 0.12)', background: 'var(--color-surface-2)' }}
        >
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="font-mono text-xs text-muted">atul-resume-ai</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              online
            </span>
            <span className="hidden sm:inline">· Gemini 2.0 Flash · Qdrant RAG</span>
          </div>
        </div>

        {/* Messages */}
        <div ref={messagesRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">
          <InitialMessage />

          {messages.map((msg, i) => (
            <Message key={i} role={msg.role} content={msg.content} />
          ))}

          {loading && <TypingIndicator />}

          {messages.length === 0 && !loading && (
            <div className="pt-1 animate-fade-up" style={{ animationDelay: '1.6s' }}>
              <p className="text-xs text-muted mb-3 font-mono">— try asking</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="text-xs text-secondary border border-border rounded-full px-3 py-1.5
                               hover:text-primary hover:border-border-subtle hover:bg-surface-2
                               transition-all duration-150"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="px-4 py-3 border-t flex items-center gap-3 shrink-0"
          style={{ borderColor: 'rgba(74, 222, 128, 0.12)', background: 'var(--color-surface-2)' }}
        >
          <span className="font-mono text-secondary text-sm select-none shrink-0">~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about Atul..."
            maxLength={500}
            disabled={loading}
            className="flex-1 bg-transparent text-sm text-primary placeholder:text-muted
                       focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 text-xs font-medium rounded-lg
                       hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed
                       transition-all shrink-0"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-background)' }}
          >
            {loading ? '···' : 'Send'}
          </button>
        </form>
      </div>

      <p className="mt-3 text-xs text-muted font-mono">
        Gemini text-embedding-004 · Qdrant vector search · gemini-2.0-flash · PostgreSQL history · Redis rate limit
      </p>
    </section>
  );
}
