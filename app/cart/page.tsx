'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { Cart } from '@/types';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCart(data.cart);
        }
      } else if (response.status === 401) {
        router.push('/login');
      } else {
        setError('Failed to load cart');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      const response = await fetch(`/api/cart?productId=${productId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="text-center">Loading cart...</div>
        </div>
      </>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <button
                onClick={() => router.push('/products')}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Browse Products
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
              {cart.items.map((item, index) => (
                <CartItem
                  key={index}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            <div>
              <CartSummary cart={cart} />
              <div className="space-y-3 mt-4">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 text-lg font-semibold transition-colors"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => router.push('/products')}
                  className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 text-lg font-semibold transition-colors"
                >
                  Add More Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
