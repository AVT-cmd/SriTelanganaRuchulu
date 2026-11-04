import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  resetProducts,
  syncCatalog,
  exportCatalogDb
} from '../controllers/productController.js';

const router = Router();

router.get('/', getProducts);
router.get('/export-db', exportCatalogDb);
router.post('/sync', syncCatalog);
router.post('/reset', resetProducts);
router.get('/:slug', getProductBySlug);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
