import { Request, Response } from 'express';
import { store } from '../data/store.js';

export const getProducts = async (req: Request, res: Response) => {
  try {
    await store.ensureCloudHydrated();
    const { category, search, inStock, limit, page, includeHidden } = req.query;

    const pageNum = page ? parseInt(page as string, 10) : 1;
    const limitNum = limit ? parseInt(limit as string, 10) : undefined;
    const offset = limitNum ? (pageNum - 1) * limitNum : undefined;

    const { products, total } = store.getProducts({
      category: category as string | undefined,
      search: search as string | undefined,
      inStock: inStock !== undefined ? inStock === 'true' : undefined,
      includeHidden: includeHidden === 'true',
      limit: limitNum,
      offset
    });

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // If query contains format=envelope return wrapped metadata, otherwise return array for direct frontend consumption
    if (req.query.envelope === 'true') {
      res.json({
        success: true,
        total,
        page: pageNum,
        limit: limitNum || total,
        cloudPersisted: store.isCloudPersistenceEnabled(),
        data: products
      });
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', error });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    await store.ensureCloudHydrated();
    const { slug } = req.params;
    const product = store.getProductBySlugOrId(slug);

    if (!product) {
      return res.status(404).json({ success: false, message: `Product '${slug}' not found` });
    }

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.json(product);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product', error });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    await store.ensureCloudHydrated();
    const { id, name, price, regularPrice, imageUrl, isInStock, isVisible, categories, shortDescription, description, slug } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name and price are required' });
    }

    const newProduct = store.createProduct({
      id: id ? Number(id) : undefined,
      name,
      slug,
      price: Number(price),
      regularPrice: regularPrice !== undefined ? Number(regularPrice) : Number(price),
      imageUrl: imageUrl || '',
      isInStock: isInStock !== undefined ? Boolean(isInStock) : true,
      isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
      categories: categories || [],
      shortDescription: shortDescription || '',
      description: description || ''
    });
    await store.flushCloudSave();

    res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create product', error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    await store.ensureCloudHydrated();
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const updated = store.updateProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await store.flushCloudSave();

    res.json({ success: true, message: 'Product updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product', error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await store.ensureCloudHydrated();
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const deleted = store.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await store.flushCloudSave();

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product', error });
  }
};

export const syncCatalog = async (req: Request, res: Response) => {
  try {
    await store.ensureCloudHydrated();
    const { overrides, created, deletedIds, replaceProducts } = req.body || {};
    const result = store.syncCatalogSnapshot({
      overrides,
      created,
      deletedIds,
      replaceProducts
    });
    await store.flushCloudSave();

    res.json({
      success: true,
      message: 'Catalog synchronized successfully',
      appliedCount: result.appliedCount,
      cloudPersisted: store.isCloudPersistenceEnabled(),
      totalProducts: result.products.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to synchronize catalog', error });
  }
};

export const exportCatalogDb = async (_req: Request, res: Response) => {
  try {
    await store.ensureCloudHydrated();
    const snapshot = store.getFullDbSnapshot();
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="db_store.json"');
    res.send(JSON.stringify(snapshot, null, 2));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to export database snapshot', error });
  }
};

export const resetProducts = async (_req: Request, res: Response) => {
  try {
    await store.ensureCloudHydrated();
    store.resetProducts();
    await store.flushCloudSave();
    res.json({ success: true, message: 'Catalog database successfully reset to clean defaults' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reset catalog database', error });
  }
};
