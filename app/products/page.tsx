import Navbar from '@/components/shared/Navbar';
import ProductList from '@/components/products/ProductList';

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Our Glass Frames</h1>
          <ProductList />
        </div>
      </div>
    </>
  );
}
