/**
 * API Service Layer
 * 
 * This service provides two modes:
 * 1. LocalStorage mode (default) - Works standalone without backend
 * 2. API mode - Connects to the real Express backend
 * 
 * Set USE_API=true in localStorage to switch to real API mode
 */

import type { Product, CartItem, AuthResponse } from '../types';

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

function shouldUseApi(): boolean {
  return localStorage.getItem('USE_API') === 'true';
}

async function withStandaloneFallback<T>(
  apiHandler: () => Promise<T>,
  fallbackHandler: () => T | Promise<T>
): Promise<T> {
  if (shouldUseApi()) {
    try {
      return await apiHandler();
    } catch (error) {
      console.warn('API unavailable. Falling back to standalone mode.', error);
    }
  }

  return await fallbackHandler();
}

// ============================================================
// LocalStorage Helpers (standalone mode)
// ============================================================

const STORAGE_KEYS = {
  PRODUCTS: 'mumtaz_products',
  CART: 'mumtaz_cart',
  TOKEN: 'mumtaz_token',
  ADMIN: 'mumtaz_admin',
};

/** Seed initial products if none exist */
function seedProducts(): Product[] {
  const existing = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (existing) return JSON.parse(existing);

  const products: Product[] = [
    {
      _id: '1',
      name: 'Rose Glow Face Serum',
      description: 'Luxurious rose-infused face serum that hydrates and brightens your skin. Made with natural rose extracts and hyaluronic acid for deep moisturization.',
      price: 29.99,
      category: 'cosmetics',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
      stock: 45,
      featured: true,
    },
    {
      _id: '2',
      name: 'Velvet Matte Lipstick',
      description: 'Long-lasting velvet matte lipstick in a stunning shade of berry. Enriched with vitamin E for soft, smooth lips all day long.',
      price: 18.99,
      category: 'cosmetics',
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
      stock: 120,
      featured: true,
    },
    {
      _id: '3',
      name: 'Baby Gentle Wash',
      description: 'Tear-free, pH-balanced gentle body wash specially formulated for babies. Made with organic chamomile and aloe vera to protect delicate skin.',
      price: 12.99,
      category: 'baby-products',
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
      stock: 80,
      featured: true,
    },
    {
      _id: '4',
      name: 'Hydrating Face Cream',
      description: 'Deep hydrating face cream with ceramides and niacinamide. Perfect for all skin types, providing 24-hour moisture lock.',
      price: 34.99,
      category: 'cosmetics',
      image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop',
      stock: 60,
      featured: false,
    },
    {
      _id: '5',
      name: 'Baby Moisturizing Lotion',
      description: 'Ultra-gentle moisturizing lotion for baby\'s delicate skin. Contains shea butter and oat extract to prevent dryness and irritation.',
      price: 14.99,
      category: 'baby-products',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
      stock: 95,
      featured: true,
    },
    {
      _id: '6',
      name: 'Natural Eye Shadow Palette',
      description: '12-shade natural eye shadow palette with matte and shimmer finishes. Highly pigmented, blendable, and long-lasting formula.',
      price: 24.99,
      category: 'cosmetics',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop',
      stock: 35,
      featured: false,
    },
    {
      _id: '7',
      name: 'Baby Diaper Rash Cream',
      description: 'Fast-acting diaper rash cream with zinc oxide and calendula. Provides instant relief and creates a protective barrier for baby\'s skin.',
      price: 9.99,
      category: 'baby-products',
      image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=400&fit=crop',
      stock: 150,
      featured: false,
    },
    {
      _id: '8',
      name: 'Vitamin C Brightening Serum',
      description: 'Powerful vitamin C serum that brightens skin tone and reduces dark spots. Contains 20% vitamin C, ferulic acid, and vitamin E.',
      price: 39.99,
      category: 'cosmetics',
      image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop',
      stock: 28,
      featured: true,
    },
  ];

  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  return products;
}

function getProducts(): Product[] {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!data) return seedProducts();
  return JSON.parse(data);
}

