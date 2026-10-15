import { Router } from 'express';
import { getStats, getCustomers } from '../controllers/adminController.js';

const router = Router();

router.get('/stats', getStats);
router.get('/customers', getCustomers);

export default router;
