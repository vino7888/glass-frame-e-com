import Navbar from '@/components/shared/Navbar';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requireAdmin>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/admin/products"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">Manage Products</h2>
              <p className="text-gray-600">Add, edit, or delete glass frames</p>
            </Link>

            <Link
              href="/admin/orders"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">Manage Orders</h2>
              <p className="text-gray-600">View and update order status and shipping</p>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
