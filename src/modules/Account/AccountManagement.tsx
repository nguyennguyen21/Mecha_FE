import React, { useState, useEffect } from 'react';

interface AccountInfo {
  idUser: number;
  username: string;
  email?: string;
  phone?: string;
  roles: string;
  premium: boolean;
  isVerified: boolean;
  createdAt: string;
  styleId?: string;
  profileUsername?: string;
  totalPurchases: number;
  totalEffects: number;
  coins: number;
}

interface Purchase {
  purchaseId: number;
  userId: number;
  productId: number;
  productName: string;
  price: number;
  paymentMethod?: string;
  transactionId?: string;
  status: string;
  purchasedAt: string;
}

interface UserEffect {
  effectId: number;
  userId: number;
  productId: number;
  productName: string;
  isActive: boolean;
  appliedTo: string;
  effectSettings?: string;
  appliedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5159';

const AccountManagement: React.FC = () => {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [effects, setEffects] = useState<UserEffect[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'purchases' | 'effects' | 'settings'>('overview');
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const userId = JSON.parse(localStorage.getItem('userInfo') || '{}')?.idUser || 
                 JSON.parse(localStorage.getItem('userInfo') || '{}')?.IdUser;

  useEffect(() => {
    if (userId) {
      fetchAccount();
      fetchPurchases();
      fetchEffects();
    }
  }, [userId]);

  const fetchAccount = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Account/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch account');
      const data = await res.json();
      setAccount(data);
      setEmail(data.email || '');
      setPhone(data.phone || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchases = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Account/${userId}/purchases`);
      if (!res.ok) throw new Error('Failed to fetch purchases');
      const data = await res.json();
      setPurchases(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEffects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Shop/user/${userId}/effects`);
      if (!res.ok) throw new Error('Failed to fetch effects');
      const data = await res.json();
      setEffects(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAccount = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Account/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email, Phone: phone })
      });

      if (!res.ok) throw new Error('Failed to update account');
      
      setEditing(false);
      await fetchAccount();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyEffect = async (effectId: number, appliedTo: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Shop/user/${userId}/effect/${effectId}/apply`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ AppliedTo: appliedTo })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to apply effect');
      }
      await fetchEffects();
      await fetchAccount(); // Refresh account stats
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to apply effect');
    }
  };

  const handleRemoveEffect = async (effectId: number) => {
    try {
      // To remove, we need to deactivate it
      // We can do this by applying a dummy effect or updating directly
      // For now, let's just refresh and show message
      const res = await fetch(`${API_BASE_URL}/api/Shop/user/${userId}/effect/${effectId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to remove effect');
      }
      await fetchEffects();
      await fetchAccount();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to remove effect');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading account...</div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Account not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Account Management
          </h1>
          <p className="text-gray-400">Manage your account, purchases, and effects</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {(['overview', 'purchases', 'effects', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white shadow-lg hover:bg-purple-700'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="text-4xl mb-2">👤</div>
                <div className="text-2xl font-bold text-white mb-1">{account.username}</div>
                <div className="text-gray-400 text-sm">{account.email || 'No email'}</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="text-4xl mb-2">💰</div>
                <div className="text-2xl font-bold text-white mb-1">{account.coins}</div>
                <div className="text-gray-400 text-sm">Coins</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="text-4xl mb-2">🎨</div>
                <div className="text-2xl font-bold text-white mb-1">{account.totalEffects}</div>
                <div className="text-gray-400 text-sm">Effects Owned</div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Account Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Premium:</span>
                    <span className={account.premium ? 'text-yellow-400 font-bold' : 'text-gray-500'}>
                      {account.premium ? '✓ Active' : '✗ Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Verified:</span>
                    <span className={account.isVerified ? 'text-green-400 font-bold' : 'text-gray-500'}>
                      {account.isVerified ? '✓ Verified' : '✗ Not Verified'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Role:</span>
                    <span className="text-white font-semibold">{account.roles}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Purchases:</span>
                    <span className="text-white font-semibold">{account.totalPurchases}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Member Since:</span>
                    <span className="text-white font-semibold">
                      {new Date(account.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Purchases Tab */}
        {activeTab === 'purchases' && (
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Purchase History</h2>
            {purchases.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-6xl mb-4">🛒</div>
                <p>No purchases yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {purchases.map(purchase => (
                  <div
                    key={purchase.purchaseId}
                    className="bg-gray-700/50 rounded-xl p-6 border border-gray-600"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{purchase.productName}</h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(purchase.purchasedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-400">
                          ${purchase.price.toFixed(2)}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          purchase.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {purchase.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Effects Tab */}
        {activeTab === 'effects' && (
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">My Effects</h2>
            {effects.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-6xl mb-4">🎨</div>
                <p>No effects owned yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {effects.map(effect => (
                  <div
                    key={effect.effectId}
                    className={`bg-gray-700/50 rounded-xl p-6 border-2 ${
                      effect.isActive ? 'border-green-500 bg-green-500/10' : 'border-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-white">{effect.productName}</h3>
                      {effect.isActive && (
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-4">Applied to: {effect.appliedTo}</p>
                    <div className="flex gap-2">
                      {effect.isActive ? (
                        <button
                          onClick={() => handleRemoveEffect(effect.effectId)}
                          className="flex-1 py-2 rounded-lg font-semibold transition bg-red-600 text-white hover:bg-red-700"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApplyEffect(effect.effectId, 'profile')}
                          className="flex-1 py-2 rounded-lg font-semibold transition bg-purple-600 text-white hover:bg-purple-700"
                        >
                          Apply Effect
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!editing}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!editing}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div className="flex gap-4">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleUpdateAccount}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setEmail(account.email || '');
                        setPhone(account.phone || '');
                      }}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountManagement;

