# ⚡ Aethera — University Edition (مشروع سفراء الذكاء الاصطناعي)

> **منصة أكاديمية متكاملة تدعم الذكاء الاصطناعي للطلاب الجامعيين** — مدعومة بنموذج **Groq AI (Llama 3.3 70B)**، وتتضمن أكثر من 30 أداة دراسية، واجهة أنيقة Glassmorphic، وتكامل مباشر مع **Notion Sync**.

[![GitHub Repository](https://img.shields.io/badge/GitHub-Omarsaeed10%2Fsofraa-181717?style=flat&logo=github)](https://github.com/Omarsaeed10/sofraa)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-mindsparkproo.netlify.app-00C7B7?style=flat&logo=netlify)](https://mindsparkproo.netlify.app/)
[![License: Free for Education](https://img.shields.io/badge/License-Free%20for%20Education-7c3aed)](#-license)
[![AI Engine](https://img.shields.io/badge/AI-Groq%20Llama%203.3%2070B-f55036?logo=groq)](https://groq.com/)

---

## 🎓 معلومات مشروع التخرج (Graduation Profile)

مشروع تخرج مقدم لبرنامج **سفراء الذكاء الاصطناعي (المستوى الأول) - الدفعة الثامنة**:
* **اسم الطالب:** عمر سعيد محمد كامل (Omar Saeed Mohamed Kamel)
* **كود الطالب:** `AI8 - G3 - 0543`
* **رابط العرض المباشر (Live Demo):** [mindsparkproo.netlify.app](https://mindsparkproo.netlify.app/)
* **مستودع الكود (GitHub):** [https://github.com/Omarsaeed10/sofraa](https://github.com/Omarsaeed10/sofraa)

---

## 📁 هيكلية المشروع (Project Structure)

يحتوي المستودع على نسختين رئيسيتين للمشروع:

1. **النسخة السريعة (Standalone SPA Edition - Root Directory):**
   * تعمل عبر ملف أحادي `index.html` دون الحاجة لأي خادم أو تثبيت (Zero Setup).
   * تحتوي على 17 أداة أكاديمية تعمل مباشرة في المتصفح.

2. **النسخة الكاملة (Full-Stack PWA Edition - [Aethera/](./Aethera/)):**
   * تطبيق أكاديمي متكامل يضم 30+ أداة دراسية.
   * خادم خلفي Node.js + Express.
   * قواعد بيانات SQLite و PostgreSQL / Supabase.
   * ربط وتزامن تلقائي مع **Notion (Notion Sync API)**.

---

## 🎯 الأدوات والخصائص (30+ Academic Tools)

### 📚 أدوات الدراسة والملخصات (Study Tools)
* 📝 **تلخيص الأبحاث والمحاضرات (Academic Summarizer):** ملخصات قصيرة، تفصيلية، مراجعة نقدية، أو ملخص تنفيذي مع دعم التصدير لـ Notion.
* ❓ **مولد أسئلة الامتحانات (Exam Question Generator):** أسئلة اختيار من متعدد، مقالية، صح/خطأ، وحالات دراسية مع تحديد مستوى الصعوبة.
* 💡 **الشرح العميق للمفاهيم (Concept Deep Dive):** تعريفات، نظريات، تاريخ، أشهر العلماء، والتطبيقات العملية.
* 📅 **مخطط الدراسة الذكي (Smart Study Planner):** جداول بومودورو، التكرار المتباعد (Spaced Repetition)، والمراجعة المكثفة.
* ✍️ **مساعد كتابة المقالات (Essay Assistant):** صياغة الفرضيات، الهيكل العام، الحجج والدلائل، والحجج المضادة.
* 📖 **مولد المراجع والأوثاق (Citation Builder):** صيغ APA 7th, MLA 9th, Chicago, Harvard, IEEE, Vancouver.
* 🌍 **المترجم الأكاديمي الذكي (Smart Translator):** ترجمة سياقية مع حفظ المصطلحات.
* 🎧 **القارئ الصوتي (Text to Speech):** تحويل النصوص إلى كلام منطوق مع التحكم في السرعة والصوت.

### 🧠 التعلم التفاعلي والذكاء الاصطناعي (Advanced AI & Interactive Learning)
* 🧠 **بطاقات الاستذكار (Flashcards Generator):** بطاقات تفاعلية مع إمكانية التصدير لتطبيق Anki.
* 🗺️ **الخرائط الذهنية (Mind Map Visualizer):** رسم خرائط ذهنية تفاعلية بصيغة SVG.
* 🔍 **مساعد الأبحاث (Research Assistant):** خطط ومصادر الأبحاث والأوراق العلمية.
* 🔄 **أداة المقارنة (Concept Compare):** مقارنة تحليلية بين مفهومين أو نظريتين.
* 🤖 **الشات الأكاديمي (AI Chat):** محادثة ذكية متخصصة تفهم السياق الأكاديمي.
* 🎓 **حاسبة المعدل التراكمي (GPA Calculator):** حساب وتوقع المعدل مع التحكم في الفصول الدراسية (`+ Semester` / `- Semester`).
* 🔌 **تكامل Notion Sync:** تصدير الملاحظات مباشرة إلى قاعدة بيانات Notion الخاصة بك بضغطة زر.

---

## 🚀 طريقة التشغيل والاستخدام (Getting Started)

### 1️⃣ التشغيل المباشر (Standalone Single Page App):
1. افتح ملف [`index.html`](./index.html) في أي متصفح.
2. أدخل مفتاح **Groq API Key** من زر الإعدادات (يمكنك الحصول عليه مجاناً من [console.groq.com](https://console.groq.com)).
3. اختر الأداة وابدأ الاستخدام فوراً!

### 2️⃣ تشغيل النسخة الكاملة (Full-Stack Edition):
```bash
# 1. استنساخ المستودع
git clone https://github.com/Omarsaeed10/sofraa.git

# 2. الانتقال لمجلد الباك إند
cd sofraa/Aethera/backend

# 3. تثبيت المكتبات
npm install

# 4. تشغيل الخادم المحلي (يعمل على http://localhost:34567)
npm start
```

---

## 🛡️ الترخيص والحقوق (License)

هذا المشروع مفتوح المصدر للاستخدام التعليمي، تم تطويره بواسطة **عمر سعيد (Omar Saeed)** ضمن برنامج **سفراء الذكاء الاصطناعي (الدفعة الثامنة)**.
