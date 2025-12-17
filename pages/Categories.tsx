import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { productCategories } from '../data/categories';
import { Search, Sparkles, TrendingUp, ShoppingBag, ArrowRight } from 'lucide-react';

const featuredCategories = [
  { name: 'Fashion & Apparel', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80', count: '5,200+ items' },
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80', count: '3,800+ items' },
  { name: 'Collectibles', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80', count: '2,100+ items' },
];

const Categories: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero Section */}
      <div className="bg-slate-900 text-white pt-24 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-primary-300 text-sm font-medium mb-6">
              <ShoppingBag size={14} /> 250+ Categories
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Browse by Category</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              Discover millions of items across fashion, electronics, collectibles, and more.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search categories..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white/20 transition-all backdrop-blur-sm"
              />
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-20 -mt-10">

        {/* Featured Categories */}
        <Reveal className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles size={20} className="text-primary-500" />
            <h2 className="text-2xl font-bold text-slate-900">Featured Categories</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredCategories.map((cat, idx) => (
              <div key={idx} className="group relative rounded-3xl overflow-hidden h-64 cursor-pointer shadow-lg hover:shadow-2xl transition-all">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                  <p className="text-slate-300 text-sm">{cat.count}</p>
                </div>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp size={12} /> Trending
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* All Categories Header */}
        <Reveal className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">All Categories</h2>
            <span className="text-slate-500 text-sm">{productCategories.length} categories</span>
          </div>
        </Reveal>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productCategories.map((cat, idx) => (
            <Reveal key={cat.id} delay={idx * 50}>
              <Link
                to={`/categories/${cat.id}`}
                className="flex flex-col h-full bg-white hover:bg-slate-50 rounded-xl border border-slate-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300 group overflow-hidden"
              >
                <div className={`p-6 flex items-center justify-between border-b border-slate-100 ${cat.color} bg-opacity-30`}>
                  <div className="p-3 rounded-full bg-white bg-opacity-60 group-hover:scale-110 transition-transform shadow-sm">
                    {cat.icon}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary-600 transition-colors">
                    {cat.name}
                  </h3>

                  <ul className="space-y-2 mt-auto">
                    {cat.subcategories.slice(0, 4).map(sub => (
                      <li key={sub.id} className="text-sm text-slate-500 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-2 group-hover:bg-primary-300 transition-colors"></span>
                        {sub.name}
                      </li>
                    ))}
                    {cat.subcategories.length > 4 && (
                      <li className="text-sm font-medium text-primary-600 mt-2">
                        + {cat.subcategories.length - 4} more
                      </li>
                    )}
                  </ul>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Promotional Banner */}
        <Reveal className="mt-16">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[60px]"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Can't find what you're looking for?</h3>
                <p className="text-white/80">Browse live streams to discover unique items from sellers worldwide.</p>
              </div>
              <Link to="/blog" className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap">
                Watch Live <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
};

export default Categories;