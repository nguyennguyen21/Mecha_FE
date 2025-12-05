import { useState, useEffect } from 'react';

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

interface Product {
  productId: number;
  name: string;
  type: string;
  category?: string;
  effectData?: string;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:30052';

export const useUserEffects = (userId: number | undefined) => {
  const [activeEffects, setActiveEffects] = useState<Array<UserEffect & { product?: Product }>>([]);
  const [loading, setLoading] = useState(false);
  const [appliedEffect, setAppliedEffect] = useState<UserEffect & { product?: Product } | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchEffects = async () => {
      setLoading(true);
      try {
        // Fetch user's active effects
        const res = await fetch(`${API_BASE_URL}/api/Shop/user/${userId}/effects`);
        if (!res.ok) throw new Error('Failed to fetch effects');
        
        const effects: UserEffect[] = await res.json();
        
        // Filter only active effects
        const active = effects.filter(e => e.isActive);
        
        // Fetch product details for each effect
        const effectsWithProducts = await Promise.all(
          active.map(async (effect) => {
            try {
              const productRes = await fetch(`${API_BASE_URL}/api/Shop/product/${effect.productId}?userId=${userId}`);
              if (productRes.ok) {
                const product: Product = await productRes.json();
                return { ...effect, product };
              }
            } catch (err) {
              console.error(`Failed to fetch product ${effect.productId}:`, err);
            }
            return effect;
          })
        );
        
        setActiveEffects(effectsWithProducts);
        
        // Set the first active effect as applied effect
        if (effectsWithProducts.length > 0) {
          setAppliedEffect(effectsWithProducts[0]);
        } else {
          setAppliedEffect(null);
        }
      } catch (err) {
        console.error('Failed to fetch user effects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEffects();
  }, [userId]);

  return { activeEffects, loading, appliedEffect };
};

