import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Twitter, Github, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-900/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-900/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 text-white group">
              <div className="bg-gradient-to-tr from-primary-500 to-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                <Zap size={24} fill="currentColor" />
              </div>
              <span className="font-black text-2xl tracking-tight">WhatNew</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              The premier destination for live commerce. Discover, bid, and buy from vetted sellers worldwide.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all duration-300 hover:-translate-y-1"><Twitter size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all duration-300 hover:-translate-y-1"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-1"><Linkedin size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all duration-300 hover:-translate-y-1"><Github size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest text-primary-400">Platform</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/home" className="hover:text-white hover:translate-x-1 transition-all inline-block">Live Auctions</Link></li>
              <li><Link to="/drops" className="hover:text-white hover:translate-x-1 transition-all inline-block">Exclusive Drops</Link></li>
              <li><Link to="/blog" className="hover:text-white hover:translate-x-1 transition-all inline-block">Community Blog</Link></li>
              <li><Link to="/contact" className="hover:text-white hover:translate-x-1 transition-all inline-block">Sell on WhatNew</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest text-primary-400">Support</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/order-status" className="hover:text-white hover:translate-x-1 transition-all inline-block">Track Order</Link></li>
              <li><Link to="/returns" className="hover:text-white hover:translate-x-1 transition-all inline-block">Returns & Refunds</Link></li>
              <li><Link to="/payment" className="hover:text-white hover:translate-x-1 transition-all inline-block">Payment Options</Link></li>
              <li><Link to="/privacy" className="hover:text-white hover:translate-x-1 transition-all inline-block">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-white hover:translate-x-1 transition-all inline-block">Help Center</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest text-primary-400">Stay Updated</h3>
            <p className="text-slate-400 text-sm mb-4">Get the latest drops and auction alerts straight to your inbox.</p>
            <div className="flex flex-col gap-3">
              <input type="email" placeholder="Enter your email" className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors" />
              <button className="bg-white text-slate-900 font-bold rounded-xl px-4 py-3 text-sm hover:bg-primary-50 transition-colors">Subscribe</button>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          <p>© 2025 WhatNew Inc. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;