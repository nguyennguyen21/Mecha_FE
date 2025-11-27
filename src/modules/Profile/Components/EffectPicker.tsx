import React, { useState, useEffect } from 'react';

interface UserEffect {
  effectId: number;
  userId: number;
  productId: number;
  productName: string;
  isActive: boolean;
  appliedTo: string;
  effectSettings?: string;
  appliedAt: string;
  product?: {
    productId: number;
    name: string;
    description?: string;
    type: string;
    category?: string;
    price: number;
    premiumOnly: boolean;
    icon?: string;
    effectData?: string;
  };
}

interface EffectPickerProps {
  userId: number | null;
  onEffectApplied?: () => void;
  compact?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5159';

const EffectPicker: React.FC<EffectPickerProps> = ({ userId, onEffectApplied, compact = false }) => {
  const [showEffectPicker, setShowEffectPicker] = useState(false);
  const [userEffects, setUserEffects] = useState<UserEffect[]>([]);
  const [appliedEffect, setAppliedEffect] = useState<UserEffect | null>(null);
  const [applying, setApplying] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserEffects();
    }
  }, [userId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showEffectPicker && !target.closest('.effect-picker-container')) {
        setShowEffectPicker(false);
      }
    };

    if (showEffectPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showEffectPicker]);

  const fetchUserEffects = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/Shop/user/${userId}/effects`);
      if (!res.ok) throw new Error('Failed to fetch effects');
      const effects = await res.json();
      
      // Fetch product details for all effects
      const effectsWithProducts = await Promise.all(
        effects.map(async (effect: any) => {
          try {
            const productRes = await fetch(`${API_BASE_URL}/api/Shop/product/${effect.productId}?userId=${userId}`);
            if (productRes.ok) {
              const product = await productRes.json();
              return { ...effect, product };
            }
          } catch (err) {
            console.error(`Failed to fetch product ${effect.productId}:`, err);
          }
          return effect;
        })
      );
      
      setUserEffects(effectsWithProducts);
      
      // Find active effect
      const active = effectsWithProducts.find((e: any) => e.isActive);
      if (active) {
        setAppliedEffect(active);
      } else {
        setAppliedEffect(null);
      }
    } catch (err) {
      console.error('Failed to fetch effects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyEffect = async (effect: UserEffect) => {
    if (!userId) return;
    
    try {
      setApplying(true);
      const res = await fetch(`${API_BASE_URL}/api/Shop/user/${userId}/effect/${effect.effectId}/apply`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          AppliedTo: 'profile',
          Settings: effect.product?.effectData ? JSON.parse(effect.product.effectData) : null
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to apply effect');
      }
      
      setAppliedEffect(effect);
      setShowEffectPicker(false);
      await fetchUserEffects();
      if (onEffectApplied) onEffectApplied();
    } catch (err: any) {
      console.error('Failed to apply effect:', err);
      alert(err.message || 'Failed to apply effect');
    } finally {
      setApplying(false);
    }
  };

  if (compact) {
    return (
      <div className="effect-picker-container relative">
        <button
          onClick={() => setShowEffectPicker(!showEffectPicker)}
          className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-all shadow-lg flex items-center gap-2"
        >
          <span>✨</span>
          {appliedEffect ? (
            <span className="text-xs">Active</span>
          ) : (
            <span>Effects</span>
          )}
        </button>
        
        {showEffectPicker && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-50 max-h-96 overflow-y-auto effect-picker-container">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-bold text-lg">Apply Effect</h3>
              <p className="text-gray-400 text-sm mt-1">Choose an effect for your profile</p>
            </div>
            
            {loading ? (
              <div className="p-6 text-center">
                <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : userEffects.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <p className="mb-2">No effects owned yet</p>
                <a href="/shop" className="text-purple-400 hover:text-purple-300 underline">
                  Visit Shop
                </a>
              </div>
            ) : (
              <div className="p-2">
                {userEffects.map((effect) => {
                  const product = effect.product || {};
                  return (
                    <div
                      key={effect.effectId}
                      className={`p-3 rounded-lg mb-2 cursor-pointer transition-all ${
                        effect.isActive
                          ? 'bg-green-500/20 border-2 border-green-500'
                          : 'bg-gray-700/50 hover:bg-gray-700 border-2 border-transparent'
                      }`}
                      onClick={() => !applying && handleApplyEffect(effect)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{product.icon || '🎨'}</span>
                          <div>
                            <div className="text-white font-semibold text-sm">{product.name || effect.productName}</div>
                            <div className="text-gray-400 text-xs">{product.category || 'effect'}</div>
                          </div>
                        </div>
                        {effect.isActive && (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>✨</span>
            Profile Effects
          </h3>
          <p className="text-gray-400 text-sm mt-1">Apply visual effects to enhance your profile</p>
        </div>
        <div className="effect-picker-container relative">
          <button
            onClick={() => setShowEffectPicker(!showEffectPicker)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-all shadow-lg flex items-center gap-2"
          >
            <span>Select Effect</span>
            {appliedEffect && (
              <span className="px-2 py-0.5 bg-green-500 rounded-full text-xs">Active</span>
            )}
          </button>
          
          {showEffectPicker && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-50 max-h-96 overflow-y-auto effect-picker-container">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-white font-bold text-lg">Apply Effect</h3>
                <p className="text-gray-400 text-sm mt-1">Choose an effect for your profile</p>
              </div>
              
              {loading ? (
                <div className="p-6 text-center">
                  <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : userEffects.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  <p className="mb-2">No effects owned yet</p>
                  <a href="/shop" className="text-purple-400 hover:text-purple-300 underline">
                    Visit Shop
                  </a>
                </div>
              ) : (
                <div className="p-2">
                  {userEffects.map((effect) => {
                    const product = effect.product || {};
                    return (
                      <div
                        key={effect.effectId}
                        className={`p-3 rounded-lg mb-2 cursor-pointer transition-all ${
                          effect.isActive
                            ? 'bg-green-500/20 border-2 border-green-500'
                            : 'bg-gray-700/50 hover:bg-gray-700 border-2 border-transparent'
                        }`}
                        onClick={() => !applying && handleApplyEffect(effect)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{product.icon || '🎨'}</span>
                            <div>
                              <div className="text-white font-semibold">{product.name || effect.productName}</div>
                              <div className="text-gray-400 text-xs">{product.category || 'effect'}</div>
                            </div>
                          </div>
                          {effect.isActive && (
                            <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {appliedEffect && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{appliedEffect.product?.icon || '✨'}</span>
            <div className="flex-1">
              <div className="text-white font-semibold">{appliedEffect.product?.name || appliedEffect.productName}</div>
              <div className="text-gray-400 text-xs">{appliedEffect.product?.description || 'Active effect'}</div>
            </div>
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
              Active
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EffectPicker;

