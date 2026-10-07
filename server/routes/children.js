import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// List all children
router.get('/', (req, res) => {
  res.json({ success: true, children: db.data.children });
});

// Get single child by ID
router.get('/:id', (req, res) => {
  const child = db.data.children.find(c => c.id === req.params.id);
  if (!child) {
    return res.status(404).json({ success: false, message: 'Child profile not found.' });
  }
  res.json({ success: true, child });
});

// Update child accessibility preferences and profile
router.put('/:id/preferences', (req, res) => {
  const child = db.data.children.find(c => c.id === req.params.id);
  if (!child) {
    return res.status(404).json({ success: false, message: 'Child not found.' });
  }

  const { accessibilityProfile, accessibilitySettings, avatar, displayName } = req.body;
  if (accessibilityProfile) child.accessibilityProfile = accessibilityProfile;
  if (accessibilitySettings) {
    child.accessibilitySettings = {
      ...child.accessibilitySettings,
      ...accessibilitySettings
    };
  }
  if (avatar) child.avatar = avatar;
  if (displayName) child.displayName = displayName;

  db.save();
  res.json({ success: true, child });
});

// Get progress for child
router.get('/:id/progress', (req, res) => {
  const childId = req.params.id;
  const child = db.data.children.find(c => c.id === childId);
  const childProgress = db.data.progress.filter(p => p.childId === childId);

  // Join with lesson details
  const enrichedProgress = childProgress.map(p => {
    const lesson = db.data.lessons.find(l => l.id === p.lessonId);
    return {
      ...p,
      lessonTitle: lesson ? lesson.title : 'Lesson',
      lessonSubject: lesson ? lesson.subject : 'General',
      lessonIcon: lesson ? lesson.icon : '📖',
      lessonDifficulty: lesson ? lesson.difficulty : 'Easy'
    };
  });

  const totalLessons = db.data.lessons.length;
  const completedLessons = childProgress.filter(p => p.status === 'completed').length;
  const averageAccuracy = childProgress.length > 0 
    ? Math.round(childProgress.reduce((sum, p) => sum + p.accuracy, 0) / childProgress.length)
    : 100;

  res.json({
    success: true,
    progress: enrichedProgress,
    stats: {
      totalLessons,
      completedLessons,
      overallPercentage: Math.round((completedLessons / totalLessons) * 100),
      averageAccuracy,
      xp: child ? child.xp : 0,
      level: child ? child.level : 1,
      streak: child ? child.streak : 0
    }
  });
});

// Get AI recommendations for child
router.get('/:id/recommendations', (req, res) => {
  const child = db.data.children.find(c => c.id === req.params.id);
  if (!child) {
    return res.status(404).json({ success: false, message: 'Child not found.' });
  }

  const childProgress = db.data.progress.filter(p => p.childId === child.id);
  const completedLessonIds = childProgress.filter(p => p.status === 'completed').map(p => p.lessonId);

  // Next uncompleted or in-progress lesson
  let targetLesson = db.data.lessons.find(l => !completedLessonIds.includes(l.id)) || db.data.lessons[0];
  let targetActivity = db.data.activities.find(a => a.lessonId === targetLesson.id) || db.data.activities[0];

  // AI rationale based on child's profile
  let rationale = "Recommended to continue your joyful learning journey!";
  if (child.accessibilityProfile === 'dyslexia') {
    rationale = `Personalized for Leo: Audio-boosted activity with clear phonics rhythm to strengthen word recognition.`;
  } else if (child.accessibilityProfile === 'adhd') {
    rationale = `Personalized for Maya: Quick 3-minute interactive challenge with instant star rewards to keep focus strong!`;
  } else if (child.accessibilityProfile === 'autism') {
    rationale = `Personalized for Samir: Calm, structured activity with familiar visual cues and gentle pacing.`;
  } else if (child.accessibilityProfile === 'slow_learning') {
    rationale = `Personalized for Chloe: Step-by-step practice with unlimited friendly hints from Buddy!`;
  }

  res.json({
    success: true,
    recommendation: {
      lesson: targetLesson,
      activity: targetActivity,
      rationale,
      suggestedDifficulty: child.learningLevel,
      tutorEncouragement: `You're doing fantastic! Today we can explore ${targetLesson.title} together!`
    }
  });
});

// Get achievements for child
router.get('/:id/achievements', (req, res) => {
  const achievements = db.data.achievements.filter(a => a.childId === req.params.id);
  res.json({ success: true, achievements });
});

export default router;
