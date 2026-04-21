/**
 * Admin Dashboard Page
 * Overview of store metrics and quick actions (Daraz-style)
 */

import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package, DollarSign, TrendingUp, Plus, Edit, Trash2,
  Eye, Users, Star, AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Product } from '../types';
import { productAPI } from '../services/api';

export default function AdminDashboard() {
  const { isAuthenticated, admin, showToast } = useApp();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated, loadProducts]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await productAPI.delete(id);
      showToast(`"${name}" deleted`, 'success');
      loadProducts();
    } catch {
      showToast('Failed to delete product', 'error');
    }
  };

  // Calculate stats
  const totalProducts = products.length;
  const cosmeticsCount = products.filter((p) => p.category === 'cosmetics').length;
  const babyCount = products.filter((p) => p.category === 'baby-products').length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10);
  const outOfStock = products.filter((p) => p.stock === 0);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Welcome back, {admin?.email}</p>
            </div>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', value: totalProducts, icon: <Package className="w-6 h-6" />, color: 'from-pink-500 to-rose-500' },
            { label: 'Cosmetics', value: cosmeticsCount, icon: <Star className="w-6 h-6" />, color: 'from-purple-500 to-violet-500' },
            { label: 'Baby Products', value: babyCount, icon: <Users className="w-6 h-6" />, color: 'from-blue-500 to-cyan-500' },
            { label: 'Inventory Value', value: `$${totalValue.toFixed(0)}`, icon: <DollarSign className="w-6 h-6" />, color: 'from-green-500 to-emerald-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.color} text-white`}>
                  {stat.icon}
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Alerts */}
        {(lowStock.length > 0 || outOfStock.length > 0) && (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {lowStock.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                  <div>
                    <h3 className="font-semibold text-amber-800">Low Stock Alert</h3>
                    <p className="text-sm text-amber-600">
                      {lowStock.length} product(s) have low stock (≤10): {lowStock.map(p => p.name).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {outOfStock.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-800">Out of Stock</h3>
                    <p className="text-sm text-red-600">
                      {outOfStock.length} product(s) are out of stock: {outOfStock.map(p => p.name).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Products</h2>
            <Link to="/admin/products" className="text-sm text-pink-600 hover:text-pink-700 font-medium">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No products yet</h3>
              <p className="text-gray-500 mb-6">Add your first product to get started</p>
              <Link
                to="/admin/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Price</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.slice(0, 5).map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg">🧴</div>
                            )}
                          </div>
                          <span className="font-medium text-gray-800 text-sm truncate max-w-[200px]">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.category === 'cosmetics' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {product.category === 'cosmetics' ? 'Cosmetics' : 'Baby Care'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">${product.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.stock === 0 ? 'bg-red-100 text-red-700' :
                          product.stock <= 10 ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {product.stock === 0 ? 'Out of Stock' : product.stock <= 10 ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/product/${product._id}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link to={`/admin/products?edit=${product._id}`} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
