/**
 * Shared TypeScript types for the Mumtaz Store eCommerce application
 */

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'cosmetics' | 'baby-products';
  image: string;
  stock: number;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Admin {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  admin: Admin;
}

export type Category = 'all' | 'cosmetics' | 'baby-products';

export interface AppState {
  products: Product[];
  cart: CartItem[];
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  searchQuery: string;
  selectedCategory: Category;
}
