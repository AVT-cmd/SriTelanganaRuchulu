import { Request, Response } from 'express';
import { store } from '../data/store.js';
import { notificationService } from '../services/notificationService.js';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerName, email, phone, shippingAddress, items, totalAmount, paymentMethod, shippingFee, discount, razorpayPaymentId, razorpayOrderId } = req.body;

    if (!customerName || !shippingAddress || !items || !items.length || totalAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required order details: customerName, shippingAddress, items, and totalAmount are mandatory'
      });
    }

    const order = store.createOrder({
      customerName,
      email: email || '',
      phone: phone || '',
      shippingAddress,
      items,
      shippingFee: shippingFee !== undefined ? Number(shippingFee) : 0,
      discount: discount !== undefined ? Number(discount) : 0,
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod || 'COD',
      razorpayPaymentId: razorpayPaymentId || undefined,
      razorpayOrderId: razorpayOrderId || undefined
    });

    // Send order confirmation Email to customer AND admin/company emails
    try {
      await notificationService.sendOrderConfirmationNotification(order);
    } catch (notifErr) {
      console.warn('Notification dispatch failed for order:', notifErr);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create order', error });
  }
};

export const getOrders = (req: Request, res: Response) => {
  try {
    const { email, phone } = req.query;
    let orders = store.getOrders();
    if (email) {
      const cleanEmail = (email as string).toLowerCase().trim();
      orders = orders.filter(o => o.email && o.email.toLowerCase().trim() === cleanEmail);
    } else if (phone) {
      const cleanPhone = (phone as string).replace(/[^0-9]/g, '');
      orders = orders.filter(o => o.phone && o.phone.replace(/[^0-9]/g, '').endsWith(cleanPhone.slice(-10)));
    }
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error });
  }
};

export const getOrderById = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const order = store.getOrderById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order', error });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = store.updateOrderStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // When order is delivered, dispatch review and feedback email to customer
    if (status === 'DELIVERED') {
      try {
        await notificationService.sendReviewFeedbackNotification(updated);
      } catch (err) {
        console.warn('Review notification error:', err);
      }
    }

    // Dispatch live tracking update email to customer
    try {
      await notificationService.sendTrackingUpdateNotification(updated);
    } catch (err) {
      console.warn('Status tracking notification error:', err);
    }

    res.json({
      success: true,
      message: `Order status updated to ${status} and notification sent to customer`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status', error });
  }
};

export const sendOrderReviewEmail = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const order = store.getOrderById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    await notificationService.sendReviewFeedbackNotification(order);
    res.json({ success: true, message: `Review & feedback email dispatched to ${order.email}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send review email', error });
  }
};

export const updateOrderTracking = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status, trackingId, courierPartner, trackingNotes, estimatedDelivery } = req.body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = store.updateOrderTracking(id, {
      status,
      trackingId,
      courierPartner,
      trackingNotes,
      estimatedDelivery
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Dispatch live tracking update email and SMS to customer
    try {
      await notificationService.sendTrackingUpdateNotification(updated);
    } catch (notifErr) {
      console.warn('[updateOrderTracking] Notification dispatch error:', notifErr);
    }

    res.json({
      success: true,
      message: 'Order tracking updated successfully and customer notified via email',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order tracking', error });
  }
};

export const trackOrder = (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Tracking ID or Order number is required' });
    }

    const order = store.getOrderByTrackingOrNumber(query);
    if (!order) {
      return res.status(404).json({ success: false, message: `No order found with Tracking ID or Order # '${query}'` });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to track order', error });
  }
};
