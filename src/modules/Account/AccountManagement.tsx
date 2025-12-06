import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";

interface AccountInfo {
  idUser: number;
  username: string;
  displayName?: string;
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
  discordId?: string | null;
}


const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:30052';

const AccountManagement: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'donate'>('overview');
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const userId = JSON.parse(localStorage.getItem('userInfo') || '{}')?.idUser || 
                 JSON.parse(localStorage.getItem('userInfo') || '{}')?.IdUser;

  // Handle tab from URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'donate' || tab === 'settings' || tab === 'overview') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (userId) {
      fetchAccount();
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


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading account...</div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <div className="text-white text-xl mb-2">Account not found</div>
          <div className="text-gray-400">Please try refreshing the page</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <i className="bi bi-person-circle text-purple-400"></i>
            Account Management
          </h1>
          <p className="text-gray-400">Manage your account, purchases, and effects</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {(['overview', 'settings', 'donate'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab
                  ? 'bg-purple-500/30 text-white shadow-lg shadow-purple-500/20 border border-purple-400/40'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50'
              }`}
            >
              {tab === 'overview' && <i className="bi bi-grid-3x3-gap"></i>}
              {tab === 'settings' && <i className="bi bi-gear"></i>}
              {tab === 'donate' && <i className="bi bi-heart"></i>}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="bg-gradient-to-br from-gray-800/60 via-purple-900/10 to-gray-800/60 rounded-2xl p-6 sm:p-8 border border-purple-400/20 backdrop-blur-sm shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-gray-700/50 rounded-xl p-5 sm:p-6 border border-gray-600/50 hover:border-purple-400/40 transition-all duration-300 hover:shadow-md hover:shadow-purple-500/10">
                <i className="bi bi-person text-4xl text-purple-400 mb-3 block"></i>
                <div className="text-xl sm:text-2xl font-bold text-white mb-1 truncate">{account.displayName || account.username}</div>
                <div className="text-gray-400 text-sm truncate">{account.email || 'No email'}</div>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-5 sm:p-6 border border-gray-600/50 hover:border-purple-400/40 transition-all duration-300 hover:shadow-md hover:shadow-purple-500/10">
                <i className="bi bi-wallet2 text-4xl text-purple-400 mb-3 block"></i>
                <div className="text-xl sm:text-2xl font-bold text-white mb-1">{account.coins.toLocaleString()}</div>
                <div className="text-gray-400 text-sm">Coins</div>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-5 sm:p-6 border border-gray-600/50 hover:border-purple-400/40 transition-all duration-300 hover:shadow-md hover:shadow-purple-500/10 sm:col-span-2 lg:col-span-1">
                <i className="bi bi-palette text-4xl text-purple-400 mb-3 block"></i>
                <div className="text-xl sm:text-2xl font-bold text-white mb-1">{account.totalEffects}</div>
                <div className="text-gray-400 text-sm">Effects Owned</div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-gray-700/50 rounded-xl p-5 sm:p-6 border border-gray-600/50 hover:border-purple-400/40 transition-all duration-300">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <i className="bi bi-info-circle text-purple-400"></i> Account Status
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-600/50">
                    <span className="text-gray-400">Premium:</span>
                    <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                      account.premium 
                        ? 'text-yellow-400 bg-yellow-400/20 border border-yellow-400/30' 
                        : 'text-gray-500 bg-gray-600/20 border border-gray-600'
                    }`}>
                      {account.premium ? '✓ Active' : '✗ Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-600/50">
                    <span className="text-gray-400">Verified:</span>
                    <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                      account.isVerified 
                        ? 'text-green-400 bg-green-400/20 border border-green-400/30' 
                        : 'text-gray-500 bg-gray-600/20 border border-gray-600'
                    }`}>
                      {account.isVerified ? '✓ Verified' : '✗ Not Verified'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Role:</span>
                    <span className="text-white font-semibold px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-sm">
                      {account.roles}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-xl p-5 sm:p-6 border border-gray-600/50 hover:border-purple-400/40 transition-all duration-300">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <i className="bi bi-graph-up text-purple-400"></i> Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-600/50">
                    <span className="text-gray-400">Total Purchases:</span>
                    <span className="text-white font-semibold">{account.totalPurchases}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Member Since:</span>
                    <span className="text-white font-semibold">
                      {new Date(account.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-gradient-to-br from-gray-800/60 via-purple-900/10 to-gray-800/60 rounded-2xl p-6 sm:p-8 border border-purple-400/20 backdrop-blur-sm shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <i className="bi bi-gear text-purple-400"></i> Account Settings
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!editing}
                  className="w-full px-4 py-3 bg-gray-700/70 text-white rounded-lg border border-gray-600/50 focus:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-400/20 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!editing}
                  className="w-full px-4 py-3 bg-gray-700/70 text-white rounded-lg border border-gray-600/50 focus:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-400/20 disabled:opacity-50"
                />
              </div>

              <div className="flex gap-4">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-6 py-3 bg-purple-500/40 text-white rounded-lg font-semibold hover:bg-purple-500/50 border border-purple-400/30 transition"
                  >
                    <i className="bi bi-pencil mr-2"></i>Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleUpdateAccount}
                      className="px-6 py-3 bg-green-500/40 text-white rounded-lg font-semibold hover:bg-green-500/50 border border-green-400/30 transition"
                    >
                      <i className="bi bi-check-lg mr-2"></i>Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setEmail(account.email || '');
                        setPhone(account.phone || '');
                      }}
                      className="px-6 py-3 bg-gray-600/50 text-white rounded-lg font-semibold hover:bg-gray-600/70 border border-gray-500/30 transition"
                    >
                      <i className="bi bi-x-lg mr-2"></i>Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Donate Tab */}
        {activeTab === 'donate' && (
          <div className="bg-gradient-to-br from-gray-800/60 via-purple-900/10 to-gray-800/60 rounded-2xl p-6 sm:p-8 border border-purple-400/20 backdrop-blur-sm shadow-lg">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                  <i className="bi bi-heart text-purple-400"></i> Support Mecha
                </h2>
                <p className="text-gray-400">
                  Your support helps us continue developing amazing features!
                </p>
              </div>
              
              <div className="bg-gray-700/50 rounded-xl p-5 sm:p-6 border border-gray-600/50 mb-6 hover:border-purple-400/40 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
                  <i className="bi bi-bank text-purple-400"></i> Bank Transfer Information
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center py-2 border-b border-gray-600/50">
                    <span className="text-gray-400 mb-1 sm:mb-0">Bank:</span>
                    <span className="text-white font-semibold">MB Bank (Ngân hàng TMCP Quân đội)</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center py-2 border-b border-gray-600/50">
                    <span className="text-gray-400 mb-1 sm:mb-0">Account Number:</span>
                    <span className="text-white font-semibold text-lg bg-purple-500/20 border border-purple-400/30 px-3 py-1 rounded-full">
                      0903982264
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center py-2">
                    <span className="text-gray-400 mb-1 sm:mb-0">Account Name:</span>
                    <span className="text-white font-semibold">Mecha Support</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-2xl mb-4 hover:shadow-purple-500/20 transition-all duration-300">
                  <img 
                    src="https://qr.sepay.vn/img?acc=0903982264&bank=MBBank" 
                    alt="QR Code Donate" 
                    className="w-56 h-56 sm:w-64 sm:h-64"
                  />
                </div>
                <p className="text-gray-400 text-sm text-center max-w-md flex items-center justify-center gap-2">
                  <i className="bi bi-phone text-purple-400"></i>
                  Scan this QR code with your banking app to donate instantly
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountManagement;

