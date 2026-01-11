'use client';

import Link from 'next/link';
import { Order } from '@/types';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={`/orders/${order._id}`}>
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">Order #{order._id.slice(-8)}</h3>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
          </p>
          <p className="text-xl font-bold text-blue-600 mt-2">
            ${order.totalAmount.toFixed(2)}
          </p>
        </div>

        {order.trackingNumber && (
          <div className="text-sm text-gray-600">
            <strong>Tracking:</strong> {order.trackingNumber}
          </div>
        )}
      </div>
    </Link>
  );
}
