import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';

export const parseWeightToKg = (weightStr?: string): number => {
  if (!weightStr) return 0.5;
  const lower = weightStr.toLowerCase().trim();
  if (lower.includes('500g') || lower.includes('500gm')) return 0.5;
  if (lower.includes('1.5kg') || lower.includes('1.5 kg')) return 1.5;
  if (lower.includes('2.5kg') || lower.includes('2.5 kg')) return 2.5;
  if (lower.includes('1kg') || lower.includes('1 kg')) return 1.0;
  if (lower.includes('2kg') || lower.includes('2 kg')) return 2.0;
  if (lower.includes('3kg') || lower.includes('3 kg')) return 3.0;
  
  // Regex match
  const kgMatch = lower.match(/([0-9.]+)\s*kg/);
  if (kgMatch) return parseFloat(kgMatch[1]);
  const gMatch = lower.match(/([0-9.]+)\s*g/);
  if (gMatch) return parseFloat(gMatch[1]) / 1000;
  return 0.5;
};

export interface DeliveryAddress {
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

interface CartState {
  items: CartItem[];
  deliveryAddress: DeliveryAddress;
  setDeliveryAddress: (address: Partial<DeliveryAddress>) => void;
  addItem: (product: Product, weight?: string | number, quantity?: number) => { success: boolean; message?: string };
  removeItem: (cartItemIdOrId: string | number) => void;
  updateQuantity: (cartItemIdOrId: string | number, quantity: number) => { success: boolean; message?: string };
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getTotalWeightKg: () => number;
  getProductTotalWeightKg: (productId: number) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryAddress: {
        address: '',
        city: 'Warangal',
        state: 'Telangana',
        postalCode: '506001'
      },
      setDeliveryAddress: (updates) => {
        set((state) => ({
          deliveryAddress: { ...state.deliveryAddress, ...updates }
        }));
      },

      addItem: (product, weightArg = '500g', quantityArg = 1) => {
        let weightStr = typeof weightArg === 'string' ? weightArg : '500g';
        let qty = typeof weightArg === 'number' ? weightArg : quantityArg || 1;
        if (qty < 1) qty = 1;

        const weightKg = parseWeightToKg(weightStr);
        const cartItemId = `${product.id}-${weightStr}`;

        // Base price represents 1 KG in the catalog
        const basePrice = product.basePrice || product.price;
        const packPrice = Math.round(basePrice * weightKg);

        const currentItems = get().items;
        
        // Calculate current weight of this product in cart
        const currentProductWeight = currentItems
          .filter(item => item.id === product.id)
          .reduce((sum, item) => sum + (item.weightKg || 0.5) * item.quantity, 0);

        const addedWeight = weightKg * qty;
        if (currentProductWeight + addedWeight > 3.001) {
          const maxRemaining = Math.max(0, Number((3.0 - currentProductWeight).toFixed(2)));
          return {
            success: false,
            message: `Order limit exceeded! Maximum allowed is 3 KG per item. You already have ${currentProductWeight} KG in cart (${maxRemaining} KG remaining).`
          };
        }

        // Clean product name if it already has bracketed weight
        const cleanName = product.name.replace(/\s*\([^)]*\)\s*$/, '').trim();

        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.cartItemId === cartItemId || (item.id === product.id && item.weight === weightStr)
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + qty
            };
            return { items: updatedItems };
          }

          const newItem: CartItem = {
            ...product,
            name: cleanName,
            cartItemId,
            weight: weightStr,
            weightKg,
            basePrice,
            price: packPrice,
            quantity: qty
          };

          return { items: [...state.items, newItem] };
        });

        return { success: true };
      },

      removeItem: (cartItemIdOrId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => item.cartItemId !== String(cartItemIdOrId) && item.id !== cartItemIdOrId
          ),
        }));
      },

      updateQuantity: (cartItemIdOrId, quantity) => {
        const state = get();
        const item = state.items.find(
          (i) => i.cartItemId === String(cartItemIdOrId) || i.id === cartItemIdOrId
        );

        if (!item) return { success: false, message: 'Item not found' };

        if (quantity <= 0) {
          get().removeItem(cartItemIdOrId);
          return { success: true };
        }

        const itemWeightKg = item.weightKg || 0.5;

        // Calculate other items for this same product
        const otherWeightForProduct = state.items
          .filter(
            (i) => i.id === item.id && (i.cartItemId ? i.cartItemId !== item.cartItemId : i !== item)
          )
          .reduce((sum, i) => sum + (i.weightKg || 0.5) * i.quantity, 0);

        if (otherWeightForProduct + itemWeightKg * quantity > 3.001) {
          return {
            success: false,
            message: `Maximum order limit is 3 KG per product.`
          };
        }

        set((s) => ({
          items: s.items.map((i) => {
            const isTarget = i.cartItemId === String(cartItemIdOrId) || i.id === cartItemIdOrId;
            return isTarget ? { ...i, quantity } : i;
          }),
        }));

        return { success: true };
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalWeightKg: () => {
        const weight = get().items.reduce((total, item) => {
          const wKg = item.weightKg || parseWeightToKg(item.weight);
          return total + wKg * item.quantity;
        }, 0);
        return Number(weight.toFixed(2));
      },

      getProductTotalWeightKg: (productId: number) => {
        const weight = get().items
          .filter((item) => item.id === productId)
          .reduce((total, item) => {
            const wKg = item.weightKg || parseWeightToKg(item.weight);
            return total + wKg * item.quantity;
          }, 0);
        return Number(weight.toFixed(2));
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);
