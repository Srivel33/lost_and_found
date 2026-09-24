import { Router } from 'express';
import { createFound, getMyFound, markReturned, withdrawFound } from '../controllers/foundController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/', createFound);
router.get('/my', getMyFound);
router.patch('/:id/returned', markReturned);
router.patch('/:id/withdraw', withdrawFound);

export default router;
