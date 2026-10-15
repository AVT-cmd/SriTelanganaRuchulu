import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderTracking,
  trackOrder,
  sendOrderReviewEmail
} from '../controllers/orderController.js';

const router = Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/track/:query', trackOrder);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);
router.patch('/:id/tracking', updateOrderTracking);
router.put('/:id/tracking', updateOrderTracking);
router.post('/:id/review-email', sendOrderReviewEmail);

export default router;
