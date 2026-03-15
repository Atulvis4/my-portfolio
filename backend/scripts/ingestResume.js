import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

import { embedText } from '../src/services/gemini.js';
import { ensureCollection, deleteCollection, upsertChunks } from '../src/services/qdrant.js';

// Resume content split into semantically meaningful chunks
const RESUME_CHUNKS = [
  {
    id: 1,
    section: 'summary',
    text: `Atulkumar Vishwakarma is a Backend Engineer specializing in AI & RAG Systems with 1.3 years of professional experience.
His title and expertise: Backend Engineer | AI & RAG Systems | Node.js | Laravel | REST APIs | Vector Search.
He builds scalable backend systems and AI-powered applications — including multi-agent RAG architectures, vector search pipelines, and LLM-integrated backend services.
He has independently architected and shipped production systems including AI assistants, RBAC-based platforms, REST APIs, payment integrations, and cloud storage solutions.
He is based in Mumbai, India.
Contact: phone +91 9969368255, email atul.vis4@gmail.com, LinkedIn linkedin.com/in/atulvis4, GitHub github.com/atulvis4.`,
  },
  {
    id: 2,
    section: 'experience_cancermitr',
    text: `Atul has been working as a Software Developer at Cancer Mitr from November 2024 to the present (his current job).
At Cancer Mitr he architected and shipped the  backend for OneMi App — a production health-tech platform.
Tech stack used: Node.js, Prisma ORM, MySQL, Redis, Docker, Amazon S3, OpenAI API.
He engineered 30+ REST APIs supporting AI workflows, authentication, payments, and user data management.
He designed a multi-agent RAG system with an Orchestrator Agent and 4 specialized agents:
  - General info agent
  - Product recommendations agent
  - Lab report analysis agent
  - Ticketing agent
The agents use LLM-based inter-agent routing with no keyword matching, improving accuracy and response quality.
He engineered context-aware AI conversations using a rolling summary architecture with a 15-message immediate window.
He integrated OpenAI Responses API using models GPT-4o, GPT-4o Mini, and text-embedding-3-small (1536 dimensions) along with Qdrant vector DB for semantic search.
He developed a complete membership and monetization backend including:
  - Per-user token logging and budget enforcement
  - Razorpay payment gateway integration
  - Cart system
  - OTP-based authentication with OTPs cached in Redis to reduce DB load
He architected RBAC (Role-Based Access Control) across 5-6 database tables for fine-grained access control.
He migrated file storage from local filesystem to Amazon S3 with a dedicated S3 bucket for centralized application logging.
He engineered an admin-controlled product seeder pipeline that reads from SQL, generates vector embeddings, and seeds structured data into Qdrant for AI-powered semantic search.
He also developed REST API backends for CancerCost Calculator and Symptom Tracker using Laravel and MySQL.`,
  },
  {
    id: 3,
    section: 'experience_uponly',
    text: `Atul worked as a FullStack Web Developer Intern at Uponly Technologies from January 2024 to August 2024.
At Uponly he collaborated on an HRMS Portal (Human Resource Management System) with a React frontend and PHP/SQL backend.
The HRMS had features for employee management, payroll, and attendance tracking.
He used Redux Toolkit for state management on the frontend.
He contributed to a unified Web Admin Portal integrating the HRMS and a Lead Management System (LMS) for external enterprise clients, with a focus on security and scalability.
He worked on the Uponly Pro mobile app backend — built APIs in PHP/SQL and coordinated with frontend developers to integrate them into the mobile application.`,
  },
  {
    id: 4,
    section: 'experience_surya',
    text: `Atul worked as a Software Developer Intern at Surya Engineering from July 2023 to December 2023.
At Surya Engineering he built the company's website frontend using React and Redux Toolkit.
He focused on performance, maintainability, and alignment with business requirements.
This was his first professional software development role.`,
  },
  {
    id: 5,
    section: 'project_onemi_app',
    text: `OneMi App is Atul's flagship project — a production health-tech platform backend built at Cancer Mitr.
Tech stack: Node.js, Prisma ORM, MySQL, Redis, Docker, Qdrant vector DB, Amazon S3, OpenAI API.
Key features and systems built:
- Multi-agent AI system with an Orchestrator agent and 4 specialized agents (general info, product recommendations, lab report analysis, ticketing)
- Context-aware conversations using rolling summary architecture with a 15-message immediate window
- LLM-driven inter-agent delegation with no keyword matching
- OpenAI integration: GPT-4o, GPT-4o Mini for chat, text-embedding-3-small (1536-dim) for embeddings
- Qdrant vector DB for semantic search across products and knowledge base
- Full membership management system with per-user token usage tracking and budget enforcement
- RBAC (Role-Based Access Control) across 5-6 tables
- Razorpay payment gateway integration
- OTP-based authentication with Redis caching
- Health Locker feature for storing patient health data
- Admin-controlled product seeder pipeline (SQL → vector embeddings → Qdrant)
- Amazon S3 for file storage and centralized application logging
- 30+ REST APIs covering AI workflows, auth, payments, and user data management`,
  },
  {
    id: 6,
    section: 'project_cancer_tools',
    text: `CancerCost Calculator and Symptom Tracker are two patient-facing healthcare tools Atul built at Cancer Mitr.
Tech stack: Laravel (PHP) and MySQL.
CancerCost Calculator: RESTful backend APIs that calculate and estimate cancer treatment costs to help patients and providers plan financially.
Symptom Tracker: RESTful backend APIs that allow patients to log and track symptoms over time, enabling healthcare providers to monitor patient health trends.
Both are REST API backends built with Laravel and MySQL.`,
  },
  {
    id: 7,
    section: 'project_hrms_uponly',
    text: `HRMS Portal is a full-stack Human Resource Management System built at Uponly Technologies.
Tech stack: React frontend, Redux Toolkit for state management, PHP backend, SQL database.
Features: employee management, payroll processing, and attendance tracking.
Atul worked on both the React/Redux Toolkit frontend and the PHP/SQL backend.
This project was part of a broader unified Web Admin Portal that also integrated a Lead Management System (LMS) for external enterprise clients.
The unified admin portal emphasized security and scalability.`,
  },
  {
    id: 8,
    section: 'skills_backend',
    text: `Atul's backend and programming skills:
Languages: JavaScript (Node.js), PHP, SQL, HTML, CSS.
Backend frameworks and tools: Node.js, Express.js, Laravel, Prisma ORM, REST API design and development, backend architecture and system design.
Authentication: OTP-based auth with Redis caching, JWT, session-based auth, RBAC (Role-Based Access Control).
Payment integration: Razorpay payment gateway.
He is experienced in designing production-grade systems, independently architecting backends from scratch, and shipping features end-to-end.`,
  },
  {
    id: 9,
    section: 'skills_databases',
    text: `Atul's database and storage skills:
- MySQL — primary relational DB, used extensively at Cancer Mitr with Prisma ORM
- MongoDB — NoSQL document database
- Redis — in-memory store for OTP caching, rate limiting, session storage
- Qdrant — vector database for semantic search and embedding storage; used with OpenAI embeddings and Gemini embeddings
- Prisma ORM — type-safe database access layer in Node.js; used for migrations and schema management
- Amazon S3 — cloud object storage for file uploads and centralized application logging
He has hands-on production experience with all of these in live systems.`,
  },
  {
    id: 10,
    section: 'skills_ai_rag',
    text: `Atul's AI and RAG (Retrieval-Augmented Generation) skills:
- OpenAI API: GPT-4o, GPT-4o Mini for LLM chat completions; text-embedding-3-small (1536-dim) for vector embeddings
- Google Gemini API: text-embedding-004 for embeddings, gemini-2.0-flash for chat completions
- Multi-Agent RAG systems: designed and built Orchestrator + specialized agent architecture at Cancer Mitr
- Vector search: semantic search pipelines using Qdrant with embeddings from OpenAI and Gemini
- Context engineering: rolling summary architecture for long-horizon conversations (15-message window + rolling summary)
- LLM-based routing: inter-agent delegation without keyword matching using LLM intent classification
- Prompt engineering: system prompts, few-shot prompting, and RAG prompt construction
- Admin seeder pipelines: reads structured data → generates embeddings → seeds into vector DB for AI search
He has built and shipped production AI systems, not just prototypes.`,
  },
  {
    id: 11,
    section: 'skills_devops_cloud',
    text: `Atul's DevOps and cloud skills:
- Docker and Docker Compose — containerizing Node.js applications and infrastructure services (Qdrant, Redis, PostgreSQL)
- Amazon S3 — cloud object storage; migrated production system from local filesystem to S3
- AWS — cloud infrastructure (S3, general AWS familiarity)
- Git and GitHub — version control, collaboration, and code management
- Postman — API testing and documentation
- Prisma Migrate — database schema migrations
- XAMPP — local PHP/MySQL development environment
He uses Docker Compose to run multi-service stacks in both development and production environments.`,
  },
  {
    id: 12,
    section: 'skills_frontend',
    text: `Atul's frontend skills (supporting role, not primary focus):
- React.js — component-based UI development; used at Surya Engineering and Uponly Technologies
- Redux Toolkit — state management for React apps; used in HRMS Portal
- Tailwind CSS — utility-first CSS framework
- HTML5 and CSS3 — foundational web markup and styling
His primary focus is backend and AI systems, but he is capable of building and working on React frontends when needed.`,
  },
  {
    id: 13,
    section: 'education',
    text: `Atul completed a Bachelor of Engineering (B.E.) in Mechanical Engineering from L.R. Tiwari College of Engineering, affiliated with Mumbai University.
Graduation year: 2023. CGPI: 8.29 (strong academic performance).
He transitioned from Mechanical Engineering into software development and has been working professionally as a developer since 2023.
Despite a non-CS background, he has built production-grade AI systems, multi-agent RAG pipelines, and full backend platforms.`,
  },
  {
    id: 14,
    section: 'achievements',
    text: `Atul's achievements and extra-curricular activities:
- Silver Medal at a State-Level Boxing Championship — demonstrates discipline, competitive spirit, and physical fitness.
- Head of the Designing Club — organized workshops and competitions, trained club members in creative and technical design. Demonstrates leadership and mentoring ability.
Languages spoken: English, Hindi, Marathi.`,
  },
  {
    id: 15,
    section: 'contact_availability',
    text: `Atul Vishwakarma is open to full-time roles, freelance projects, and contract work in backend engineering and AI/RAG systems.
He is based in Mumbai, India and can work remotely or on-site.
Contact details:
- Email: atul.vis4@gmail.com
- Phone: +91 9969368255
- LinkedIn: linkedin.com/in/atulvis4
- GitHub: github.com/atulvis4
He is actively building his expertise in AI systems, multi-agent architectures, and cloud-native backend development.
He is passionate about backend engineering, GenAI, and shipping real-world AI products.`,
  },
];

