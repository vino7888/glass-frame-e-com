'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const product = item.product;

  if (!product) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200">
      <Link href={`/products/${product._id}`} className="relative h-24 w-24 flex-shrink-0">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover rounded"
        />
      </Link>
      
      <div className="flex-1">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-blue-600">{product.name}</h3>
        </Link>
        <p className="text-gray-600">${product.price.toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(product._id, Math.max(1, item.quantity - 1))}
          className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
        >
          -
        </button>
        <span className="w-12 text-center">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(product._id, item.quantity + 1)}
          className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
        >
          +
        </button>
      </div>

      <div className="text-right">
        <p className="font-semibold">${(product.price * item.quantity).toFixed(2)}</p>
        <button
          onClick={() => onRemove(product._id)}
          className="text-red-500 text-sm hover:text-red-700 mt-1"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
