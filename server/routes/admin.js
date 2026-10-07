import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/admin/dashboard
router.get('/dashboard', (req, res) => {
  const totalChildren = db.data.children.length;
  const activeChildren = db.data.children.filter(c => c.streak > 0).length;
  const totalLessons = db.data.lessons.length;
  const completedProgress = db.data.progress.filter(p => p.status === 'completed');
  const completedLessons = completedProgress.length;
  
  const allAccuracies = db.data.progress.map(p => p.accuracy).filter(a => a > 0);
  const avgAccuracy = allAccuracies.length > 0
    ? Math.round(allAccuracies.reduce((a, b) => a + b, 0) / allAccuracies.length)
    : 85;

  const totalTimeMinutes = Math.round(db.data.progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0) / 60);

  res.json({
    success: true,
    stats: {
      totalChildren,
      activeChildren,
      completedLessons,
      totalLessons,
      averageProgress: Math.min(100, Math.round((completedLessons / (totalChildren * totalLessons)) * 100)),
      averageAccuracy: avgAccuracy,
      learningEngagement: "94.2%",
      activeLearningSessions: 3,
      totalTimeMinutes
    }
  });
});

// GET /api/admin/children
router.get('/children', (req, res) => {
  const enriched = db.data.children.map(child => {
    const progressList = db.data.progress.filter(p => p.childId === child.id);
    const completed = progressList.filter(p => p.status === 'completed').length;
    const avgAcc = progressList.length > 0 
      ? Math.round(progressList.reduce((sum, p) => sum + p.accuracy, 0) / progressList.length)
      : 80;
    
    // Status flag
    let supportFlag = "On Track";
    if (avgAcc < 75) supportFlag = "Needs Assistance";
    else if (avgAcc >= 90) supportFlag = "Excelling";

    return {
      ...child,
      completedLessons: completed,
      totalLessons: db.data.lessons.length,
      averageAccuracy: avgAcc,
      supportFlag,
      progressList
    };
  });

  res.json({ success: true, children: enriched });
});

// GET /api/admin/teachers
router.get('/teachers', (req, res) => {
  res.json({ success: true, teachers: db.data.teachers });
});

// GET /api/admin/analytics
router.get('/analytics', (req, res) => {
  // Profile breakdown
  const profileCounts = {
    dyslexia: 0,
    adhd: 0,
    autism: 0,
    slow_learning: 0,
    default: 0
  };
  db.data.children.forEach(c => {
    if (profileCounts[c.accessibilityProfile] !== undefined) {
      profileCounts[c.accessibilityProfile]++;
    } else {
      profileCounts.default++;
    }
  });

  // Level breakdown
  const levelCounts = {
    Beginner: 0,
    Intermediate: 0,
    Advanced: 0
  };
  db.data.children.forEach(c => {
    if (levelCounts[c.learningLevel] !== undefined) {
      levelCounts[c.learningLevel]++;
    }
  });

  // Weekly engagement
  const weeklyEngagement = [
    { day: "Mon", sessions: 18, completions: 14, avgMinutes: 22 },
    { day: "Tue", sessions: 24, completions: 19, avgMinutes: 28 },
    { day: "Wed", sessions: 22, completions: 17, avgMinutes: 25 },
    { day: "Thu", sessions: 29, completions: 26, avgMinutes: 32 },
    { day: "Fri", sessions: 35, completions: 31, avgMinutes: 38 },
    { day: "Sat", sessions: 20, completions: 18, avgMinutes: 20 },
    { day: "Sun", sessions: 16, completions: 12, avgMinutes: 19 }
  ];

  // Subject accuracy & engagement
  const subjectPerformance = [
    { subject: "Reading & Phonics", accuracy: 88, completed: 15, avgTimeMin: 9 },
    { subject: "Math", accuracy: 91, completed: 18, avgTimeMin: 12 },
    { subject: "Emotions & Social", accuracy: 96, completed: 12, avgTimeMin: 7 },
    { subject: "Science & Nature", accuracy: 84, completed: 8, avgTimeMin: 10 },
    { subject: "Focus & Logic", accuracy: 89, completed: 10, avgTimeMin: 8 }
  ];

  res.json({
    success: true,
    profileCounts,
    levelCounts,
    weeklyEngagement,
    subjectPerformance
  });
});

// GET /api/admin/insights
router.get('/insights', (req, res) => {
  const supportStudents = [
    {
      childId: "c-4",
      displayName: "Chloe Dupont",
      profile: "Slow Learning",
      reason: "Accuracy dropped to 70% in Phonics word matching. Needs repeated audio drills.",
      suggestedAction: "Enable audio-first flashcards and reduce choices from 3 to 2.",
      severity: "medium"
    },
    {
      childId: "c-3",
      displayName: "Samir Patel",
      profile: "Autism (Sensory Sensitive)",
      reason: "Spends more than 10 minutes on multi-step puzzles. May feel visual overwhelm.",
      suggestedAction: "Activate Calm Mode preset and break puzzles into single-step prompts.",
      severity: "low"
    }
  ];

  const commonDifficultConcepts = [
    {
      concept: "Rhyming Vowel Distinctions",
      subject: "Reading & Phonics",
      failureRate: "28%",
      aiRecommendation: "Add interactive speech synthesis replay for subtle vowel changes."
    },
    {
      concept: "Multi-object Grouping Comparisons",
      subject: "Math",
      failureRate: "22%",
      aiRecommendation: "Introduce tactile drag-and-drop counters before quizzing."
    }
  ];

  const personalizedRecommendations = [
    {
      title: "Adaptive Pacing Adjustment",
      description: "Leo Garcia has maintained 95% accuracy over 5 consecutive days. Ready for promotion to Intermediate Reading adventures."
    },
    {
      title: "Sensory Balance Notice",
      description: "ADHD preset users exhibited a 35% increase in task completion when the Reading Ruler and micro-checkpoints were enabled."
    }
  ];

  res.json({
    success: true,
    supportStudents,
    commonDifficultConcepts,
    personalizedRecommendations
  });
});

