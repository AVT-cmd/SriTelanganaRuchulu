import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  role: 'ADMIN' | 'CUSTOMER';
  createdAt?: string;
  firstOrderDiscountUsed?: boolean;
}

interface AuthState {
  isLoggedIn: boolean;
  user: UserProfile | null;
  token: string | null;
  login: (user: UserProfile, token?: string) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  markFirstOrderDiscountUsed: () => void;
  isFirstOrderEligible: () => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      token: null,
      login: (user, token = 'demo-session-token') =>
        set({
          isLoggedIn: true,
          user: {
            ...user,
            firstOrderDiscountUsed: user.firstOrderDiscountUsed || false
          },
          token,
        }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      markFirstOrderDiscountUsed: () =>
        set((state) => ({
          user: state.user ? { ...state.user, firstOrderDiscountUsed: true } : null,
        })),
      isFirstOrderEligible: () => false,
      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
          token: null,
        }),
    }),
    {
      name: 'telangana-ruchulu-auth-storage',
    }
  )
);
