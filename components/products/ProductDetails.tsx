'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';

interface ProductDetailsProps {
  productId: string;
}

export default function ProductDetails({ productId }: ProductDetailsProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (productId) {
      fetchProduct();
    } else {
      setError('Invalid product ID');
      setLoading(false);
    }
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId) {
      setError('Invalid product ID');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      if (data.success) {
        setProduct(data.product);
      } else {
        setError(data.error || 'Product not found');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Added to cart!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        if (data.error === 'Unauthorized') {
          router.push('/login');
        } else {
          setError(data.error || 'Failed to add to cart');
        }
      }
    } catch (error) {
      setError('An error occurred');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error && !product) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  if (!product) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-96 w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-blue-600 mb-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <label htmlFor="quantity" className="font-medium">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {!success ? (
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 text-lg font-semibold transition-colors"
            >
              Add to Cart
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 text-lg font-semibold transition-colors"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => router.push('/products')}
                className="w-full bg-gray-500 text-white py-3 rounded-md hover:bg-gray-600 text-lg font-semibold transition-colors"
              >
                Add More Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
