'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import OrderTracking from '@/components/orders/OrderTracking';
import { Order } from '@/types';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    } else {
      setError('Invalid order ID');
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrder = async () => {
    if (!orderId) {
      setError('Invalid order ID');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setOrder(data.order);
      } else if (response.status === 401) {
        router.push('/login');
      } else if (response.status === 400) {
        setError(data.error || 'Invalid order ID');
      } else if (response.status === 403) {
        setError('You do not have permission to view this order');
      } else if (response.status === 404) {
        setError('Order not found');
      } else {
        setError(data.error || 'Failed to load order');
      }
    } catch (error) {
      setError('An error occurred while loading the order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        {loading ? (
          <div className="text-center py-12">Loading order...</div>
        ) : error || !order ? (
          <div className="text-center py-12">{error || 'Order not found'}</div>
        ) : (
          <OrderTracking order={order} />
        )}
      </div>
    </ProtectedRoute>
  );
}
