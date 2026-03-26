export const personal = {
  name: 'Atulkumar Vishwakarma',
  role: 'Backend Engineer',
  tagline:
    'I build scalable backend systems and AI-powered applications — multi-agent RAG pipelines, vector search, LLM-integrated APIs, and production-grade backends.',
  location: 'Mumbai, India',
  experience: '1.3 years',
  available: true,
  email: 'atul.vis4@gmail.com',
  github: 'https://github.com/atulvis4',
  linkedin: 'https://linkedin.com/in/atulvis4',
};

export const skills = {
  Backend: ['Node.js', 'Express.js', 'Laravel', 'REST APIs', 'PHP', 'Prisma ORM', 'Backend Architecture'],
  Databases: ['MySQL', 'MongoDB', 'Redis', 'Qdrant (Vector DB)'],
  'AI / RAG': ['OpenAI API (GPT-4o)', 'Multi-Agent RAG', 'Vector Search', 'Gemini API', 'Context Engineering', 'Prompt Engineering'],
  'DevOps / Cloud': ['Docker', 'Docker Compose', 'Amazon S3', 'AWS', 'Git', 'GitHub', 'PM2', 'Cloudflare Tunnel'],
  Frontend: ['React', 'Redux Toolkit', 'Tailwind CSS'],
};

export const experience = [
  {
    company: 'Cancer Mitr',
    role: 'Software Developer',
    period: 'Nov 2024 — Present',
    location: 'Mumbai, India',
    points: [
      'Architected and shipped the backend for OneMi App — a production health-tech platform — using Node.js, Prisma, MySQL, Redis, and Docker; engineered 30+ REST APIs',
      'Designed a multi-agent RAG system with an Orchestrator Agent and 4 specialized agents (general info, product recommendations, lab report analysis, ticketing) with LLM-based inter-agent routing',
      'Engineered context-aware AI conversations using a rolling summary architecture with a 15-message immediate window; integrated OpenAI GPT-4o, GPT-4o Mini, and text-embedding-3-small with Qdrant',
      'Built complete membership and monetization backend: per-user token logging, Razorpay payment gateway, cart system, and OTP-based auth with Redis caching',
      'Architected RBAC across 5-6 tables; migrated file storage to Amazon S3 with a dedicated bucket for centralized application logging',
      'Engineered an admin-controlled product seeder pipeline: SQL → vector embeddings → Qdrant for AI-powered semantic search',
      'Developed REST API backends for CancerCost Calculator and Symptom Tracker using Laravel and MySQL',
    ],
    stack: ['Node.js', 'Prisma', 'MySQL', 'Redis', 'Docker', 'OpenAI API', 'Qdrant', 'Amazon S3', 'Laravel'],
  },
  {
    company: 'Uponly Technologies',
    role: 'FullStack Web Developer Intern',
    period: 'Jan 2024 — Aug 2024',
    location: 'Mumbai, India',
    points: [
      'Collaborated on an HRMS Portal (React frontend, PHP/SQL backend) with features for employee management, payroll, and attendance tracking; used Redux Toolkit for state management',
      'Contributed to a unified Web Admin Portal integrating HRMS and Lead Management System (LMS) for external enterprise clients with a focus on security and scalability',
      'Worked on the Uponly Pro mobile app backend — built APIs in PHP/SQL and coordinated with frontend developers for integration',
    ],
    stack: ['React', 'Redux Toolkit', 'PHP', 'MySQL'],
  },
  {
    company: 'Surya Engineering',
    role: 'Software Developer Intern',
    period: 'Jul 2023 — Dec 2023',
    location: 'Mumbai, India',
    points: [
      "Built the company's website frontend using React and Redux Toolkit, ensuring performance, maintainability, and alignment with business requirements",
    ],
    stack: ['React', 'Redux Toolkit'],
  },
];

export const projects = [
  {
    title: 'OneMi App — Backend',
    description:
      'Production health-tech platform backend. Multi-agent AI system with Orchestrator + 4 specialized agents, context-aware rolling summary conversations, full membership management, RBAC, Razorpay, OTP auth, and admin seeder pipeline.',
    stack: ['Node.js', 'Prisma', 'MySQL', 'Redis', 'Docker', 'OpenAI API', 'Qdrant', 'Amazon S3'],
    type: 'AI / Backend',
    github: null,
  },
  {
    title: 'Android Termux Server',
    description:
      'This portfolio — the one you\'re on right now — is served from an old Redmi 9 sitting on a desk in Mumbai. No cloud. No VPS. A spare Android phone running Node.js, PostgreSQL, and Redis via Termux, kept alive by PM2 and tunnelled to the internet through Cloudflare — no public IP needed. The live CPU and memory stats you see? That\'s the phone, right now.',
    stack: ['Node.js', 'PostgreSQL', 'Redis', 'PM2', 'Cloudflare Tunnel', 'Git'],
    type: 'DevOps / Infrastructure',
    github: null,
  },
  {
    title: 'Portfolio Resume Chat',
    description:
      'Ask anything about my experience and get answers grounded in my actual resume — not hallucinations. Built a full RAG pipeline: Gemini text-embedding-004 converts resume chunks into vectors stored in Qdrant, gemini-2.0-flash generates the response, PostgreSQL persists conversation history, and Redis enforces rate limits. All running on the same Redmi 9.',
    stack: ['Node.js', 'Gemini API', 'Qdrant', 'PostgreSQL', 'Redis'],
    type: 'AI / GenAI',
    github: null,
  },
  {
    title: 'HRMS & Web Admin Portal',
    description:
      'Full-stack Human Resource Management System with employee management, payroll, and attendance. Part of a unified admin portal combining HRMS and Lead Management System (LMS) for enterprise clients.',
    stack: ['React', 'Redux Toolkit', 'PHP', 'MySQL'],
    type: 'Web App',
    github: null,
  },
  {
    title: 'CancerCost Calculator & Symptom Tracker',
    description:
      'Two patient-facing healthcare tools built for Cancer Mitr. RESTful backend APIs for treatment cost estimation and symptom logging to help patients and providers monitor health trends.',
    stack: ['Laravel', 'PHP', 'MySQL'],
    type: 'Tool',
    github: null,
  },
];

export const suggestedQuestions = [
  'Tell me about the OneMi App multi-agent RAG system',
  'What AI and LLM experience does Atul have?',
  'What is his current role and tech stack?',
  'What databases and vector DBs has he worked with?',
  'Is he available for hire?',
];
