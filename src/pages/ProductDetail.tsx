/**
 * Product Detail Page
 * Full product information with add to cart
 */

import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, ShoppingCart, Minus, Plus, Heart, Share2, Star, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Product } from '../types';
import { productAPI } from '../services/api';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await productAPI.getById(id);
        setProduct(data);
      } catch {
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-10 bg-gray-200 rounded w-1/3" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <Link to="/products" className="text-pink-600 hover:underline">
          ← Back to Products
        </Link>
      </div>
    );
  }

  const categoryLabel = product.category === 'cosmetics' ? 'Cosmetics' : 'Baby Care';
  const inCart = isInCart(product._id);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-pink-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-lg">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
                  <span className="text-8xl">🧴</span>
                </div>
              )}
            </div>
            {product.featured && (
              <span className="absolute top-6 left-6 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full text-sm font-semibold flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" /> Featured
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <span className={`inline-block w-fit px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
              product.category === 'cosmetics' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {categoryLabel}
            </span>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>

            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-amber-400 fill-current" />
                ))}
              </div>
              <span className="text-gray-500 text-sm">(4.8 · 120 reviews)</span>
            </div>

            <div className="mt-6">
              <span className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            </div>

            <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>

            {/* Stock Status */}
            <div className="mt-6 flex items-center gap-2">
              <Package className={`w-5 h-5 ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity & Add to Cart */}
            {product.stock > 0 && (
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <div className="flex items-center bg-gray-100 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-200 rounded-l-xl transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-3 hover:bg-gray-200 rounded-r-xl transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    // Add all items at once - the context handles batching
                    for (let i = 0; i < quantity; i++) {
                      addToCart(product);
                    }
                  }}
                  className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all active:scale-95 ${
                    inCart
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-xl hover:shadow-pink-200'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {inCart ? `Added ${quantity} to Cart!` : 'Add to Cart'}
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex gap-4">
              <button className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-gray-600 hover:border-pink-300 hover:text-pink-600 transition-colors">
                <Heart className="w-5 h-5" />
                Wishlist
              </button>
              <button className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-gray-600 hover:border-pink-300 hover:text-pink-600 transition-colors">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
