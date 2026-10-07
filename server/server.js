import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import childrenRoutes from './routes/children.js';
import lessonsRoutes from './routes/lessons.js';
import activitiesRoutes from './routes/activities.js';
import aiRoutes from './routes/ai.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'LearnAble AI Inclusive Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend dist if it exists (for single-server production deployment)
const distPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(distPath));

// For non-API routes, fallback to index.html if dist exists
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('LearnAble API Server running on port ' + PORT);
    }
  });
});

app.listen(PORT, () => {
  console.log(`🌟 LearnAble Backend Server listening on http://localhost:${PORT}`);
});
