import { Request, Response } from 'express';
import { store } from '../data/store.js';

export const getStats = (_req: Request, res: Response) => {
  try {
    const stats = store.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin stats', error });
  }
};

export const getCustomers = (_req: Request, res: Response) => {
  try {
    const customers = store.getCustomers();
    res.json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch customer records', error });
  }
};
