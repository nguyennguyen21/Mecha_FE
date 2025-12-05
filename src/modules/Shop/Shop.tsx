import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";
import EffectRenderer from '../Effects/EffectRenderer';

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

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:30052';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem('userInfo') || '{}')?.idUser || 
                 JSON.parse(localStorage.getItem('userInfo') || '{}')?.IdUser;
  
  // Check Premium - handle both boolean, number (1/0), and string from database/JSON
  const getPremiumStatus = (userInfo: any) => {
    const premium = userInfo?.Premium ?? userInfo?.premium;
    // Handle boolean true, number 1, string "1" or "true"
    const isPremiumValue = premium === true || 
                          premium === 1 || 
                          premium === '1' || 
                          premium === 'true' ||
                          premium === 'True';
    return !!isPremiumValue;
  };
  
  const [isPremium, setIsPremium] = useState(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return getPremiumStatus(userInfo);
  });

  const categories = ['all', 'text', 'particle', 'animation', 'glow', 'cursor'];

  // Refresh userInfo from backend to ensure Premium status is up-to-date
  useEffect(() => {
    const refreshUserInfo = async () => {
      if (userId) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/Account/${userId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });
          if (res.ok) {
            const accountData = await res.json();
            
            // Force update from backend - replace old cache with fresh data
            const premiumValue = accountData.Premium === true || accountData.Premium === 1 || 
                                accountData.premium === true || accountData.premium === 1;
            const updatedUserInfo = { 
              ...accountData,
              Premium: premiumValue,
              premium: premiumValue,
              IdUser: accountData.IdUser || accountData.idUser,
              idUser: accountData.IdUser || accountData.idUser
            };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            
            // Update isPremium state
            const newPremiumStatus = getPremiumStatus(updatedUserInfo);
            setIsPremium(newPremiumStatus);
          }
        } catch (err) {
          // Silent fail - keep existing cache
        }
      }
    };
    refreshUserInfo();
    fetchProducts();
  }, [userId]);

  // Re-check premium status periodically or when needed
  useEffect(() => {
    const checkPremium = () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const currentPremiumStatus = getPremiumStatus(userInfo);
      if (currentPremiumStatus !== isPremium) {
        setIsPremium(currentPremiumStatus);
      }
    };
    
    // Check immediately
    checkPremium();
    
    // Check every 2 seconds (in case userInfo is updated elsewhere)
    const interval = setInterval(checkPremium, 2000);
    return () => clearInterval(interval);
  }, [isPremium]);

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
      setMessage('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  // Auto-own all premium products for premium users only
  useEffect(() => {
    if (userId && isPremium && products.length > 0) {
      const unownedProducts = products.filter(p => !p.isOwned && p.premiumOnly && p.price === 0);
      if (unownedProducts.length > 0) {
        // Auto-purchase all premium products for premium users
        const authToken = localStorage.getItem('authToken');
        if (!authToken) return; // Skip if no token
        
        unownedProducts.forEach(async (product) => {
          try {
            await fetch(`${API_BASE_URL}/api/Shop/purchase`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
              },
              body: JSON.stringify({
                UserId: userId,
                ProductId: product.productId,
                PaymentMethod: 'free'
              })
            });
          } catch (err) {
            // Silent fail for auto-purchase
          }
        });
        // Refresh after a delay
        setTimeout(() => fetchProducts(), 1000);
      }
    }
  }, [userId, isPremium, products.length]);

  const handleApplyEffect = async (product: Product) => {
    if (!userId) {
      setMessage('Please login to apply effects');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    // Check premium requirement - only for premiumOnly effects (free effects don't need premium)
    if (product.premiumOnly && !isPremium) {
      setMessage('This effect requires Premium membership. Please upgrade to use this effect.');
      return;
    }

    // For free users: check if they already have an active effect (limit to 1)
    if (!isPremium) {
      try {
        const effectsRes = await fetch(`${API_BASE_URL}/api/Shop/user/${userId}/effects`);
        if (effectsRes.ok) {
          const effects = await effectsRes.json();
          const activeEffects = effects.filter((e: any) => e.isActive);
          
          // Check if current effect is already active
          const currentEffect = effects.find((e: any) => e.productId === product.productId);
          const isCurrentActive = currentEffect?.isActive || false;
          
          // If user has active effect and this one is not active, show warning
          if (activeEffects.length > 0 && !isCurrentActive) {
            setMessage('Free users can only have 1 active effect at a time. Please remove your current effect first.');
            return;
          }
        }
      } catch (err) {
        // Silent fail
      }
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
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setMessage('Please login to apply effects');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const applyRes = await fetch(`${API_BASE_URL}/api/Shop/user/${userId}/effect/${userEffect.effectId}/apply`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
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

  const handlePurchaseEffect = async (product: Product) => {
    if (!userId) {
      setMessage('Please login to purchase effects');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    // Check premium requirement - only for premiumOnly effects
    // Free users can purchase effects with coins (if not premiumOnly)
    if (product.premiumOnly && !isPremium) {
      setMessage('This effect requires Premium membership. Please upgrade to use this effect.');
      return;
    }
    
    // Free users can purchase effects with coins (if price > 0 and not premiumOnly)
    // Premium users get all effects for free

    // Check if already owned (frontend validation for better UX)
    if (product.isOwned) {
      setMessage('You already own this effect!');
      return;
    }

    try {
      setApplying(product.productId);
      
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setMessage('Please login to purchase effects');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/Shop/purchase`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          UserId: userId,
          ProductId: product.productId,
          PaymentMethod: product.price > 0 ? 'coins' : 'free'
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to purchase effect');
      }

      setMessage('Effect purchased successfully!');
      await fetchProducts(); // Refresh products
    } catch (err: any) {
      setMessage(err.message || 'Failed to purchase effect');
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

      // Call DELETE endpoint to remove/deactivate the effect
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setMessage('Please login to remove effects');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const removeRes = await fetch(`${API_BASE_URL}/api/Shop/user/${userId}/effect/${userEffect.effectId}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!removeRes.ok) {
        const error = await removeRes.json();
        throw new Error(error.message || 'Failed to remove effect');
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
      case 'particle': return 'bi-stars';
      case 'animation': return 'bi-play-circle';
      case 'glow': return 'bi-lightning';
      case 'cursor': return 'bi-cursor';
      default: return 'bi-palette';
    }
  };

  const getPriceDisplay = (price: number, _premiumOnly?: boolean) => {
    if (isPremium && price > 0) return 'FREE (Premium)';
    if (price === 0) return 'FREE';
    return `${price.toFixed(0)} Coins`;
  };

  const handlePreviewEffect = (product: Product) => {
    setPreviewProduct(product);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Loading shop...</div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">
            🎨 Effects
          </h1>
          <p className="text-gray-300 text-base mb-4">Enhance your profile with amazing effects</p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              Active
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
                {product.premiumOnly && (
                  <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                    PREMIUM
                  </span>
                )}
                {!product.premiumOnly && product.price === 0 && (
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                    FREE
                  </span>
                )}
                {product.isApplied && (
                  <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                    ACTIVE
                  </span>
                )}
              </div>

              {/* Icon */}
              <div className="text-6xl mb-4 text-center flex items-center justify-center">
                {product.icon ? (
                  <i className={`bi ${product.icon} text-purple-400`}></i>
                ) : (
                  <i className={`bi ${getCategoryIcon(product.category)} text-purple-400`}></i>
                )}
              </div>

              {/* Product Info */}
              <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-4 min-h-[40px]">{product.description}</p>

              {/* Category & Price */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <i className={`bi ${getCategoryIcon(product.category)}`}></i>
                  <span className="capitalize">{product.category || 'general'}</span>
                </span>
                <span className={`text-lg font-bold ${
                  (product.price === 0 || (isPremium && product.price > 0)) ? 'text-green-400' : 'text-purple-400'
                }`}>
                  {getPriceDisplay(product.price, product.premiumOnly)}
                </span>
              </div>

              {/* Preview Button */}
              <div className="mb-3">
                <button
                  onClick={() => handlePreviewEffect(product)}
                  className="w-full py-2 rounded-xl font-semibold transition-all duration-300 bg-gray-700 text-white hover:bg-gray-600 text-sm flex items-center justify-center gap-2"
                >
                  <i className="bi bi-eye"></i>
                  <span>Preview Effect</span>
                </button>
              </div>

              {/* Action Buttons */}
              {!product.isOwned ? (
                // Hide purchase button if premiumOnly and user is not premium
                product.premiumOnly && !isPremium ? (
                  <div className="w-full py-3 rounded-xl font-semibold bg-gray-700/50 text-gray-400 text-center flex items-center justify-center gap-2">
                    <i className="bi bi-lock"></i>
                    <span>Premium Required</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handlePurchaseEffect(product)}
                    disabled={applying === product.productId}
                    className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {applying === product.productId ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Purchasing...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-cart-plus"></i>
                        <span>Buy {getPriceDisplay(product.price, product.premiumOnly)}</span>
                      </>
                    )}
                  </button>
                )
              ) : product.isApplied ? (
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

        {/* Preview Modal */}
        {previewProduct && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl border border-purple-500/20 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <i className={`bi ${getCategoryIcon(previewProduct.category)} text-2xl text-purple-400`}></i>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{previewProduct.name}</h2>
                    <p className="text-gray-400 text-sm">{previewProduct.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewProduct(null)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-all text-gray-400 hover:text-white"
                >
                  <i className="bi bi-x-lg text-xl"></i>
                </button>
              </div>

              {/* Preview Area */}
              <div className="flex-1 p-6 overflow-auto">
                <div className="relative bg-gray-900 rounded-xl p-8 min-h-[400px] flex items-center justify-center overflow-hidden">
                  {/* Preview Text */}
                  <div className="relative z-10">
                    <h3 
                      className="text-4xl font-bold text-white"
                      style={previewProduct.effectData ? (() => {
                        try {
                          const effectData = JSON.parse(previewProduct.effectData);
                          const effectType = effectData.type || previewProduct.category || 'text';
                          
                          // Apply text effects based on type
                          if (effectType.includes('neon') || effectType.includes('glow')) {
                            return {
                              textShadow: '0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.6), 0 0 30px rgba(255, 0, 255, 0.4)',
                              animation: 'neonGlow 3s ease-in-out infinite'
                            };
                          } else if (effectType.includes('rainbow') || effectType.includes('gradient')) {
                            return {
                              background: 'linear-gradient(45deg, #f0f, #0ff, #ff0, #f0f)',
                              backgroundSize: '300% 300%',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              animation: 'rainbowGradient 3s ease infinite'
                            };
                          } else if (effectType.includes('pulse')) {
                            return {
                              animation: 'pulseText 2s ease-in-out infinite'
                            };
                          }
                        } catch (e) {
                          // Silent fail
                        }
                        return {};
                      })() : {}}
                    >
                      {previewProduct.name}
                    </h3>
                    <p className="text-gray-400 mt-2 text-center">Preview Text</p>
                  </div>

                  {/* Effect Renderer for particle/animation effects */}
                  {(previewProduct.category === 'particle' || previewProduct.category === 'animation') && (
                    <EffectRenderer
                      effectType={previewProduct.category || 'particle'}
                      effectData={previewProduct.effectData}
                      appliedTo="profile"
                      className="absolute inset-0"
                    />
                  )}
                </div>

                {/* Effect Info */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="bi bi-tag text-purple-400"></i>
                      <span className="text-gray-300 text-sm">Category</span>
                    </div>
                    <p className="text-white font-semibold capitalize">{previewProduct.category || 'general'}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="bi bi-currency-bitcoin text-yellow-400"></i>
                      <span className="text-gray-300 text-sm">Price</span>
                    </div>
                    <p className="text-white font-semibold">{getPriceDisplay(previewProduct.price, previewProduct.premiumOnly)}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-700 flex gap-3">
                <button
                  onClick={() => setPreviewProduct(null)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <i className="bi bi-x-lg"></i>
                  <span>Close</span>
                </button>
                {!previewProduct.isOwned ? (
                  // Hide purchase button if premiumOnly and user is not premium
                  previewProduct.premiumOnly && !isPremium ? (
                    <div className="flex-1 px-4 py-2 bg-gray-700/50 text-gray-400 rounded-lg flex items-center justify-center gap-2">
                      <i className="bi bi-lock"></i>
                      <span>Premium Required</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setPreviewProduct(null);
                        handlePurchaseEffect(previewProduct);
                      }}
                      className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <i className="bi bi-cart-plus"></i>
                      <span>Buy {getPriceDisplay(previewProduct.price, previewProduct.premiumOnly)}</span>
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => {
                      setPreviewProduct(null);
                      handleApplyEffect(previewProduct);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <i className="bi bi-check-circle"></i>
                    <span>Apply Effect</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;

