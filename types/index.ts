export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  shippingAddress?: ShippingAddress | null;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ShippingDetails {
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  shippingAddress: ShippingAddress;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  trackingNumber?: string;
  shippingDetails?: ShippingDetails;
}

export interface Notification {
  _id: string;
  userId: string;
  type: 'order_update' | 'shipping_update' | 'payment_confirmation' | 'new_order';
  message: string;
  read: boolean;
  createdAt: Date;
  orderId?: string;
}
