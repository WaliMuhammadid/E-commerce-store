/**
 * Navbar Component
 * Responsive navigation with cart icon, search, and admin link
 */

import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, LogOut, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const { totalItems, cartOpen, setCartOpen, searchQuery, setSearchQuery, isAuthenticated, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const adminMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close admin dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setAdminMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-pink-200 transition-shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Mumtaz Store
              </span>
              <span className="hidden sm:block text-[10px] text-gray-400 -mt-1 tracking-wider">
                COSMETICS & BABY CARE
              </span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition-all text-sm bg-gray-50 focus:bg-white"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </form>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-pink-600 transition-colors text-sm font-medium">
              Home
            </Link>
            <Link to="/products?category=cosmetics" className="text-gray-600 hover:text-pink-600 transition-colors text-sm font-medium">
              Cosmetics
            </Link>
            <Link to="/products?category=baby-products" className="text-gray-600 hover:text-pink-600 transition-colors text-sm font-medium">
              Baby Care
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-pink-600 transition-colors text-sm font-medium">
              All Products
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Admin Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={adminMenuRef}>
                <button
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all"
                >
                  <User className="w-4 h-4" />
                  Admin
                </button>
                {adminMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <Link
                      to="/admin"
                      onClick={() => setAdminMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/products"
                      onClick={() => setAdminMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                    >
                      Manage Products
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={() => { logout(); setAdminMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-pink-600 transition-colors text-sm"
              >
                <User className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative p-2 text-gray-600"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-gray-600"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-4 space-y-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>
            <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-pink-600 font-medium">
              Home
            </Link>
            <Link to="/products?category=cosmetics" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-pink-600 font-medium">
              Cosmetics
            </Link>
            <Link to="/products?category=baby-products" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-pink-600 font-medium">
              Baby Care
            </Link>
            <Link to="/products" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-pink-600 font-medium">
              All Products
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="block py-2 text-pink-600 font-medium">
                  Dashboard
                </Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="block py-2 text-red-600 font-medium">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/admin/login" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-pink-600 font-medium">
                Admin Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
