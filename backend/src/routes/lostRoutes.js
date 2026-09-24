import { Router } from 'express';
import { createLost, getMyLost, markReturned, withdrawLost } from '../controllers/lostController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/', createLost);
router.get('/my', getMyLost);
router.patch('/:id/returned', markReturned);
router.patch('/:id/withdraw', withdrawLost);

export default router;
