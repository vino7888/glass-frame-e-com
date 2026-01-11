'use client';

import { useEffect, useState } from 'react';
import { Order } from '@/types';

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError('Failed to load orders');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    // kept for backwards compatibility if needed, but prefer using Save button
    setUpdateLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (data.success) {
        fetchOrders();
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(data.order);
          setEditOrder(JSON.parse(JSON.stringify(data.order)));
        }
      } else {
        setError(data.error || 'Failed to update order');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleShippingUpdate = async (orderId: string, shippingDetails: any) => {
    // kept for backwards compatibility if needed, but prefer using Save button
    setUpdateLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingDetails }),
      });

      const data = await response.json();
      if (data.success) {
        fetchOrders();
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(data.order);
          setEditOrder(JSON.parse(JSON.stringify(data.order)));
        }
      } else {
        setError(data.error || 'Failed to update shipping details');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    // create an editable deep copy to stage changes
    setEditOrder(JSON.parse(JSON.stringify(order)));
  };

  const handleSave = async () => {
    if (!editOrder) return;
    setUpdateLoading(true);
    try {
      const response = await fetch(`/api/orders/${editOrder._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: editOrder.status, shippingDetails: editOrder.shippingDetails }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchOrders();
        setSelectedOrder(data.order);
        setEditOrder(JSON.parse(JSON.stringify(data.order)));
      } else {
        setError(data.error || 'Failed to save changes');
      }
    } catch (err) {
      setError('An error occurred while saving');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    // revert edits
    setEditOrder(selectedOrder ? JSON.parse(JSON.stringify(selectedOrder)) : null);
  };

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">All Orders</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                onClick={() => handleSelectOrder(order)}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedOrder?._id === order._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">Order #{order._id.slice(-8)}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p className="text-lg font-bold text-blue-600 mt-2">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'processing'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'shipped'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedOrder && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            
              <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={editOrder?.status || ''}
                  onChange={(e) =>
                    setEditOrder((prev) => prev ? { ...prev, status: e.target.value as Order['status'] } : prev)
                  }
                  disabled={updateLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Carrier</label>
                <input
                  type="text"
                  value={editOrder?.shippingDetails?.carrier || ''}
                  onChange={(e) =>
                    setEditOrder((prev) =>
                      prev
                        ? { ...prev, shippingDetails: { ...(prev.shippingDetails || {}), carrier: e.target.value } }
                        : prev
                    )
                  }
                  placeholder="e.g., FedEx, UPS, DHL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tracking Number</label>
                <input
                  type="text"
                  value={editOrder?.shippingDetails?.trackingNumber || ''}
                  onChange={(e) =>
                    setEditOrder((prev) =>
                      prev
                        ? { ...prev, shippingDetails: { ...(prev.shippingDetails || {}), trackingNumber: e.target.value } }
                        : prev
                    )
                  }
                  placeholder="Enter tracking number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Estimated Delivery</label>
                <input
                  type="date"
                  value={
                    editOrder?.shippingDetails?.estimatedDelivery
                      ? new Date(editOrder.shippingDetails.estimatedDelivery).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    setEditOrder((prev) =>
                      prev
                        ? { ...prev, shippingDetails: { ...(prev.shippingDetails || {}), estimatedDelivery: new Date(e.target.value) } }
                        : prev
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSave}
                  disabled={updateLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {updateLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={updateLoading}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p className="text-gray-700">
                {selectedOrder.shippingAddress.street}
                <br />
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
                {selectedOrder.shippingAddress.zipCode}
                <br />
                {selectedOrder.shippingAddress.country}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
