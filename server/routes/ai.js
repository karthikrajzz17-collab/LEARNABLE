import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Helper: Smart rule-based pedagogical tutor response generator
function generateLocalBuddyResponse({ message, lessonTitle, activityQuestion, childName = "Friend", accessibilityProfile }) {
  const lowerMsg = (message || '').toLowerCase();

  // Child safety check
  const sensitiveWords = ['password', 'address', 'phone', 'secret', 'hate', 'stupid', 'dumb', 'ugly'];
  for (const word of sensitiveWords) {
    if (lowerMsg.includes(word)) {
      return `Hey ${childName}! 🌟 Buddy is here to help you learn and have fun safely. Let's focus on our awesome learning quest! What can we solve together?`;
    }
  }

  // Encouraging requests for hints
  if (lowerMsg.includes('hint') || lowerMsg.includes('help') || lowerMsg.includes("don't know") || lowerMsg.includes('stuck') || lowerMsg.includes('hard')) {
    if (lessonTitle?.includes('Phonics') || lowerMsg.includes('rhyme') || lowerMsg.includes('sound')) {
      return `You can do this, ${childName}! 🦉 Here is a secret clue: Listen closely to the sound at the very end of the word. Does 'CAT' end like '-at'? Say 'Bat' and 'Cat' out loud together—can you hear the singing twins? 🎵`;
    }
    if (lessonTitle?.includes('Safari') || lowerMsg.includes('count') || lowerMsg.includes('math') || lowerMsg.includes('plus')) {
      return `Here is a fun trick, ${childName}! 🦁 Try using your fingers or tap your screen to count each friend one by one: One... Two... Three! When we put them all in one big basket, what total do you see?`;
    }
    if (lessonTitle?.includes('Feelings') || lowerMsg.includes('feel') || lowerMsg.includes('sad') || lowerMsg.includes('mad')) {
      return `I hear you, ${childName}! 💖 It's super normal to feel unsure sometimes. Let's take one gentle balloon breath together: in... and out! You are doing amazing just by trying!`;
    }
    return `You're trying so hard, ${childName}, and that's what champions do! ⭐ Break the problem into small pieces. What is the very first thing you notice? Take your time, no rush at all!`;
  }

  // Answering "what is the answer"
  if (lowerMsg.includes('answer') || lowerMsg.includes('give me the answer') || lowerMsg.includes('tell me')) {
    return `Ooh, nice try! 😉 But you are much too clever for me to give away the treasure without you finding it! I believe in your brain power! Look at the choices: which one feels like the best match?`;
  }

  // Feelings / Greeting
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
    return `Hi there, super learner ${childName}! 🚀 I'm Buddy, and I'm thrilled to be your learning sidekick today! What adventure shall we conquer next?`;
  }

  if (lowerMsg.includes('good') || lowerMsg.includes('happy') || lowerMsg.includes('fun') || lowerMsg.includes('great')) {
    return `Yaaay! 🎉 High five! Seeing you smile makes my robotic feathers sparkle! Keep that wonderful curiosity going!`;
  }

  // Profile-specific tone additions
  if (accessibilityProfile === 'dyslexia') {
    return `Great question, ${childName}! 🌟 Try reading it slowly with our reading ruler, or click the speaker button next to the question to hear it aloud. You have got this!`;
  }

  // General fallback encouragement
  return `That's a thoughtful question, ${childName}! 🌟 In learning, every question makes our brains grow a little stronger. Let's look at what we've discovered so far and take the next step together!`;
}

