/**
 * App Context
 * Provides global state management for products, cart, auth, and UI state
 */

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Product, CartItem, Admin } from '../types';
import { productAPI, authAPI, cartAPI } from '../services/api';

interface AppContextType {
  // Products
  products: Product[];
  loading: boolean;
  fetchProducts: (params?: { category?: string; search?: string; featured?: boolean }) => Promise<void>;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isInCart: (productId: string) => boolean;
  
  // Auth
  admin: Admin | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  
  // UI
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  
  // Toast notifications
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Initialize app
  useEffect(() => {
    const savedAdmin = authAPI.getAdmin();
    const savedToken = localStorage.getItem('mumtaz_token');
    if (savedAdmin && savedToken) {
      setAdmin(savedAdmin);
      setToken(savedToken);
    }
    setCart(cartAPI.getCart());
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const fetchProducts = useCallback(async (params?: { category?: string; search?: string; featured?: boolean }) => {
    setLoading(true);
    try {
      const data = await productAPI.getAll(params);
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      let newCart: CartItem[];
      if (existing) {
        newCart = prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...prev, { ...product, quantity: 1 }];
      }
      cartAPI.saveCart(newCart);
      return newCart;
    });
    showToast(`${product.name} added to cart!`, 'success');
  }, [showToast]);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => {
      const newCart = prev.filter((item) => item._id !== productId);
      cartAPI.saveCart(newCart);
      return newCart;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        const newCart = prev.filter((item) => item._id !== productId);
        cartAPI.saveCart(newCart);
        return newCart;
      }
      const newCart = prev.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      );
      cartAPI.saveCart(newCart);
      return newCart;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    cartAPI.clearCart();
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isInCart = useCallback((productId: string) => cart.some((item) => item._id === productId), [cart]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    setAdmin(response.admin);
    setToken(response.token);
    localStorage.setItem('mumtaz_token', response.token);
    localStorage.setItem('mumtaz_admin', JSON.stringify(response.admin));
    showToast('Welcome back, Admin!', 'success');
  }, [showToast]);

  const logout = useCallback(() => {
    authAPI.logout();
    setAdmin(null);
    setToken(null);
    showToast('Logged out successfully', 'info');
  }, [showToast]);

  const isAuthenticated = !!token;

  return (
    <AppContext.Provider
      value={{
        products,
        loading,
        fetchProducts,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isInCart,
        admin,
        token,
        login,
        logout,
        isAuthenticated,
        searchQuery,
        setSearchQuery,
        cartOpen,
        setCartOpen,
        toast,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
