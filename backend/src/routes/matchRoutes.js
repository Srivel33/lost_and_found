import { Router } from 'express';
import {
  getMyMatches,
  getMatchDetail,
  submitHiddenQuestionAnswer,
  getVerifiedContact,
  confirmMatch,
  rejectMatch,
  previewMatches,
  getRelayMessages,
  sendRelayMessage
} from '../controllers/matchController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/preview', previewMatches);
router.get('/my', getMyMatches);
router.get('/:id', getMatchDetail);
router.post('/:id/answer', submitHiddenQuestionAnswer);
router.get('/:id/contact', getVerifiedContact);
router.post('/:id/confirm', confirmMatch);
router.post('/:id/reject', rejectMatch);
router.get('/:id/relay', getRelayMessages);
router.post('/:id/relay', sendRelayMessage);

export default router;
