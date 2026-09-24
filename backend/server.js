import 'dotenv/config';
import app from './src/app.js';
import { initDatabase, db } from './src/config/db.js';
import { seedDatabase } from './src/services/seedService.js';

const PORT = process.env.PORT || 5000;

// Initialize database & tables
console.log('Initializing database...');
initDatabase();

// Seed initial master students and demo data if database is fresh
seedDatabase(false);

const server = app.listen(PORT, () => {
  console.log(`Campus Lost & Found Backend Server running on http://localhost:${PORT}`);
  console.log(`API Health Check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
const shutdown = () => {
  console.log('Shutting down server gracefully...');
  server.close(() => {
    try {
      db.close();
      console.log('Database connection closed.');
    } catch (err) {
      console.error('Error closing database:', err);
    }
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
