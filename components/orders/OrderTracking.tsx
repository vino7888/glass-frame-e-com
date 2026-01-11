'use client';

import { Order } from '@/types';
import Image from 'next/image';

interface OrderTrackingProps {
  order: Order;
}

export default function OrderTracking({ order }: OrderTrackingProps) {
  const statuses = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStatusIndex = statuses.indexOf(order.status);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Order Placed';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Order Tracking</h1>
        <p className="text-gray-600">Order #{order._id.slice(-8)}</p>
      </div>

      {/* Status Timeline */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Order Status</h2>
        <div className="relative">
          <div className="flex items-center justify-between">
            {statuses.map((status, index) => (
              <div key={status} className="flex flex-col items-center flex-1 relative z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                    index <= currentStatusIndex
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                <p className="mt-2 text-sm text-center font-medium">{getStatusLabel(status)}</p>
                {index < statuses.length - 1 && (
                  <div
                    className={`absolute top-6 left-1/2 h-0.5 w-full ${
                      index < currentStatusIndex ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                    style={{ width: '100%', transform: 'translateX(50%)' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-600">Order Date</p>
            <p className="font-semibold">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Total Amount</p>
            <p className="font-semibold text-xl text-blue-600">${order.totalAmount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-600">Payment Status</p>
            <p className="font-semibold capitalize">{order.paymentStatus}</p>
          </div>
          {order.trackingNumber && (
            <div>
              <p className="text-gray-600">Tracking Number</p>
              <p className="font-semibold">{order.trackingNumber}</p>
            </div>
          )}
        </div>

        {order.shippingDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="font-semibold mb-2">Shipping Details</h3>
            {order.shippingDetails.carrier && (
              <p className="text-gray-600">
                <strong>Carrier:</strong> {order.shippingDetails.carrier}
              </p>
            )}
            {order.shippingDetails.trackingNumber && (
              <p className="text-gray-600">
                <strong>Tracking:</strong> {order.shippingDetails.trackingNumber}
              </p>
            )}
            {order.shippingDetails.estimatedDelivery && (
              <p className="text-gray-600">
                <strong>Estimated Delivery:</strong>{' '}
                {new Date(order.shippingDetails.estimatedDelivery).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
        <p className="text-gray-700">
          {order.shippingAddress.street}
          <br />
          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
          <br />
          {order.shippingAddress.country}
        </p>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item, index) => {
            const product = item.product;
            return (
              <div key={index} className="flex items-center gap-4 border-b border-gray-200 pb-4">
                {product && (
                  <>
                    <div className="relative h-20 w-20 flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">${item.price.toFixed(2)}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
