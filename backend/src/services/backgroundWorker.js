import { EventEmitter } from 'events';
import { db } from '../config/db.js';
import { previewMatchesForLostPost } from './matchingService.js';
import { sendMatchAlertEmail } from './emailService.js';

// Simple in-memory background job queue using EventEmitter for asynchronous processing
class BackgroundWorker extends EventEmitter {
  constructor() {
    super();
    this.on('process_lost_post', this.processLostPost.bind(this));
    this.on('process_found_post', this.processFoundPost.bind(this));
  }

  async processLostPost(lostPostId) {
    console.log(`[BackgroundWorker] Processing lost post ${lostPostId} for matches...`);
    try {
      const lostPost = db.prepare('SELECT * FROM lost_posts WHERE id = ?').get(lostPostId);
      if (!lostPost) return;

      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(lostPost.user_id);
      
      const potentialMatches = previewMatchesForLostPost(lostPost, lostPost.user_id);
      
      let highestScore = 0;
      let newMatchesCount = 0;

      for (const match of potentialMatches) {
        // Check if match already exists
        const exists = db.prepare('SELECT 1 FROM matches WHERE lost_id = ? AND found_id = ?')
          .get(lostPost.id, match.id);

        if (!exists) {
          const matchId = `match_${Date.now()}_${Math.floor(Math.random()*1000)}`;
          // generate 6 digit handover code
          const handoverCode = Math.floor(100000 + Math.random() * 900000).toString();

          db.prepare(`
            INSERT INTO matches (id, lost_id, found_id, lost_user_id, found_user_id, score, band, why_matched, status, handover_code)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'open', ?)
          `).run(matchId, lostPost.id, match.id, lostPost.user_id, match.found_user_id || 'system', match.score, match.band, match.whyMatched, handoverCode);

          // Create notification for the lost item owner
          db.prepare(`
            INSERT INTO notifications (id, user_id, match_id, lost_id, message)
            VALUES (?, ?, ?, ?, ?)
          `).run(`notif_${Date.now()}`, lostPost.user_id, matchId, lostPost.id, `Potential ${match.band} match found for your ${lostPost.item_name}!`);

          newMatchesCount++;
          if (match.score > highestScore) highestScore = match.score;

          // Notify SSE connected clients (real-time push)
          this.emit('new_notification', lostPost.user_id);
        }
      }

      if (newMatchesCount > 0 && user?.email) {
        // Send email alert in background
        await sendMatchAlertEmail(user.email, user.name, lostPost.item_name, highestScore);
      }

      console.log(`[BackgroundWorker] Finished processing lost post ${lostPostId}. Created ${newMatchesCount} matches.`);
    } catch (err) {
      console.error(`[BackgroundWorker] Error processing lost post ${lostPostId}:`, err);
    }
  }

  async processFoundPost(foundPostId) {
    console.log(`[BackgroundWorker] Processing found post ${foundPostId} for matches...`);
    try {
      const foundPost = db.prepare('SELECT * FROM found_posts WHERE id = ?').get(foundPostId);
      if (!foundPost) return;

      const lostPosts = db.prepare('SELECT * FROM lost_posts WHERE status = ?').all('open');
      const { scoreMatchPair } = await import('./matchingService.js');

      let newMatchesCount = 0;

      for (const lostPost of lostPosts) {
        if (lostPost.user_id === foundPost.user_id) continue;

        const exists = db.prepare('SELECT 1 FROM matches WHERE lost_id = ? AND found_id = ?').get(lostPost.id, foundPost.id);
        if (exists) continue;

        const matchResult = scoreMatchPair(lostPost, foundPost);
        if (matchResult) {
          const matchId = `match_${Date.now()}_${Math.floor(Math.random()*1000)}`;
          const handoverCode = Math.floor(100000 + Math.random() * 900000).toString();

          db.prepare(`
            INSERT INTO matches (id, lost_id, found_id, lost_user_id, found_user_id, score, band, why_matched, status, handover_code)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'open', ?)
          `).run(matchId, lostPost.id, foundPost.id, lostPost.user_id, foundPost.user_id, matchResult.score, matchResult.band, matchResult.whyMatched, handoverCode);

          // Create notification for the lost item owner
          db.prepare(`
            INSERT INTO notifications (id, user_id, match_id, lost_id, message)
            VALUES (?, ?, ?, ?, ?)
          `).run(`notif_${Date.now()}`, lostPost.user_id, matchId, lostPost.id, `Potential ${matchResult.band} match found for your ${lostPost.item_name}!`);

          newMatchesCount++;
          
          const user = db.prepare('SELECT email, name FROM users WHERE id = ?').get(lostPost.user_id);
          if (user?.email) {
            await sendMatchAlertEmail(user.email, user.name, lostPost.item_name, matchResult.score);
          }

          this.emit('new_notification', lostPost.user_id);
        }
      }
      console.log(`[BackgroundWorker] Finished processing found post ${foundPostId}. Created ${newMatchesCount} matches.`);
    } catch (err) {
      console.error(`[BackgroundWorker] Error processing found post ${foundPostId}:`, err);
    }
  }

  // Helper method to enqueue job
  enqueueLostPostMatching(lostPostId) {
    this.emit('process_lost_post', lostPostId);
  }

  enqueueFoundPostMatching(foundPostId) {
    this.emit('process_found_post', foundPostId);
  }
}

export const jobQueue = new BackgroundWorker();
