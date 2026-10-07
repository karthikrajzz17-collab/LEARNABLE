import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// List all activities, optionally filtered by lessonId
router.get('/', (req, res) => {
  const { lessonId } = req.query;
  let activities = db.data.activities;
  if (lessonId) {
    activities = activities.filter(a => a.lessonId === lessonId);
  }
  res.json({ success: true, activities });
});

// Get single activity
router.get('/:id', (req, res) => {
  const activity = db.data.activities.find(a => a.id === req.params.id);
  if (!activity) {
    return res.status(404).json({ success: false, message: 'Activity not found' });
  }
  res.json({ success: true, activity });
});

// Submit answer for activity
router.post('/:id/submit', (req, res) => {
  const { id } = req.params;
  const { childId = 'c-1', answer, timeSpentSeconds = 30 } = req.body;

  const activity = db.data.activities.find(a => a.id === id);
  if (!activity) {
    return res.status(404).json({ success: false, message: 'Activity not found' });
  }

  const child = db.data.children.find(c => c.id === childId) || db.data.children[0];

  let isCorrect = false;

  // Check correctness based on type
  if (activity.type === 'multiple_choice' || activity.type === 'image_id' || activity.type === 'story_choice' || activity.type === 'puzzle') {
    isCorrect = (answer === activity.correctAnswer);
  } else if (activity.type === 'match_pairs') {
    if (Array.isArray(answer)) {
      isCorrect = answer.length === (activity.pairs || []).length && answer.every(p => p.matched === true);
    } else {
      isCorrect = true;
    }
  } else if (activity.type === 'drag_drop') {
    if (typeof answer === 'object' && answer !== null) {
      isCorrect = activity.items.every(item => answer[item.id] === item.targetCategory);
    } else {
      isCorrect = true;
    }
  } else if (activity.type === 'memory_game') {
    isCorrect = answer?.completed === true || true;
  }

  // Adaptive rewards & XP
  const xpEarned = isCorrect ? (activity.xpReward || 40) : 10;
  const oldLevel = child.level;
  child.xp = (child.xp || 0) + xpEarned;

  // Level formula: Level = Math.floor(xp / 200) + 1
  const newLevel = Math.floor(child.xp / 200) + 1;
  const leveledUp = newLevel > oldLevel;
  child.level = newLevel;

  // Streak logic
  if (isCorrect) {
    child.streak = (child.streak || 1);
  }

  // Update progress for this lesson
  let progressRecord = db.data.progress.find(p => p.childId === child.id && p.lessonId === activity.lessonId);
  if (!progressRecord) {
    progressRecord = {
      id: `prg-${Date.now()}`,
      childId: child.id,
      lessonId: activity.lessonId,
      completionPercentage: isCorrect ? 100 : 50,
      accuracy: isCorrect ? 100 : 60,
      timeSpent: timeSpentSeconds,
      lastAccessed: new Date().toISOString(),
      status: isCorrect ? 'completed' : 'in_progress'
    };
    db.data.progress.push(progressRecord);
  } else {
    progressRecord.timeSpent += timeSpentSeconds;
    progressRecord.lastAccessed = new Date().toISOString();
    if (isCorrect) {
      progressRecord.completionPercentage = Math.min(100, progressRecord.completionPercentage + 30);
      progressRecord.accuracy = Math.round((progressRecord.accuracy + 100) / 2);
      if (progressRecord.completionPercentage >= 100) {
        progressRecord.status = 'completed';
      }
    } else {
      progressRecord.accuracy = Math.max(50, Math.round((progressRecord.accuracy + 60) / 2));
    }
  }

  // Check achievements unlock
  let unlockedBadge = null;
  if (isCorrect) {
    const explorerBadge = db.data.achievements.find(a => a.childId === child.id && a.id === 'ach-5' && !a.earnedAt);
    if (explorerBadge) {
      explorerBadge.earnedAt = new Date().toISOString();
      child.xp += explorerBadge.xpReward;
      unlockedBadge = explorerBadge;
    }
  }

  // Dynamic Adaptive Feedback
  let adaptiveFeedback = "";
  if (isCorrect) {
    adaptiveFeedback = "Terrific work! You grasped this concept quickly. Moving forward with more exciting quests!";
  } else {
    adaptiveFeedback = "Every mistake is just a stepping stone! Buddy is giving you a super helpful hint to try again!";
  }

  db.save();

  res.json({
    success: true,
    isCorrect,
    xpEarned,
    totalXp: child.xp,
    level: child.level,
    leveledUp,
    streak: child.streak,
    hint: !isCorrect ? activity.hint : null,
    explanation: activity.explanation,
    unlockedBadge,
    adaptiveFeedback
  });
});

export default router;
