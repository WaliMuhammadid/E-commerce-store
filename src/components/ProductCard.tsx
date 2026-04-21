/**
 * ProductCard Component
 * Displays product info with image, price, and add-to-cart button
 */

import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useApp();

  const categoryLabel = product.category === 'cosmetics' ? 'Cosmetics' : 'Baby Care';
  const categoryColor = product.category === 'cosmetics'
    ? 'bg-pink-100 text-pink-700'
    : 'bg-blue-100 text-blue-700';

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <Link to={`/product/${product._id}`} className="relative block overflow-hidden aspect-square bg-gray-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
            <span className="text-6xl">🧴</span>
          </div>
        )}
        {/* Category Badge */}
        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${categoryColor}`}>
          {categoryLabel}
        </span>
        {/* Featured Badge */}
        {product.featured && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" /> Featured
          </span>
        )}
        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-800 px-4 py-2 rounded-full font-bold text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.stock > 0 && product.stock <= 10 && (
              <span className="block text-xs text-orange-500 font-medium">
                Only {product.stock} left!
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (product.stock > 0) addToCart(product);
            }}
            disabled={product.stock === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:shadow-pink-200 active:scale-95'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