function saveProducts(products: Product[]): void {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

// ============================================================
// API Service (Real Backend Mode)
// ============================================================

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============================================================
// Product API
// ============================================================

export const productAPI = {
  /** Get all products with optional filters */
  async getAll(params?: { category?: string; search?: string; featured?: boolean }): Promise<Product[]> {
    return withStandaloneFallback(
      async () => {
        const query = new URLSearchParams();
        if (params?.category) query.set('category', params.category);
        if (params?.search) query.set('search', params.search);
        if (params?.featured) query.set('featured', 'true');
        const qs = query.toString();
        return apiRequest<Product[]>(`/products${qs ? `?${qs}` : ''}`);
      },
      () => {
        let products = getProducts();
        if (params?.category && params.category !== 'all') {
          products = products.filter((p) => p.category === params.category);
        }
        if (params?.search) {
          const q = params.search.toLowerCase();
          products = products.filter(
            (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
          );
        }
        if (params?.featured) {
          products = products.filter((p) => p.featured);
        }
        return products;
      }
    );
  },

  /** Get single product by ID */
  async getById(id: string): Promise<Product | null> {
    return withStandaloneFallback(
      () => apiRequest<Product>(`/products/${id}`),
      () => getProducts().find((p) => p._id === id) || null
    );
  },

  /** Create a new product (Admin) */
  async create(product: Omit<Product, '_id'>): Promise<Product> {
    return withStandaloneFallback(
      () =>
        apiRequest<Product>('/products', {
          method: 'POST',
          body: JSON.stringify(product),
        }),
      () => {
        const products = getProducts();
        const newProduct: Product = {
          ...product,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        products.unshift(newProduct);
        saveProducts(products);
        return newProduct;
      }
    );
  },

  /** Update an existing product (Admin) */
  async update(id: string, product: Partial<Product>): Promise<Product> {
    return withStandaloneFallback(
      () =>
        apiRequest<Product>(`/products/${id}`, {
          method: 'PUT',
          body: JSON.stringify(product),
        }),
      () => {
        const products = getProducts();
        const index = products.findIndex((p) => p._id === id);
        if (index === -1) throw new Error('Product not found');
        products[index] = { ...products[index], ...product };
        saveProducts(products);
        return products[index];
      }
    );
  },

  /** Delete a product (Admin) */
  async delete(id: string): Promise<void> {
    return withStandaloneFallback(
      async () => {
        await apiRequest<Record<string, unknown>>(`/products/${id}`, {
          method: 'DELETE',
        });
      },
      () => {
        const products = getProducts().filter((p) => p._id !== id);
        saveProducts(products);
      }
    );
  },
};

// ============================================================
// Auth API
// ============================================================

export const authAPI = {
  /** Admin login */
  async login(email: string, password: string): Promise<AuthResponse> {
    return withStandaloneFallback(
      () =>
        apiRequest<AuthResponse>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }),
      () => {
        // Default admin credentials for standalone mode
        if (email === 'admin@mumtazstore.com' && password === 'admin123') {
          const response: AuthResponse = {
            token: 'local_jwt_token_' + Date.now(),
            admin: { id: '1', email },
          };
          localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
          localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(response.admin));
          return response;
        }
        throw new Error('Invalid email or password');
      }
    );
  },

  /** Logout */
  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ADMIN);
  },

  /** Check if admin is logged in */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  /** Get current admin */
  getAdmin(): AuthResponse['admin'] | null {
    const data = localStorage.getItem(STORAGE_KEYS.ADMIN);
    return data ? JSON.parse(data) : null;
  },
};

// ============================================================
// Cart API (always localStorage)
// ============================================================

export const cartAPI = {
  getCart(): CartItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    return data ? JSON.parse(data) : [];
  },

  saveCart(cart: CartItem[]): void {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  },

  clearCart(): void {
    localStorage.removeItem(STORAGE_KEYS.CART);
  },
};
