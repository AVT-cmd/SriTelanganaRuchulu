import { Router } from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory
} from '../controllers/categoryController.js';

const router = Router();

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);
router.post('/', createCategory);

export default router;
