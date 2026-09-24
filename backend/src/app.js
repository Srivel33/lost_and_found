import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import lostRoutes from './routes/lostRoutes.js';
import foundRoutes from './routes/foundRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Root landing endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Campus Lost & Found API Server 🎒🔒',
    status: 'running',
    health: '/api/health',
    endpoints: {
      auth: '/api/auth',
      lost: '/api/lost',
      found: '/api/found',
      matches: '/api/matches',
      notifications: '/api/notifications',
      reports: '/api/reports',
      upload: '/api/upload'
    }
  });
});

// Base API index
app.get(['/api', '/api/'], (req, res) => {
  res.json({
    service: 'Campus Lost & Found REST API',
    status: 'healthy',
    version: '1.0.0',
    health: '/api/health',
    availableEndpoints: [
      '/api/auth',
      '/api/lost',
      '/api/found',
      '/api/matches',
      '/api/notifications',
      '/api/reports',
      '/api/upload'
    ]
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'campus-lost-and-found-backend', timestamp: new Date().toISOString() });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/lost', lostRoutes);
app.use('/api/found', foundRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.originalUrl} not found.`,
    apiIndex: '/api'
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error'
  });
});

export default app;
