import { Router } from 'express';
import {
  getMyMatches,
  getMatchDetail,
  submitHiddenQuestionAnswer,
  getVerifiedContact,
  confirmMatch,
  rejectMatch
} from '../controllers/matchController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/my', getMyMatches);
router.get('/:id', getMatchDetail);
router.post('/:id/answer', submitHiddenQuestionAnswer);
router.get('/:id/contact', getVerifiedContact);
router.post('/:id/confirm', confirmMatch);
router.post('/:id/reject', rejectMatch);

export default router;
