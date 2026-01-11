import nodemailer from 'nodemailer';

const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Reset Password
        </a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendOrderConfirmationEmail(email: string, orderId: string, totalAmount: number) {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Order Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Order Confirmed!</h2>
        <p>Thank you for your order. Your order has been confirmed.</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
        <p>You can track your order status in your account.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendOrderUpdateEmail(email: string, orderId: string, status: string, message?: string) {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: `Order Update - ${status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Order Update</h2>
        <p>Your order status has been updated.</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Status:</strong> ${status}</p>
        ${message ? `<p>${message}</p>` : ''}
        <p>You can track your order status in your account.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendShippingUpdateEmail(email: string, orderId: string, trackingNumber: string, carrier?: string) {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Shipping Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your Order Has Been Shipped!</h2>
        <p>Your order is on its way.</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        ${carrier ? `<p><strong>Carrier:</strong> ${carrier}</p>` : ''}
        <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
        <p>You can track your order status in your account.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendNewOrderNotificationEmail(adminEmail: string, orderId: string, totalAmount: number) {
  const mailOptions = {
    from: EMAIL_USER,
    to: adminEmail,
    subject: 'New Order Received',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Order Received</h2>
        <p>A new order has been placed.</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
        <p>Please check the admin dashboard to process this order.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
