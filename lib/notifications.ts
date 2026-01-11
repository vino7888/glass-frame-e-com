import Notification from '@/models/Notification';
import User from '@/models/User';
import { sendOrderUpdateEmail, sendShippingUpdateEmail, sendNewOrderNotificationEmail } from './email';

export async function createNotification(
  userId: string,
  type: 'order_update' | 'shipping_update' | 'payment_confirmation' | 'new_order',
  message: string,
  orderId?: string
) {
  try {
    const notification = await Notification.create({
      userId,
      type,
      message,
      orderId,
      read: false,
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

export async function sendOrderUpdateNotifications(orderId: string, status: string, userId: string, message?: string) {
  // Create in-app notification
  await createNotification(userId, 'order_update', message || `Your order status has been updated to ${status}`, orderId);
  
  // Send email notification
  const user = await User.findById(userId);
  if (user) {
    await sendOrderUpdateEmail(user.email, orderId, status, message);
  }
}

export async function sendShippingUpdateNotifications(
  orderId: string,
  trackingNumber: string,
  userId: string,
  carrier?: string
) {
  // Create in-app notification
  await createNotification(
    userId,
    'shipping_update',
    `Your order has been shipped. Tracking number: ${trackingNumber}`,
    orderId
  );
  
  // Send email notification
  const user = await User.findById(userId);
  if (user) {
    await sendShippingUpdateEmail(user.email, orderId, trackingNumber, carrier);
  }
}

export async function sendNewOrderNotifications(orderId: string, totalAmount: number) {
  // Find all admin users
  const admins = await User.find({ role: 'admin' });
  
  // Create notifications and send emails for each admin
  for (const admin of admins) {
    await createNotification(
      admin._id.toString(),
      'new_order',
      `New order received: Order #${orderId} - $${totalAmount.toFixed(2)}`,
      orderId
    );
    
    await sendNewOrderNotificationEmail(admin.email, orderId, totalAmount);
  }
}

export async function sendPaymentConfirmationNotification(userId: string, orderId: string, totalAmount: number) {
  await createNotification(
    userId,
    'payment_confirmation',
    `Payment confirmed for order #${orderId}. Amount: $${totalAmount.toFixed(2)}`,
    orderId
  );
}
