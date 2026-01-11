import mongoose, { Schema, Model } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'order_update' | 'shipping_update' | 'payment_confirmation' | 'new_order';
  message: string;
  read: boolean;
  orderId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['order_update', 'shipping_update', 'payment_confirmation', 'new_order'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
  },
}, {
  timestamps: true,
});

const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
