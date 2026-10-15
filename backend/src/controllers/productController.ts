import { Request, Response } from 'express';
import { store } from '../data/store.js';

export const getProducts = (req: Request, res: Response) => {
  try {
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

    // If query contains format=envelope return wrapped metadata, otherwise return array for direct frontend consumption
    if (req.query.envelope === 'true') {
      res.json({
        success: true,
        total,
        page: pageNum,
        limit: limitNum || total,
        data: products
      });
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', error });
  }
};

export const getProductBySlug = (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const product = store.getProductBySlugOrId(slug);

    if (!product) {
      return res.status(404).json({ success: false, message: `Product '${slug}' not found` });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product', error });
  }
};

export const createProduct = (req: Request, res: Response) => {
  try {
    const { name, price, regularPrice, imageUrl, isInStock, isVisible, categories, shortDescription, description, slug } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name and price are required' });
    }

    const newProduct = store.createProduct({
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

    res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create product', error });
  }
};

export const updateProduct = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const updated = store.updateProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product', error });
  }
};

export const deleteProduct = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const deleted = store.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product', error });
  }
};
