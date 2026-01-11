'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

export default function CheckoutPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [savedAddress, setSavedAddress] = useState<any>(null);
  const [useSaved, setUseSaved] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Determine which address to use
      const shippingAddress = useSaved && savedAddress ? savedAddress : formData;

      // Optionally save new address to user profile
      if (saveToProfile && !(useSaved && savedAddress)) {
        try {
          const saveRes = await fetch('/api/auth/me', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shippingAddress }),
          });
          if (!saveRes.ok) {
            const saveData = await saveRes.json();
            setError(saveData.error || 'Failed to save address');
            setLoading(false);
            return;
          }
        } catch (err) {
          setError('Failed to save address');
          setLoading(false);
          return;
        }
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress,
          paymentMethod: 'mock',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/orders`);
      } else {
        setError(data.error || 'Failed to place order');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user?.shippingAddress) {
            setSavedAddress(data.user.shippingAddress);
            setUseSaved(true);
          }
        }
      } catch (err) {
        // ignore
      }
    };
    fetchUser();
  }, []);

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>

            {savedAddress && (
              <div className="mb-6 pb-4 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">Address Option</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input type="radio" name="addressOption" checked={useSaved} onChange={() => setUseSaved(true)} />
                    <span className="text-gray-700">Use my saved address:</span>
                  </label>
                  {useSaved && (
                    <div className="ml-6 text-sm text-gray-600">
                      {savedAddress.street}, {savedAddress.city}, {savedAddress.state} {savedAddress.zipCode}, {savedAddress.country}
                    </div>
                  )}
                  <label className="flex items-center gap-3 mt-3">
                    <input type="radio" name="addressOption" checked={!useSaved} onChange={() => setUseSaved(false)} />
                    <span className="text-gray-700">Enter a new address</span>
                  </label>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  id="street"
                  required={!useSaved}
                  disabled={useSaved}
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    required={!useSaved}
                    disabled={useSaved}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    required={!useSaved}
                    disabled={useSaved}
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    required={!useSaved}
                    disabled={useSaved}
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    required={!useSaved}
                    disabled={useSaved}
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {!useSaved && (
              <div className="mt-4">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={saveToProfile} onChange={(e) => setSaveToProfile(e.target.checked)} />
                  <span className="text-sm text-gray-700">Save this address to my account</span>
                </label>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4">
                Payment will be processed using mock payment system.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