async function ingest() {
  console.log('[ingest] Starting resume ingestion...');

  // Delete stale collection so we recreate with correct dimensions
  await deleteCollection();

  // Embed first chunk to detect vector dimensions
  process.stdout.write(`  Embedding [${RESUME_CHUNKS[0].section}]...`);
  const firstVector = await embedText(RESUME_CHUNKS[0].text);
  console.log(` done (dims: ${firstVector.length})`);

  await ensureCollection(firstVector.length);

  const chunksWithVectors = [{ ...RESUME_CHUNKS[0], vector: firstVector }];

  console.log(`[ingest] Embedding remaining ${RESUME_CHUNKS.length - 1} chunks...`);
  for (const chunk of RESUME_CHUNKS.slice(1)) {
    process.stdout.write(`  Embedding [${chunk.section}]...`);
    const vector = await embedText(chunk.text);
    chunksWithVectors.push({ ...chunk, vector });
    console.log(' done');
  }

  console.log('[ingest] Upserting to Qdrant...');
  await upsertChunks(chunksWithVectors);

  console.log(`[ingest] Successfully ingested ${RESUME_CHUNKS.length} chunks into Qdrant collection "resume"`);
  process.exit(0);
}

ingest().catch((err) => {
  console.error('[ingest] Failed:', err.message);
  process.exit(1);
});
