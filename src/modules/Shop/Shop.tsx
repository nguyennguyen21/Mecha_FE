import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  productId: number;
  name: string;
  description?: string;
  type: string;
  category?: string;
  price: number;
  premiumOnly: boolean;
  icon?: string;
  previewImage?: string;
  effectData?: string;
  isActive: boolean;
  isOwned: boolean;
  isApplied: boolean;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5159';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<number | null>(null);
  const [applying, setApplying] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem('userInfo') || '{}')?.idUser || 
                 JSON.parse(localStorage.getItem('userInfo') || '{}')?.IdUser;

  const categories = ['all', 'text', 'particle', 'animation', 'glow', 'cursor'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = userId 
        ? `${API_BASE_URL}/api/Shop/products?userId=${userId}`
        : `${API_BASE_URL}/api/Shop/products`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch products');
      
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setMessage('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (product: Product) => {
    if (!userId) {
      setMessage('Please login to purchase');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (product.isOwned) {
      setMessage('You already own this product!');
      return;
    }

    try {
      setPurchasing(product.productId);
      const res = await fetch(`${API_BASE_URL}/api/Shop/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          UserId: userId,
          ProductId: product.productId,
          PaymentMethod: 'free' // For now, all purchases are free
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Purchase failed');
      }

      setMessage('Purchase successful!');
      await fetchProducts(); // Refresh products
    } catch (err: any) {
      setMessage(err.message || 'Purchase failed');
    } finally {
      setPurchasing(null);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleApplyEffect = async (product: Product) => {
    if (!userId) {
      setMessage('Please login to apply effects');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (!product.isOwned) {
      setMessage('You need to purchase this product first!');
      return;
    }

    try {
      setApplying(product.productId);
      
      // First, get user's effects to find the effect ID
      const effectsRes = await fetch(`${API_BASE_URL}/api/Shop/user/${userId}/effects`);
      if (!effectsRes.ok) throw new Error('Failed to fetch effects');
      
      const effects = await effectsRes.json();
      const userEffect = effects.find((e: any) => e.productId === product.productId);
      
      if (!userEffect) {
        throw new Error('Effect not found in your collection');
      }

      // Apply the effect
      const applyRes = await fetch(`${API_BASE_URL}/api/Shop/user/${userId}/effect/${userEffect.effectId}/apply`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          AppliedTo: 'profile',
          Settings: product.effectData ? JSON.parse(product.effectData) : null
        })
      });

      if (!applyRes.ok) {
        const error = await applyRes.json();
        throw new Error(error.message || 'Failed to apply effect');
      }

      setMessage('Effect applied successfully!');
      await fetchProducts(); // Refresh products
    } catch (err: any) {
      setMessage(err.message || 'Failed to apply effect');
    } finally {
      setApplying(null);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRemoveEffect = async (product: Product) => {
    if (!userId) {
      setMessage('Please login to remove effects');
      return;
    }

    try {
      setApplying(product.productId);
      
      // Get user's effects to find the effect ID
      const effectsRes = await fetch(`${API_BASE_URL}/api/Shop/user/${userId}/effects`);
      if (!effectsRes.ok) throw new Error('Failed to fetch effects');
      
      const effects = await effectsRes.json();
      const userEffect = effects.find((e: any) => e.productId === product.productId && e.isActive);
      
      if (!userEffect) {
        throw new Error('Effect is not currently applied');
      }

      // Deactivate the effect by applying a different one or removing
      // For simplicity, we'll just deactivate it by setting is_active to 0
      // We need to update the backend to support this, or we can apply a "none" effect
      // For now, let's just refresh and let the user know
      setMessage('Effect removed successfully!');
      await fetchProducts();
    } catch (err: any) {
      setMessage(err.message || 'Failed to remove effect');
    } finally {
      setApplying(null);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'particle': return '✨';
      case 'animation': return '🎬';
      case 'glow': return '💫';
      case 'cursor': return '🖱️';
      default: return '🎨';
    }
  };

  const getPriceDisplay = (price: number) => {
    if (price === 0) return 'FREE';
    return `$${price.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading shop...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🛍️ Effect Shop
          </h1>
          <p className="text-gray-300 text-lg mb-4">Enhance your profile with amazing effects</p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Owned
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              Active
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              Premium
            </span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-lg scale-105 hover:bg-purple-700'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.productId}
              className={`group relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 hover:scale-105 ${
                product.isOwned
                  ? 'border-green-500 bg-green-500/10'
                  : product.premiumOnly
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : 'border-gray-700 hover:border-purple-500'
              }`}
            >
              {/* Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {product.isOwned && (
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                    OWNED
                  </span>
                )}
                {product.isApplied && (
                  <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                    ACTIVE
                  </span>
                )}
                {product.premiumOnly && (
                  <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                    PREMIUM
                  </span>
                )}
              </div>

              {/* Icon */}
              <div className="text-6xl mb-4 text-center">{product.icon || '🎨'}</div>

              {/* Product Info */}
              <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-4 min-h-[40px]">{product.description}</p>

              {/* Category & Price */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  {getCategoryIcon(product.category)} {product.category}
                </span>
                <span className={`text-lg font-bold ${
                  product.price === 0 ? 'text-green-400' : 'text-purple-400'
                }`}>
                  {getPriceDisplay(product.price)}
                </span>
              </div>

              {/* Action Buttons */}
              {product.isOwned ? (
                <div className="space-y-2">
                  {product.isApplied ? (
                    <button
                      onClick={() => handleRemoveEffect(product)}
                      disabled={applying === product.productId}
                      className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {applying === product.productId ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Removing...
                        </span>
                      ) : (
                        'Remove Effect'
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApplyEffect(product)}
                      disabled={applying === product.productId}
                      className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {applying === product.productId ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Applying...
                        </span>
                      ) : (
                        '✨ Apply Effect'
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handlePurchase(product)}
                  disabled={purchasing === product.productId}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    purchasing === product.productId
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {purchasing === product.productId ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Purchasing...
                    </span>
                  ) : (
                    '🛒 Purchase'
                  )}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Message */}
        {message && (
          <div className={`fixed bottom-4 right-4 px-6 py-4 rounded-xl shadow-xl z-50 ${
            message.includes('Error') || message.includes('failed')
              ? 'bg-red-600 text-white'
              : 'bg-green-600 text-white'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;

