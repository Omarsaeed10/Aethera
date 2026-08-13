# ⚡ Aethera — AI Academic Assistant Platform

> **A comprehensive AI-powered academic suite built for university students** — Driven by **Groq AI (Llama 3.3 70B)**, featuring 30+ study tools, a modern Glassmorphism interface, offline capabilities, and direct **Notion Sync** integration.

[![GitHub Repository](https://img.shields.io/badge/GitHub-Omarsaeed10%2Fsofraa-181717?style=flat&logo=github)](https://github.com/Omarsaeed10/sofraa)
[![License: Free for Education](https://img.shields.io/badge/License-Free%20for%20Education-7c3aed)](#-license)
[![AI Engine](https://img.shields.io/badge/AI-Groq%20Llama%203.3%2070B-f55036?logo=groq)](https://groq.com/)

---

## 👤 Developer Profile

* **Developer Name:** Omar Saeed
* **GitHub Repository:** [github.com/Omarsaeed10/sofraa](https://github.com/Omarsaeed10/sofraa)

---

## 📁 Repository Structure & Editions

This repository houses two distinct editions of the platform:

1. **Standalone SPA Edition (Root Directory):**
   * Operates completely client-side via a single file (`index.html`) with zero installation needed.
   * Includes 17 essential academic tools running directly in the browser.

2. **Full-Stack PWA Edition ([Aethera/](./Aethera/)):**
   * Comprehensive full-stack application featuring 30+ academic tools.
   * Powered by a **Node.js + Express** REST API backend.
   * Dual database support: local **SQLite** & **PostgreSQL / Supabase** schemas.
   * Direct **Notion API Integration (Notion Sync)** for auto-exporting study notes.

---

## 🎯 Features & Academic Toolkit (30+ Tools)

### 📚 Study & Synthesis Tools
* 📝 **Academic Summarizer:** Generate brief, detailed, critical review, or executive summaries with one-click **Notion Sync**.
* ❓ **Exam Question Generator:** Multiple-choice (MCQ), essay, short answer, true/false, and case studies with customizable difficulty levels.
* 💡 **Concept Deep Dive:** Comprehensive breakdown including definitions, foundational theories, historical context, key scholars, applications, and misconceptions.
* 📅 **Smart Study Planner:** Customized schedules using Pomodoro, Spaced Repetition, or intensive exam review modes.
* ✍️ **Essay Assistant:** Thesis generator, structural outlines, argument formulation, counterarguments, and writing tips.
* 📖 **Citation Builder:** Instant reference generator supporting APA 7th, MLA 9th, Chicago, Harvard, IEEE, and Vancouver styles.
* 🌍 **Smart Academic Translator:** Context-aware translation across 6 languages with register tuning.
* 🎧 **Text-to-Speech (TTS):** Browser-native audio reading with speed, pitch, and voice controls.

### 🧠 Interactive Learning & Advanced AI
* 🧠 **Flashcard Generator:** Interactive flip-cards with review tracking and export options for **Anki**.
* 🗺️ **Mind Map Visualizer:** Interactive SVG concept maps generated on the fly.
* 🔍 **Research Assistant:** Structured research briefs covering literature angles, methodology, and theoretical frameworks.
* 🔄 **Concept Compare:** Side-by-side analytical comparisons of two theories, systems, or concepts.
* 🤖 **Academic AI Chat:** Context-aware assistant dedicated to answering complex course questions.
* 🎓 **GPA Calculator:** Multi-semester GPA calculator and projector with dynamic semester controls (`+ Semester` / `- Semester`).
* 🔌 **Notion Sync Integration:** Export study outputs directly into your Notion workspace database with real-time connection verification.

---

## 🚀 Quick Start Guide

### 1️⃣ Standalone Mode (Zero Setup)
1. Open [`index.html`](./index.html) directly in any modern web browser.
2. Click **🔑 Groq API Key** in the sidebar to enter your key (obtain a free key at [consolegroq.com](https://console.groq.com)).
3. Select any tool and start learning immediately.

### 2️⃣ Full-Stack Mode (Backend Setup)
```bash
# Clone the repository
git clone https://github.com/Omarsaeed10/sofraa.git

# Navigate to the backend directory
cd sofraa/Aethera/backend

# Install dependencies
npm install

# Start the local backend server (Runs on http://localhost:34567)
npm start
```

---

## 🛡️ License

Created by **Omar Saeed**. Free for educational and non-commercial use under the MIT License.
