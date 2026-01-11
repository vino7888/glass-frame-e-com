import Navbar from '@/components/shared/Navbar';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import OrderManagement from '@/components/admin/OrderManagement';

export default function AdminOrdersPage() {
  return (
    <ProtectedRoute requireAdmin>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <OrderManagement />
      </div>
    </ProtectedRoute>
  );
}