// POST /api/admin/lessons (Create lesson)
router.post('/lessons', (req, res) => {
  const { title, description, subject, difficulty, estimatedMinutes, icon, slides = [] } = req.body;
  if (!title || !subject) {
    return res.status(400).json({ success: false, message: 'Title and subject are required.' });
  }

  const newLesson = {
    id: `les-${Date.now()}`,
    title,
    description: description || 'New learning module',
    subject,
    difficulty: difficulty || 'Easy',
    order: db.data.lessons.length + 1,
    icon: icon || '📘',
    color: 'from-blue-400 to-indigo-500',
    estimatedMinutes: Number(estimatedMinutes) || 8,
    status: 'published',
    slides: slides.length > 0 ? slides : [
      {
        title: `Welcome to ${title}!`,
        text: 'Let us begin this joyful lesson step by step together!',
        tip: 'Click Next or listen to the voice reader.'
      }
    ]
  };

  db.data.lessons.push(newLesson);
  db.save();

  res.json({ success: true, lesson: newLesson });
});

// PUT /api/admin/lessons/:id
router.put('/lessons/:id', (req, res) => {
  const lesson = db.data.lessons.find(l => l.id === req.params.id);
  if (!lesson) {
    return res.status(404).json({ success: false, message: 'Lesson not found' });
  }

  const { title, description, subject, difficulty, estimatedMinutes, icon } = req.body;
  if (title) lesson.title = title;
  if (description) lesson.description = description;
  if (subject) lesson.subject = subject;
  if (difficulty) lesson.difficulty = difficulty;
  if (estimatedMinutes) lesson.estimatedMinutes = Number(estimatedMinutes);
  if (icon) lesson.icon = icon;

  db.save();
  res.json({ success: true, lesson });
});

// DELETE /api/admin/lessons/:id
router.delete('/lessons/:id', (req, res) => {
  const idx = db.data.lessons.findIndex(l => l.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Lesson not found' });
  }

  db.data.lessons.splice(idx, 1);
  db.save();
  res.json({ success: true, message: 'Lesson deleted successfully' });
});

// POST /api/admin/activities (Create activity)
router.post('/activities', (req, res) => {
  const { lessonId, type, title, question, promptAudio, options, pairs, categories, items, cards, hint, explanation, difficulty, xpReward } = req.body;
  
  const newActivity = {
    id: `act-${Date.now()}`,
    lessonId: lessonId || db.data.lessons[0].id,
    type: type || 'multiple_choice',
    title: title || 'Learning Challenge',
    question: question || 'Choose the best answer:',
    promptAudio: promptAudio || question,
    options: options || [
      { id: 'opt-1', text: 'Option A ⭐', isCorrect: true },
      { id: 'opt-2', text: 'Option B', isCorrect: false }
    ],
    pairs: pairs || [],
    categories: categories || [],
    items: items || [],
    cards: cards || [],
    correctAnswer: options ? options.find(o => o.isCorrect)?.id : 'opt-1',
    hint: hint || 'Take your time and look closely at the choices!',
    explanation: explanation || 'Awesome job!',
    difficulty: difficulty || 'easy',
    xpReward: Number(xpReward) || 40
  };

  db.data.activities.push(newActivity);
  db.save();

  res.json({ success: true, activity: newActivity });
});

// GET /api/admin/settings
router.get('/settings', (req, res) => {
  res.json({ success: true, settings: db.data.systemSettings });
});

// PUT /api/admin/settings
router.put('/settings', (req, res) => {
  const { tutorName, safetyLevel, adaptiveDifficulty, audioAssistanceDefault, dyslexiaFontDefault } = req.body;
  if (tutorName) db.data.systemSettings.tutorName = tutorName;
  if (safetyLevel) db.data.systemSettings.safetyLevel = safetyLevel;
  if (adaptiveDifficulty !== undefined) db.data.systemSettings.adaptiveDifficulty = adaptiveDifficulty;
  if (audioAssistanceDefault !== undefined) db.data.systemSettings.audioAssistanceDefault = audioAssistanceDefault;
  if (dyslexiaFontDefault !== undefined) db.data.systemSettings.dyslexiaFontDefault = dyslexiaFontDefault;

  db.save();
  res.json({ success: true, settings: db.data.systemSettings });
});

// POST /api/admin/reset
router.post('/reset', (req, res) => {
  const data = db.reset();
  res.json({ success: true, message: 'Database reset to platform baseline.', data });
});

export default router;
