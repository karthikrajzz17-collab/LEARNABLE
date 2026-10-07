# 🌟 LearnAble • AI-Powered Inclusive Learning Platform

> **"Learning that understands you."**  
> An inclusive, child-friendly learning platform that adapts learning experiences to individual children using AI, gamification, and accessibility features.

---

## 🎯 Target Users & Neurodiversity Profiles

- **Children with Special Learning Needs**:
  - **Dyslexia**: Lexend typography, enlarged letter spacing, reading focus ruler, text-to-speech audio support for all prompts.
  - **ADHD**: Interactive reading ruler, 3-minute micro-lessons, minimal visual clutter, immediate star & streak feedback.
  - **Autism & Sensory Sensitive**: Calm Sensory Mode (muted earth tones, reduced visual stimulation, zero jarring motion or sounds), predictable visual journey.
  - **Paced & Slow Learning**: Adaptive difficulty scaffolding, repetition with zero penalties, unlimited gentle hints from LearnAble Buddy.
- **Administrators & Educators**:
  - Full SaaS dashboard to monitor student rosters, track accuracy trends, review AI intervention alerts, and create/manage learning content.
- **Teachers & Interventionists**:
  - Track assigned classes, identify struggling concepts, and adjust learning levels.
- **Parents & Guardians**:
  - Simple oversight into streaks, badges, and learning milestones.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Development Mode (Recommended for Active Development)
Runs the backend API on **port 5000** and the Vite frontend with Hot Module Replacement on **port 3000** concurrently:
```bash
npm run dev
```
*(Or on Windows, double-click `dev.bat` or run `node dev.js`)*

