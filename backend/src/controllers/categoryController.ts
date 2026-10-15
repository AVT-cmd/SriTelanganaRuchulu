import { Request, Response } from 'express';
import { store } from '../data/store.js';

export const getCategories = (_req: Request, res: Response) => {
  try {
    const categories = store.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories', error });
  }
};

export const getCategoryBySlug = (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const category = store.getCategoryBySlug(slug);

    if (!category) {
      return res.status(404).json({ success: false, message: `Category '${slug}' not found` });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch category', error });
  }
};

export const createCategory = (req: Request, res: Response) => {
  try {
    const { name, slug, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const newCategory = store.createCategory({
      name,
      slug,
      description
    });

    res.status(201).json({ success: true, message: 'Category created successfully', data: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create category', error });
  }
};
