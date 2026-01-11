import Navbar from '@/components/shared/Navbar';
import ProductDetails from '@/components/products/ProductDetails';

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> | { id: string } 
}) {
  // Handle both sync and async params (Next.js 15+)
  const resolvedParams = await Promise.resolve(params);
  const productId = resolvedParams.id;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <ProductDetails productId={productId} />
      </div>
    </>
  );
}
