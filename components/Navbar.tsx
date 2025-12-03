import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { NavItem } from '../types';

const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Blog', path: '/blog' },
  { label: 'About', path: '/about' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 lg:p-6 pointer-events-none">
      <nav className={`
        pointer-events-auto
        w-full max-w-6xl transition-all duration-300
        ${scrolled || isOpen ? 'bg-white/90 backdrop-blur-md shadow-xl border border-slate-200/50' : 'bg-white/80 backdrop-blur-sm border border-transparent shadow-sm'}
        rounded-2xl lg:rounded-full px-4 sm:px-6 py-3
      `}>
        <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
                  <div className="bg-primary-600 text-white p-1.5 rounded-lg group-hover:bg-primary-700 transition-colors">
                    <Zap size={20} fill="currentColor" />
                  </div>
                  <span className="font-bold text-lg tracking-tight text-slate-900">WhatNew</span>
              </Link>
            </div>

            {/* Desktop Center Links */}
            <div className="hidden lg:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      isActive(item.path)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                    to="/affiliates"
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      isActive('/affiliates')
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                    }`}
                >
                    Affiliates
                </Link>
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-4">
                 <Link
                    to="/contact"
                    className="text-sm font-bold text-slate-900 hover:text-primary-600 transition-colors whitespace-nowrap"
                >
                    Become a Seller
                </Link>
                <Link 
                    to="/contact"
                    className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-primary-600 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                >
                    Contact Us
                </Link>
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden flex items-center">
                 <button
                  onClick={toggleMenu}
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </div>

        {/* Mobile Menu Content */}
        {isOpen && (
            <div className="lg:hidden pt-4 pb-2 border-t border-slate-100 mt-4 space-y-2 animate-fade-in-up">
                 {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium ${
                      isActive(item.path)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                 <Link
                    to="/affiliates"
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium ${
                      isActive('/affiliates')
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                    }`}
                >
                    Affiliates
                </Link>
                 <Link
                    to="/contact"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-bold text-slate-900 hover:bg-slate-50"
                >
                    Become a Seller
                </Link>
                 <Link
                    to="/contact"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-medium text-center text-white bg-slate-900 hover:bg-primary-600 mt-4 shadow-lg"
                >
                    Contact Us
                </Link>
            </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;