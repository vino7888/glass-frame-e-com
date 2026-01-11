'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import ProductForm from '@/components/admin/ProductForm';
import { ToastContainer } from '@/components/shared/Toast';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      } else {
        setError('Failed to load products');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    if (!productId) {
      addToast('Invalid product ID', 'error');
      return;
    }

    // Ensure productId is a string
    const idString = String(productId).trim();
    if (!idString) {
      addToast('Invalid product ID', 'error');
      return;
    }

    try {
      const response = await fetch(`/api/products/${idString}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (response.ok && data.success) {
        addToast('Product deleted successfully!', 'success');
        fetchProducts();
        router.refresh();
      } else {
        const errorMsg = data.error || 'Failed to delete product';
        addToast(errorMsg, 'error');
        setError(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error.message || 'An error occurred';
      addToast(errorMsg, 'error');
      setError(errorMsg);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleFormSuccess = () => {
    const message = editingProduct ? 'Product updated successfully!' : 'Product added successfully!';
    addToast(message, 'success');
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
    router.refresh();
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ProtectedRoute requireAdmin>
      <Navbar />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Manage Products</h1>
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowForm(true);
              }}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Add New Product
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
          )}

          {showForm ? (
            <div className="mb-8">
              <ProductForm
                productId={editingProduct?._id}
                initialData={editingProduct ? {
                  name: editingProduct.name,
                  description: editingProduct.description,
                  price: editingProduct.price,
                  image: editingProduct.image,
                } : undefined}
                onSuccess={handleFormSuccess}
              />
              <button
                onClick={handleFormClose}
                className="mt-4 text-blue-500 hover:text-blue-700"
              >
                ← Back to Products
              </button>
            </div>
          ) : (
            <>
              {loading ? (
                <div className="text-center py-12">Loading products...</div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">No products found</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="relative h-48 w-full">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                        <p className="text-xl font-bold text-blue-600 mb-4">${product.price.toFixed(2)}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
