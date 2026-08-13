# ⚡ Aethera — University Edition (Full-Stack Academic Platform)

> **AI-powered academic toolkit for university students** — 30+ study tools driven by Groq AI (Llama 3.3 70B), full-stack Node.js Express backend, SQLite & Supabase PostgreSQL database schemas, Notion Sync integration, offline support, and cross-device persistence.

[![License: Free for Education](https://img.shields.io/badge/license-Free%20for%20Education-7c3aed)](#-license)
[![Frontend: Vanilla JS](https://img.shields.io/badge/frontend-HTML%20%2F%20CSS%20%2F%20JS-0a0a14?logo=javascript&logoColor=f7df1e)](https://developer.mozilla.org/en-US/docs/Web)
[![Backend: Node.js + Express](https://img.shields.io/badge/backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://expressjs.com/)
[![Database: SQLite & Supabase PostgreSQL](https://img.shields.io/badge/database-SQLite%20%2B%20Supabase-336791?logo=postgresql&logoColor=white)](#-database-schemas)
[![AI: Groq (Llama 3.3 70B)](https://img.shields.io/badge/AI-Groq%20Llama%203.3%2070B-f55036)](https://groq.com/)
[![Notion: Live Sync Integration](https://img.shields.io/badge/Notion-Live%20Sync%20API-000000?logo=notion&logoColor=white)](#-notion-sync-integration)

### 🌐 [Live Demo → mindsparkproo.netlify.app](https://mindsparkproo.netlify.app)

---

## 📑 Table of Contents

- [Features](#-features-30-tools)
- [Database Schemas](#-database-schemas)
- [Notion Integration](#-notion-sync-integration)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [License](#-license)

---

## 🎯 Features (30+ Tools)

### 📚 Study Tools
| Tool | Description |
|------|-------------|
| 📝 **Academic Summarizer** | Brief, Detailed, Critical Review, or Executive Summary styles with **⚡ Sync to Notion** |
| ❓ **Exam Question Generator** | MCQ, Essay, Short Answer, True/False, Case Study — with difficulty levels |
| 💡 **Concept Deep Dive** | Definition, theory, history, key scholars, applications, misconceptions |
| 📅 **Smart Study Planner** | Pomodoro, Spaced Repetition, Standard, or Intensive — with exam date & priorities |
| ✍️ **Essay Assistant** | Thesis generator, full outline, argument structure, counterarguments, writing tips |
| 📓 **Cornell Notes** | AI-structured Cornell-format notes from any lecture or topic |
| 📖 **Citation Builder** | APA 7th, MLA 9th, Chicago, Harvard, IEEE, Vancouver — Book, Article, Website, Chapter, Thesis |
| 🌍 **Smart Translator** | Academic, Neutral, or Simplified register — 6 languages |
| 🎧 **Text to Speech** | Browser built-in TTS with voice selection, speed, and pitch controls |
| 📂 **Lectures Library** | Upload & parse PDF/TXT/DOCX lectures, then feed them into any tool as context |

### 🎮 Interactive Learning
| Tool | Description |
|------|-------------|
| 🧪 **Quick Quiz** | Interactive MCQ with instant feedback, scoring, and difficulty levels |
| 🧠 **Flashcard Generator** | AI-generated flip-cards with shuffle, navigation, progress tracking, and **Anki export** |
| 🗺️ **Mind Map Visualizer** | Interactive SVG mind maps generated from any concept |
| 🤖 **AI Chat** | Conversational AI assistant with session context |

### 🔬 Advanced AI
| Tool | Description |
|------|-------------|
| 🔍 **Research Assistant** | Structured research briefs with angles, theories, scholars, and methodology |
| 🔄 **Compare Tool** | Side-by-side comparison of two concepts with structured analysis |
| 🔍 **Plagiarism Analyzer** | Originality assessment and text similarity verification |
| 📝 **Essay Auto-Grader** | Automated grading and constructive rubric feedback |
| ✏️ **Paraphraser** | Rewrite content in academic, simplified, or formal register |
| 💻 **Code Explainer** | Step-by-step explanation of any code snippet |
| 📖 **Vocabulary Builder** | Definitions, usage examples, contextual word learning, and flashcard mode |
| 🎙️ **Debate Generator** | Pro/con arguments and structured debate frameworks for any topic |
| 📜 **Abstract Writer** | Generate academic abstracts from research summaries |
| 🔤 **Grammar Checker** | Detect and correct grammar, style, and clarity issues |

### ⚡ Productivity & Planning
| Tool | Description |
|------|-------------|
| ⏱️ **Pomodoro Timer** | Customizable study/break timer with session tracking and sound alerts |
| 🎯 **Goal Tracker** | Set, monitor, and complete academic goals |
| 🎓 **GPA Calculator** | Calculate and project GPA across courses with **Semester Removal & Addition controls (`+ Semester` / `- Semester`)** |
| 🗓️ **Academic Calendar** | Track deadlines, exams, and academic milestones |

---

## 🗄️ Database Schemas

Aethera comes equipped with a **17-table Full-Stack Relational Database Suite** (available in local SQLite & PostgreSQL/Supabase format via `backend/schema.sql`):

1. **`users`**: Authentication, pass hashes, verification tokens.
2. **`profiles`**: Student ID, major, college, avatar.
3. **`courses`**: Academic subjects, colors, and semester metadata.
4. **`documents`**: PDF/DOCX lecture uploads and extracted text.
5. **`document_embeddings`**: Vector embeddings for AI RAG search (`pgvector`).
6. **`saved_notes`**: Saved AI outputs, summaries, and favorites.
7. **`flashcard_decks` & `flashcards`**: Decks, cards, and SuperMemo SM-2 Spaced Repetition scores.
8. **`quiz_results`**: Exam history, scores, and answer breakdowns.
9. **`mind_maps`**: SVG/JSON tree structures.
10. **`study_plans`**: Targeted exam date schedules and daily milestones.
11. **`shared_resources` & `resource_reviews`**: Community sharing hub & student reviews.
12. **`chat_sessions` & `chat_messages`**: Conversational history.
13. **`usage_stats`**: Weekly analytics, streak counters, and earned badges.

---

## 🔌 Notion Sync Integration

Easily export any generated summary or study note directly to your Notion workspace:
- **Live Connection Test (`/api/notion/test`)**: Validates Notion Integration Token and Database ID in real-time, fetching workspace and database title (`Projects`).
- **One-Click Page Creation (`/api/notion/sync`)**: Creates formatted pages directly inside the user's Notion database.
- **Smart URL Parsing**: Automatically extracts Database IDs from full Notion URLs.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Omarsaeed10/sofraa.git

# Navigate to backend directory
cd Aethera/backend

# Install dependencies
npm install

# Start local server (Runs on http://localhost:34567)
npm start
```

---

## 🛡️ License

This project is open-source and free for educational use under the MIT License. Created by **Omar Saeed** for the **AI Ambassadors Program (Batch 8)**.
