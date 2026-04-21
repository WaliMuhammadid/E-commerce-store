/**
 * Home Page
 * Hero section, featured products, and category highlights
 */

import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Truck, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { products, loading } = useApp();
  const featuredProducts = products.filter((p) => p.featured);
  const cosmeticsProducts = products.filter((p) => p.category === 'cosmetics').slice(0, 4);
  const babyProducts = products.filter((p) => p.category === 'baby-products').slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
          <div className="absolute top-40 right-40 w-64 h-64 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-pink-600 font-medium mb-6 shadow-sm">
                <Sparkles className="w-4 h-4" />
                Premium Beauty & Baby Care
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                Discover Your
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"> Natural Glow</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
                Explore our curated collection of premium cosmetics and gentle baby care products. 
                Because you and your little ones deserve the best.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-pink-200 transition-all active:scale-95"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/products?category=baby-products"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border border-gray-200 hover:border-pink-300 hover:text-pink-600 transition-all"
                >
                  Baby Care
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-8xl">✨</span>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center text-3xl animate-bounce">
                  🧴
                </div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>
                  👶
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Truck className="w-6 h-6" />, title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: <Shield className="w-6 h-6" />, title: 'Secure Payment', desc: '100% protected' },
              { icon: <Heart className="w-6 h-6" />, title: 'Natural Products', desc: 'Chemical-free' },
              { icon: <Sparkles className="w-6 h-6" />, title: 'Premium Quality', desc: 'Hand-picked items' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-pink-50 transition-colors">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{feature.title}</h3>
                  <p className="text-gray-500 text-xs">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {!loading && featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
                <p className="text-gray-500 mt-2">Our most loved items</p>
              </div>
              <Link to="/products" className="hidden sm:flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Shop by Category</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Cosmetics */}
            <Link to="/products?category=cosmetics" className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-100 to-pink-200 p-8 md:p-12 hover:shadow-xl transition-all">
              <div className="relative z-10">
                <span className="text-5xl mb-4 block">💄</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Cosmetics</h3>
                <p className="text-gray-600 mb-4">Premium beauty products for your daily glow</p>
                <span className="inline-flex items-center gap-2 text-pink-700 font-semibold group-hover:gap-3 transition-all">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
              <div className="absolute right-0 bottom-0 w-40 h-40 bg-pink-300/30 rounded-full -translate-y-10 translate-x-10 group-hover:scale-125 transition-transform" />
            </Link>

            {/* Baby Products */}
            <Link to="/products?category=baby-products" className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-100 to-blue-200 p-8 md:p-12 hover:shadow-xl transition-all">
              <div className="relative z-10">
                <span className="text-5xl mb-4 block">👶</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Baby Care</h3>
                <p className="text-gray-600 mb-4">Gentle, safe products for your little ones</p>
                <span className="inline-flex items-center gap-2 text-blue-700 font-semibold group-hover:gap-3 transition-all">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
              <div className="absolute right-0 bottom-0 w-40 h-40 bg-blue-300/30 rounded-full -translate-y-10 translate-x-10 group-hover:scale-125 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Cosmetics Products */}
      {!loading && cosmeticsProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">💄 Cosmetics</h2>
                <p className="text-gray-500 mt-2">Beauty essentials for every occasion</p>
              </div>
              <Link to="/products?category=cosmetics" className="hidden sm:flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cosmeticsProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Baby Products */}
      {!loading && babyProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">👶 Baby Care</h2>
                <p className="text-gray-500 mt-2">Safe and gentle for delicate skin</p>
              </div>
              <Link to="/products?category=baby-products" className="hidden sm:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {babyProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay in the Glow</h2>
          <p className="text-pink-100 mb-8">Subscribe for exclusive deals, new arrivals, and beauty tips</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3.5 rounded-xl outline-none text-gray-800"
            />
            <button className="px-8 py-3.5 bg-white text-pink-600 rounded-xl font-semibold hover:bg-pink-50 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
