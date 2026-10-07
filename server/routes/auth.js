import express from 'express';
import { db } from '../db.js';

const router = express.Router();

router.post('/login', (req, res) => {
  const { role, username, password, demoMode } = req.body;

  if (demoMode) {
    if (role === 'administrator') {
      const admin = db.data.users.find(u => u.role === 'administrator');
      return res.json({
        success: true,
        user: admin,
        role: 'administrator',
        token: 'auth-admin-session-123'
      });
    } else {
      // Primary child profile
      const childUser = db.data.users.find(u => u.username === 'leo') || db.data.users.find(u => u.role === 'child');
      const childProfile = db.data.children.find(c => c.userId === childUser.id) || db.data.children[0];
      return res.json({
        success: true,
        user: childUser,
        child: childProfile,
        role: 'child',
        token: 'auth-child-session-456'
      });
    }
  }

  if (role === 'administrator') {
    const admin = db.data.users.find(u => u.role === 'administrator' && (u.username === username || username === 'admin@learnable.edu' || username === 'admin'));
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid administrator credentials. Please check your username and password.' });
    }
    return res.json({
      success: true,
      user: admin,
      role: 'administrator',
      token: 'admin-token-' + Date.now()
    });
  } else if (role === 'child') {
    const cleanUser = (username || '').trim().toLowerCase();
    const child = db.data.children.find(c => 
      c.displayName.toLowerCase().includes(cleanUser) || 
      db.data.users.find(u => u.id === c.userId && u.username.toLowerCase() === cleanUser)
    ) || db.data.children[0];

    const userObj = db.data.users.find(u => u.id === child.userId);

    return res.json({
      success: true,
      user: userObj || { id: child.userId, name: child.displayName, role: 'child' },
      child,
      role: 'child',
      token: 'child-token-' + Date.now()
    });
  }

  return res.status(400).json({ success: false, message: 'Please select a valid role.' });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { role = 'child', name, username, ageGroup = '7-9 years', accessibilityProfile = 'dyslexia', avatar = '🦊' } = req.body;

  if (!name || !username) {
    return res.status(400).json({ success: false, message: 'Name and username are required.' });
  }

  const userId = `u-${Date.now()}`;
  const newUser = {
    id: userId,
    name,
    username: username.toLowerCase(),
    role,
    createdAt: new Date().toISOString()
  };
  db.data.users.push(newUser);

  let newChild = null;
  if (role === 'child') {
    newChild = {
      id: `c-${Date.now()}`,
      userId,
      displayName: name,
      ageGroup,
      learningLevel: 'Beginner',
      accessibilityProfile,
      accessibilitySettings: {
        fontSize: 'large',
        highContrast: false,
        textToSpeech: true,
        audioInstructions: true,
        reducedAnimation: false,
        calmMode: false,
        fontFamily: 'lexend',
        readingRuler: true,
        largeButtons: true
      },
      xp: 100,
      level: 1,
      streak: 1,
      avatar,
      preferredLearningFormat: 'visual & audio',
      favoriteSubjects: ['Reading & Phonics']
    };
    db.data.children.push(newChild);
  }

  db.save();

  res.json({
    success: true,
    user: newUser,
    child: newChild,
    role,
    token: `token-${Date.now()}`
  });
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

router.get('/me', (req, res) => {
  const admin = db.data.users.find(u => u.role === 'administrator');
  const child = db.data.children[0];
  res.json({
    admin,
    child
  });
});

export default router;