Open your browser to: **[http://localhost:3000](http://localhost:3000)**  
*(API requests are automatically proxied to `http://localhost:5000`)*

---

### 2. Production / Single-Server Mode
Builds and serves both the API and client on a single port:
```bash
npm start
```
Open your browser to: **[http://localhost:5000](http://localhost:5000)**

---

## 🔑 Platform User Profiles

| Role | Username | Password | Features |
|---|---|---|---|
| **Student (Dyslexia)** | `leo` | *(Quick sign-in available)* | Leo Garcia (Dyslexia Profile, Level 3, 5-Day Streak, XP: 420+) |
| **Student (ADHD)** | `maya` | *(Quick sign-in available)* | Maya Chen (ADHD Profile, Level 4, 8-Day Streak, High Focus Games) |
| **Student (Autism)** | `samir` | *(Quick sign-in available)* | Samir Patel (Autism Sensory Profile, Level 2, Calm Mode) |
| **Student (Paced)** | `chloe` | *(Quick sign-in available)* | Chloe Dupont (Paced Learning, Level 2, Step-by-Step Audio) |
| **Lead Administrator** | `admin@learnable.edu` | `admin123` | Dr. Sarah Collins (Full dashboard, AI insights, student roster, analytics, lesson studio) |

> ⚡ **Quick Access**: The login screens feature 1-click sign-in options to immediately navigate each profile.

---

## 🌟 Core System Architecture

```
karthik prototype/
├── server/
│   ├── data/
│   │   └── database.json          # Persistent JSON store for children, lessons, activities, analytics
│   ├── routes/
│   │   ├── auth.js                # Role-based auth (admin & child)
│   │   ├── children.js            # Profiles, progress, recommendations, preferences
│   │   ├── lessons.js             # Lesson listings, slide sequences, activity attachments
│   │   ├── activities.js          # Interactive mini-game submission & XP engine
│   │   ├── ai.js                  # LearnAble Buddy tutor, recommendation engine, adaptive pacing
│   │   └── admin.js               # SaaS metrics, roster, lesson CRUD, AI insights
│   ├── db.js                      # In-memory + persistent database controller
│   └── server.js                  # Express backend with CORS & static dist hosting (Port 5000)
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AccessibilityToolbar.tsx  # Universal floating toolbar & 1-click profiles
│   │   │   ├── MascotBuddy.tsx           # Expressive animated LearnAble Buddy mascot
│   │   │   ├── Navbar.tsx                # Role-aware navigation with streak & level counters
│   │   │   └── IepReportModal.tsx        # 1-Click IEP progress summary report for educators
│   │   ├── context/
│   │   │   ├── AccessibilityContext.tsx  # Global DOM accessibility manager
│   │   │   └── AuthContext.tsx           # Authentication & session store
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx           # Public showcase & demo launchpad
│   │   │   ├── auth/LoginPage.tsx        # Dual-mode login (Child friendly & Admin SaaS)
│   │   │   ├── child/
│   │   │   │   ├── ChildDashboard.tsx    # Child home with streak, quest, and quick continue
│   │   │   │   ├── LearningPathView.tsx  # Interactive visual journey path with island nodes
│   │   │   │   ├── LessonView.tsx        # Step-by-step lesson reader with text-to-speech
│   │   │   │   ├── ActivityRunner.tsx    # 7 mini-game types + confetti + audio fanfare
│   │   │   │   ├── CalmCornerView.tsx    # Sensory balloon breathing & silicone fidget popper
│   │   │   │   ├── ChildProgressView.tsx # Mastery breakdown, accuracy chart, and quest log
│   │   │   │   ├── AiTutorView.tsx       # Safe LearnAble Buddy chat with voice input/output
│   │   │   │   ├── AchievementsView.tsx  # Trophy room & unlocked badges
│   │   │   │   └── ChildProfileView.tsx  # Avatar picker & personalized preferences
│   │   │   └── admin/
│   │   │       └── AdminDashboard.tsx    # Professional SaaS dashboard with charts & AI insights
│   │   ├── utils/
│   │   │   ├── sound.ts                  # Web Audio API sound synthesizer (pleasant chimes & sensory pops)
│   │   │   └── speech.ts                 # Web Speech API text-to-speech wrapper
│   │   ├── index.css                     # Tailwind CSS, Lexend typography, Calm & Contrast modes
│   │   └── App.tsx                       # Client-side router and root providers
│   └── dist/                             # Compiled production build
└── package.json                          # Root runner scripts
```

---

## 🎨 Supported Interactive Mini-Games & Sensory Tools

### 1. Interactive Learning Activities
The `ActivityRunner` component natively supports 7 diverse learning activity types:
1. **Multiple Choice**: Large accessible touch cards with speech synthesis and instant feedback.
2. **Match the Pairs**: Interactive phonics and vocabulary pairing.
3. **Drag and Drop / Sorting**: Categorize safari animals into "Small Friends" vs "Big Giants" baskets.
4. **Image & Emoji Identification**: Touch the happy smiling face buddy.
5. **Story-Based Choices**: Narrative dilemmas with calm emotional choices (e.g. Buddy's balloon breathing).
6. **Cosmic Memory Game**: Interactive flip-card matching puzzle for working memory.
7. **Safari Math Puzzle**: Fruit math puzzle with tactile visual counters.

### 2. The Calm Down Corner
A dedicated sensory decompression space for children experiencing sensory overwhelm:
- **Guided Balloon Breathing**: 4-2-4 rhythmic mindful breathing animation with soothing chime synthesizer.
- **Sensory Silicone Fidget Popper**: 25-bubble interactive bubble popper with tactile audio pops and haptic-friendly state.

### 3. 1-Click IEP Summary Generator (Educators & Admins)
- Accessible directly from the Administrator child roster.
- Generates official, printable Individualized Education Program (IEP) progress reports with mastery breakdown, accommodation telemetry, behavioral engagement notes, and AI-recommended curriculum targets.

---

## 🤖 Safe AI & Adaptive Engine

### LearnAble Buddy Guardrails
- **Child-Safe Language**: Positive, warm, empathetic language calibrated for ages 6–10.
- **Pedagogical Scaffolding**: Never blurts out answers; provides guided clues and questions to build confidence.
- **Safety Filters**: Blocks requests for personal information, names, passwords, or locations.
- **Optional LLM Integration**: Automatically utilizes `process.env.GEMINI_API_KEY` for Google Gemini models, with a built-in pedagogical rule engine when no key is provided.

### Dynamic Difficulty Adaptation
- **Promotions**: If a child achieves $\ge 90\%$ accuracy, the platform automatically advances them to the next difficulty level.
- **Gentle Support**: If a child encounters friction ($< 65\%$ accuracy), the platform adjusts pacing, reduces choices, and activates Buddy auto-hints without punitive feedback.

---

## ♿ Mandatory Accessibility Features

- **Text Size**: Regular, Large (+15%), Extra Large (+30%).
- **High Contrast**: Bold yellow against deep black background.
- **Calm Sensory Mode**: Muted earth tones and gentle contrasts for sensory-sensitive children.
- **Reduced Animation**: Eliminates jarring motion and screen shakes.
- **Dyslexia-Friendly Typography**: Lexend typography with increased letter and line spacing.
- **Sensory Decompression**: 1-click Calm Down Corner accessible from any child screen.
- **Text-to-Speech (TTS)**: One-touch audio reading on every slide, question, and prompt.
- **Web Audio Sound Synthesizer**: Pleasant chimes, pops, and fanfares with mute toggle.
