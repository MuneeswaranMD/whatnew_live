import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Twitter, Github, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Logo & Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 text-white group">
              <div className="bg-primary-500 text-white p-1.5 rounded-lg group-hover:bg-primary-600 transition-colors">
                 <Zap size={24} fill="currentColor" />
              </div>
              <span className="font-bold text-2xl tracking-tight">WhatNew</span>
            </Link>
          </div>

          {/* WhatNew Links */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">WhatNew</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/blog" className="hover:text-primary-400 transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-primary-400 transition-colors">Careers</Link></li>
              <li><Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-primary-400 transition-colors">FAQ</Link></li>
              <li><Link to="/affiliates" className="hover:text-primary-400 transition-colors text-primary-400 font-medium">WhatNew Affiliates</Link></li>
            </ul>
          </div>

          {/* Get Help Links */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Get Help</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/order-status" className="hover:text-primary-400 transition-colors">Order Status</Link></li>
              <li><Link to="/payment" className="hover:text-primary-400 transition-colors">Payment</Link></li>
              <li><Link to="/shipping-delivery" className="hover:text-primary-400 transition-colors">Shipping Delivery</Link></li>
              <li><Link to="/returns" className="hover:text-primary-400 transition-colors">Returns</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
             <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Follow Us</h3>
             <div className="flex space-x-4">
                <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-primary-600 hover:text-white transition-all"><Twitter size={20} /></a>
                <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-primary-600 hover:text-white transition-all"><Instagram size={20} /></a>
                <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-primary-600 hover:text-white transition-all"><Linkedin size={20} /></a>
                <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-primary-600 hover:text-white transition-all"><Github size={20} /></a>
             </div>
          </div>

        </div>
        
        <div className="border-t border-slate-800 mt-16 pt-8 text-center text-sm text-slate-500">
          <p>© 2025 WhatNew. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;