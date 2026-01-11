import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to Glass Frame Shop
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover our premium collection of stylish glass frames. 
              Find the perfect frames that match your style and personality.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/products"
                className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 text-lg font-semibold transition-colors"
              >
                Browse Products
              </Link>
              <Link
                href="/signup"
                className="bg-white text-blue-500 px-8 py-3 rounded-lg border-2 border-blue-500 hover:bg-blue-50 text-lg font-semibold transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Browse through our extensive collection of glass frames
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-gray-600">
                Track your orders and get updates on shipping status
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">
                Safe and secure checkout process
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
