'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import Navbar from '@/components/shared/Navbar';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.name, shippingAddress: user.shippingAddress }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('Profile updated');
        setUser(data.user);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">Loading...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Manage your account</h1>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

        {user && (
          <div className="bg-white p-6 rounded shadow">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={user.email} disabled className="w-full px-3 py-2 border rounded bg-gray-50" />
            </div>

            <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Street</label>
                <input
                  type="text"
                  value={user.shippingAddress?.street || ''}
                  onChange={(e) => setUser({ ...user, shippingAddress: { ...(user.shippingAddress || {}), street: e.target.value } })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  value={user.shippingAddress?.city || ''}
                  onChange={(e) => setUser({ ...user, shippingAddress: { ...(user.shippingAddress || {}), city: e.target.value } })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  value={user.shippingAddress?.state || ''}
                  onChange={(e) => setUser({ ...user, shippingAddress: { ...(user.shippingAddress || {}), state: e.target.value } })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">ZIP Code</label>
                <input
                  type="text"
                  value={user.shippingAddress?.zipCode || ''}
                  onChange={(e) => setUser({ ...user, shippingAddress: { ...(user.shippingAddress || {}), zipCode: e.target.value } })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Country</label>
                <input
                  type="text"
                  value={user.shippingAddress?.country || ''}
                  onChange={(e) => setUser({ ...user, shippingAddress: { ...(user.shippingAddress || {}), country: e.target.value } })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