// POST /api/ai/tutor
router.post('/tutor', async (req, res) => {
  const { message, childId = 'c-1', lessonTitle, activityQuestion } = req.body;
  const child = db.data.children.find(c => c.id === childId) || db.data.children[0];

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      // Call Google Gemini API
      const prompt = `You are "LearnAble Buddy", a friendly, warm, empathetic AI learning companion for a child named ${child.displayName} (Age: ${child.ageGroup}, Special Learning Profile: ${child.accessibilityProfile}).
Your core rules:
1. Use simple, child-friendly, encouraging words suitable for elementary schoolers.
2. Give helpful hints and guided questions, NEVER blurt out the direct answer.
3. Keep answers concise (2 to 4 friendly sentences).
4. Include friendly emojis (🌟, 🦉, 🚀, 🎈).
5. Never ask for private personal info.
6. Context: Current lesson is "${lessonTitle || 'Inclusive Learning'}", current question is "${activityQuestion || 'General Learning'}".
Child says: "${message}"`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 150, temperature: 0.7 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          // Log interaction
          db.data.aiInteractions.push({
            id: `ai-${Date.now()}`,
            childId: child.id,
            role: 'assistant',
            message: reply,
            timestamp: new Date().toISOString()
          });
          db.save();

          return res.json({ success: true, reply, source: 'gemini' });
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed, using intelligent safe fallback:", err.message);
    }
  }

  // Built-in intelligent child-safe pedagogical response
  const reply = generateLocalBuddyResponse({
    message,
    lessonTitle,
    activityQuestion,
    childName: child.displayName.split(' ')[0],
    accessibilityProfile: child.accessibilityProfile
  });

  db.data.aiInteractions.push({
    id: `ai-${Date.now()}`,
    childId: child.id,
    role: 'assistant',
    message: reply,
    timestamp: new Date().toISOString()
  });
  db.save();

  res.json({
    success: true,
    reply,
    source: 'learnable-pedagogical-engine'
  });
});

// POST /api/ai/recommend
router.post('/recommend', (req, res) => {
  const { childId = 'c-1' } = req.body;
  const child = db.data.children.find(c => c.id === childId) || db.data.children[0];
  const progressList = db.data.progress.filter(p => p.childId === child.id);

  // Identify weak areas (accuracy < 80%) or lessons not completed
  const weakProgress = progressList.find(p => p.accuracy < 80);
  let recommendedLesson = null;
  let reason = "";

  if (weakProgress) {
    recommendedLesson = db.data.lessons.find(l => l.id === weakProgress.lessonId);
    reason = `Targeted practice for ${recommendedLesson?.title} to boost mastery from ${weakProgress.accuracy}% up to 100%!`;
  } else {
    // Recommend next open lesson
    const completedIds = progressList.filter(p => p.status === 'completed').map(p => p.lessonId);
    recommendedLesson = db.data.lessons.find(l => !completedIds.includes(l.id)) || db.data.lessons[0];
    reason = `Recommended next step in ${child.displayName}'s journey based on consistent 90%+ accuracy!`;
  }

  const nextActivity = db.data.activities.find(a => a.lessonId === recommendedLesson?.id) || db.data.activities[0];

  res.json({
    success: true,
    recommendedLesson,
    nextActivity,
    reason,
    learningLevel: child.learningLevel,
    accessibilityBoost: `Adapted layout for ${child.accessibilityProfile.toUpperCase()} learning mode`
  });
});

// POST /api/ai/adapt
router.post('/adapt', (req, res) => {
  const { childId = 'c-1', recentAccuracy, timeSpentAvg } = req.body;
  const child = db.data.children.find(c => c.id === childId) || db.data.children[0];

  let adaptation = "";
  let oldLevel = child.learningLevel;

  if (recentAccuracy >= 90) {
    if (child.learningLevel === 'Beginner') {
      child.learningLevel = 'Intermediate';
      adaptation = "Promoted from Beginner to Intermediate difficulty due to outstanding high accuracy!";
    } else if (child.learningLevel === 'Intermediate') {
      child.learningLevel = 'Advanced';
      adaptation = "Promoted to Advanced challenges! Great progress!";
    } else {
      adaptation = "Maintaining high mastery level with bonus enrichment quests!";
    }
  } else if (recentAccuracy < 65) {
    if (child.learningLevel === 'Advanced') {
      child.learningLevel = 'Intermediate';
      adaptation = "Adjusted to Intermediate to reinforce core foundations with gentle scaffolding.";
    } else if (child.learningLevel === 'Intermediate') {
      child.learningLevel = 'Beginner';
      adaptation = "Adjusted to Beginner with extra audio cues and unlimited hints to build confidence.";
    } else {
      adaptation = "Enabled extra visual scaffolding and Buddy auto-hints.";
    }
  } else {
    adaptation = "Difficulty pacing is well balanced.";
  }

  db.save();

  res.json({
    success: true,
    learningLevel: child.learningLevel,
    adaptation,
    changed: oldLevel !== child.learningLevel
  });
});

export default router;
