import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../Core/layout/SideBar";
import "bootstrap-icons/font/bootstrap-icons.css";

interface User {
  idUser: number;
  username: string | null;
  email: string | null;
  phone: string | null;
  roles: string;
  premium: boolean;
  isVerified: boolean;
  createdAt: string;
  discordId: string | null;
  totalPurchases: number;
  totalEffects: number;
  coins: number;
}

interface Stats {
  totalUsers: number;
  premiumUsers: number;
  regularUsers: number;
  totalPurchases: number;
  totalRevenue: number;
  totalCoins: number;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:30052';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCoinsModal, setShowCoinsModal] = useState(false);
  const [coinsAmount, setCoinsAmount] = useState(0);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const userRole = userInfo?.Roles || userInfo?.roles || 'user';

  useEffect(() => {
    // Check if user is admin
    if (userRole !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchUsers();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const url = `${API_BASE_URL}/api/Admin/users?page=${page}&pageSize=20${search ? `&search=${encodeURIComponent(search)}` : ''}`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (res.status === 401 || res.status === 403) {
        setMessage('Bạn không có quyền truy cập trang admin');
        navigate('/dashboard');
        return;
      }

      if (!res.ok) {
        const contentType = res.headers.get('content-type');
        let errorMessage = 'Failed to fetch users';
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // Ignore JSON parse error
          }
        }
        throw new Error(errorMessage);
      }

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      const data = await res.json();
      
      if (data.users && Array.isArray(data.users)) {
        setUsers(data.users);
        setTotalPages(data.totalPages || 1);
      } else {
        setUsers([]);
        setTotalPages(1);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Lỗi khi tải danh sách users';
      setMessage(errorMsg);
      setUsers([]);
      setTotalPages(1);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Admin/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (res.status === 401 || res.status === 403) {
        return; // Silently fail for stats
      }

      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          setStats(data);
        }
      }
    } catch (err) {
      // Silent fail
    }
  };

  const handleUpdateUser = async (userId: number, updates: Partial<User>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(updates)
      });

      if (!res.ok) throw new Error('Failed to update user');
      setMessage('Cập nhật user thành công!');
      setShowEditModal(false);
      setEditingUser(null);
      await fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Lỗi khi cập nhật user');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa user này?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/Admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!res.ok) throw new Error('Failed to delete user');
      setMessage('Xóa user thành công!');
      await fetchUsers();
      await fetchStats();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Lỗi khi xóa user');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleUpdateCoins = async (userId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Admin/users/${userId}/coins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ Amount: coinsAmount })
      });

      if (!res.ok) throw new Error('Failed to update coins');
      setMessage('Cập nhật coins thành công!');
      setShowCoinsModal(false);
      setCoinsAmount(0);
      await fetchUsers();
      await fetchStats();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Lỗi khi cập nhật coins');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (userRole !== 'admin') {
    return null;
  }

  return (
    <div className="flex w-full min-h-screen bg-gray-950">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 overflow-auto">
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <i className="bi bi-shield-check text-4xl text-purple-400"></i>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-gray-300">Quản lý tất cả users và hệ thống</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800/60 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Tổng Users</p>
                  <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <i className="bi bi-people text-3xl text-purple-400"></i>
              </div>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Premium Users</p>
                  <p className="text-3xl font-bold text-white">{stats.premiumUsers}</p>
                </div>
                <i className="bi bi-star-fill text-3xl text-yellow-400"></i>
              </div>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Tổng Purchases</p>
                  <p className="text-3xl font-bold text-white">{stats.totalPurchases}</p>
                </div>
                <i className="bi bi-cart-check text-3xl text-green-400"></i>
              </div>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Tổng Coins</p>
                  <p className="text-3xl font-bold text-white">{stats.totalCoins.toLocaleString()}</p>
                </div>
                <i className="bi bi-coin text-3xl text-blue-400"></i>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-gray-800/60 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Tìm kiếm theo username hoặc email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800/60 backdrop-blur-sm border border-purple-500/20 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Username</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Premium</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Coins</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Effects</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                      Không tìm thấy users nào
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.idUser} className="border-t border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 text-gray-300">{user.idUser}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{user.username || 'N/A'}</span>
                          {user.isVerified && (
                            <i className="bi bi-check-circle-fill text-blue-400" title="Verified"></i>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{user.email || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.roles === 'admin' 
                            ? 'bg-red-500/20 text-red-300' 
                            : 'bg-gray-700 text-gray-300'
                        }`}>
                          {user.roles}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.premium ? (
                          <i className="bi bi-star-fill text-yellow-400"></i>
                        ) : (
                          <i className="bi bi-star text-gray-500"></i>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-300">{user.coins}</td>
                      <td className="px-6 py-4 text-gray-300">{user.totalEffects}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingUser(user);
                              setShowEditModal(true);
                            }}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all"
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            onClick={() => {
                              setEditingUser(user);
                              setShowCoinsModal(true);
                            }}
                            className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-all"
                            title="Manage Coins"
                          >
                            <i className="bi bi-coin"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.idUser)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all"
                            title="Delete"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-700/50 flex items-center justify-between">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <i className="bi bi-chevron-left"></i> Previous
              </button>
              <span className="text-gray-300">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          )}
        </div>

        {/* Edit User Modal */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl border border-purple-500/20 p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Chỉnh sửa User</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Username</label>
                  <input
                    type="text"
                    defaultValue={editingUser.username || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={editingUser.email || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Role</label>
                  <select
                    value={editingUser.roles}
                    onChange={(e) => setEditingUser({ ...editingUser, roles: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-gray-300">
                    <input
                      type="checkbox"
                      checked={editingUser.premium}
                      onChange={(e) => setEditingUser({ ...editingUser, premium: e.target.checked })}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span>Premium</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-300">
                    <input
                      type="checkbox"
                      checked={editingUser.isVerified}
                      onChange={(e) => setEditingUser({ ...editingUser, isVerified: e.target.checked })}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span>Verified</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleUpdateUser(editingUser.idUser, {
                    username: editingUser.username,
                    email: editingUser.email,
                    roles: editingUser.roles,
                    premium: editingUser.premium,
                    isVerified: editingUser.isVerified
                  })}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Coins Modal */}
        {showCoinsModal && editingUser && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl border border-purple-500/20 p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Quản lý Coins</h2>
                <button
                  onClick={() => {
                    setShowCoinsModal(false);
                    setEditingUser(null);
                    setCoinsAmount(0);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-300 mb-2">User: <span className="text-white font-semibold">{editingUser.username}</span></p>
                  <p className="text-gray-300 mb-4">Coins hiện tại: <span className="text-white font-semibold">{editingUser.coins}</span></p>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Số coins (âm để trừ, dương để thêm)</label>
                  <input
                    type="number"
                    value={coinsAmount}
                    onChange={(e) => setCoinsAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    placeholder="Nhập số coins"
                  />
                </div>
                {coinsAmount !== 0 && (
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <p className="text-gray-300">
                      Coins sau khi cập nhật: <span className="text-white font-semibold">{editingUser.coins + coinsAmount}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowCoinsModal(false);
                    setEditingUser(null);
                    setCoinsAmount(0);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleUpdateCoins(editingUser.idUser)}
                  disabled={coinsAmount === 0}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className={`fixed bottom-4 right-4 px-6 py-4 rounded-xl shadow-xl z-50 ${
            message.includes('thành công') 
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}>
            {message}
          </div>
        )}
      </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

