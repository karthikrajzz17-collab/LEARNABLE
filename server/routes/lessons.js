import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// List all lessons
router.get('/', (req, res) => {
  const childId = req.query.childId || 'c-1';
  const childProgress = db.data.progress.filter(p => p.childId === childId);

  const lessons = db.data.lessons.map(lesson => {
    const prog = childProgress.find(p => p.lessonId === lesson.id);
    const relatedActivities = db.data.activities.filter(a => a.lessonId === lesson.id);
    
    // Determine locked status: lesson 1 is always unlocked. Others unlock if previous is completed or order <= 2
    let isUnlocked = lesson.order <= 2;
    if (lesson.order > 2) {
      const prevLesson = db.data.lessons.find(l => l.order === lesson.order - 1);
      if (prevLesson) {
        const prevProg = childProgress.find(p => p.lessonId === prevLesson.id);
        if (prevProg && (prevProg.status === 'completed' || prevProg.completionPercentage >= 70)) {
          isUnlocked = true;
        }
      }
    }

    return {
      ...lesson,
      completionPercentage: prog ? prog.completionPercentage : 0,
      status: prog ? prog.status : (isUnlocked ? 'available' : 'locked'),
      isUnlocked,
      activityCount: relatedActivities.length
    };
  });

  res.json({ success: true, lessons });
});

// Get single lesson details with slides and activities
router.get('/:id', (req, res) => {
  const lesson = db.data.lessons.find(l => l.id === req.params.id);
  if (!lesson) {
    return res.status(404).json({ success: false, message: 'Lesson not found' });
  }

  const activities = db.data.activities.filter(a => a.lessonId === lesson.id);

  res.json({
    success: true,
    lesson,
    activities
  });
});

export default router;
