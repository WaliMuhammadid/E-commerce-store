/**
 * Footer Component
 */

import { Sparkles, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Mumtaz Store</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium cosmetics and baby care products. Quality you can trust, beauty you deserve.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">All Products</Link></li>
              <li><Link to="/products?category=cosmetics" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">Cosmetics</Link></li>
              <li><Link to="/products?category=baby-products" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">Baby Care</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">Shipping Info</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">Returns & Exchanges</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-pink-400 flex-shrink-0" />
                123 Beauty Lane, Glow City
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-pink-400 flex-shrink-0" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-pink-400 flex-shrink-0" />
                hello@mumtazstore.com
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors text-sm">
                f
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors text-sm">
                📷
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors text-sm">
                𝕏
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Mumtaz Store. All rights reserved. Made with 💖
        </div>
      </div>
    </footer>
  );
}
