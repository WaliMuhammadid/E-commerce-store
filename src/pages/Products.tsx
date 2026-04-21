/**
 * Products Page
 * Product listing with search, filter, and grid layout
 */

import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Filter, Grid, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import type { Category } from '../types';

export default function Products() {
  const { products, loading, fetchProducts } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);

  const category = (searchParams.get('category') || 'all') as Category;
  const search = searchParams.get('search') || '';

  useEffect(() => {
    fetchProducts({
      category: category !== 'all' ? category : undefined,
      search: search || undefined,
    });
  }, [category, search, fetchProducts]);

  const handleCategoryChange = (cat: Category) => {
    const params = new URLSearchParams();
    if (cat !== 'all') params.set('category', cat);
    if (search) params.set('search', search);
    setSearchParams(params);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (localSearch.trim()) params.set('search', localSearch.trim());
    setSearchParams(params);
  };

  const categoryLabel = category === 'all' ? 'All Products' : category === 'cosmetics' ? 'Cosmetics' : 'Baby Care';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">{categoryLabel}</h1>
          <p className="text-gray-500 mt-2">
            {loading ? 'Loading...' : `${products.length} products found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              {/* Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </form>

              {/* Categories */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Category</label>
                <div className="space-y-2">
                  {[
                    { value: 'all' as Category, label: 'All Products', count: products.length },
                    { value: 'cosmetics' as Category, label: 'Cosmetics', count: products.filter(p => p.category === 'cosmetics').length },
                    { value: 'baby-products' as Category, label: 'Baby Care', count: products.filter(p => p.category === 'baby-products').length },
                  ].map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => handleCategoryChange(cat.value)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all ${
                        category === cat.value
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        category === cat.value ? 'bg-white/20' : 'bg-gray-100'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Info */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Price Range</label>
                <div className="text-sm text-gray-500 space-y-1">
                  {products.length > 0 && (
                    <>
                      <p>Min: ${Math.min(...products.map(p => p.price)).toFixed(2)}</p>
                      <p>Max: ${Math.max(...products.map(p => p.price)).toFixed(2)}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {/* Mobile Filter Toggle & Sort Bar */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm font-medium"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <div className="flex items-center gap-2 ml-auto">
                <Grid className="w-4 h-4 text-pink-600" />
                <span className="text-sm text-gray-500">{products.length} items</span>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-xl mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
                    <div className="flex justify-between">
                      <div className="h-6 bg-gray-200 rounded w-16" />
                      <div className="h-9 bg-gray-200 rounded-xl w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => {
                    setLocalSearch('');
                    setSearchParams({});
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
