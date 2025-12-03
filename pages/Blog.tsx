import React from 'react';
import { Calendar, Clock, ArrowRight, BookOpen, User, Tag, ChevronRight, TrendingUp, Smartphone, Download } from 'lucide-react';
import { BlogPost } from '../types';
import Reveal from '../components/Reveal';
import { Link } from 'react-router-dom';

interface BlogPostWithImage extends BlogPost {
  image: string;
}

const posts: BlogPostWithImage[] = [
  {
    id: 1,
    title: 'Getting Started with Live Selling',
    excerpt: 'The complete guide to setting up your first stream, engaging with buyers, and making your first sale on WhatNew.',
    date: 'Oct 18, 2025',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1585241936939-be35dad52a35?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'The Future of Live Shopping: Trends to Watch',
    excerpt: 'Live commerce is transforming retail. Discover how real-time interaction and instant purchasing are changing the way we shop online.',
    date: 'Oct 15, 2025',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'Top 5 Collectibles to Watch in 2025',
    excerpt: 'From vintage Pokémon cards to limited edition sneakers, here is what collectors are hunting for this year.',
    date: 'Oct 12, 2025',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1634926878768-2a5b3c426d0d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    title: 'How Technology Is Changing Career Growth',
    excerpt: 'Understand how tech impacts jobs, learning curves, and the future of work environments in the digital age.',
    date: 'Oct 10, 2025',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    title: 'Seller Spotlight: How Sarah Built a Business',
    excerpt: 'An interview with one of WhatNew’s top sellers on how she turned her passion for vintage fashion into a full-time income.',
    date: 'Oct 08, 2025',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1554774853-719586f8c277?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    title: 'Free Software That Works',
    excerpt: 'Top open-source and free tools that deliver professional results without the price tag.',
    date: 'Oct 05, 2025',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'
  }
];

const categories = ["Live Shopping", "Technology", "Collectibles", "Seller Tips", "Market Trends", "Productivity"];

const Blog: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Header */}
      <div className="bg-slate-900 text-white pt-24 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Reveal>
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-primary-300 text-sm font-medium mb-6">
               <BookOpen size={14} fill="currentColor" /> The Blog
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Latest Insights</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              News, guides, and stories from the world of tech and live commerce.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-20 -mt-10">
        
        {/* Featured Post - App Launch */}
        <Reveal className="mb-16">
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden flex flex-col md:flex-row group cursor-pointer relative">
             <div className="md:w-1/2 bg-slate-900 h-64 md:h-auto relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 bg-gradient-to-tr from-primary-900 to-slate-900 z-10"></div>
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-700"></div>
                 
                 <div className="relative z-20 text-center p-8">
                     <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl transform group-hover:-translate-y-2 transition-transform duration-500">
                         <Smartphone className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                         <div className="text-white font-bold text-lg">WhatNew Mobile</div>
                         <div className="text-primary-300 text-sm">Official Launch</div>
                     </div>
                 </div>

                <div className="absolute bottom-6 left-6 z-20">
                   <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                      <Download size={12} /> Launch Publication
                   </span>
                </div>
             </div>
             
             <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><Calendar size={14} /> Oct 20, 2025</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> 3 min read</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 group-hover:text-primary-600 transition-colors">
                  Announcing the WhatNew Mobile App
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                   The wait is finally over. Experience the fastest way to buy and sell. Shop live auctions, get instant notifications, and manage your store from anywhere. Download today on iOS and Android.
                </p>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                      <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500"><User size={20}/></div>
                   </div>
                   <div>
                      <p className="text-sm font-bold text-slate-900">Team WhatNew</p>
                      <p className="text-xs text-slate-500">Product Announcement</p>
                   </div>
                </div>
             </div>
          </div>
        </Reveal>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="grid gap-8">
              {posts.map((post, index) => (
                <Reveal key={post.id} delay={index * 100}>
                  <article className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group flex flex-col overflow-hidden">
                    <div className="h-56 overflow-hidden relative">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                      <div className="absolute bottom-4 left-4 flex items-center gap-4 text-xs font-medium text-white">
                        <span className="bg-primary-600 px-2 py-1 rounded">Article</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                         <Calendar size={14} /> {post.date}
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors cursor-pointer">
                        {post.title}
                      </h2>
                      <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto flex justify-between items-center">
                         <button className="text-slate-900 font-bold flex items-center hover:text-primary-600 transition-colors">
                          Read More <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center gap-2">
                <button className="px-4 py-2 rounded-lg bg-primary-600 text-white font-bold">1</button>
                <button className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">2</button>
                <button className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">3</button>
                <span className="px-4 py-2 text-slate-400">...</span>
                <button className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">Next</button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
             
             {/* Search */}
             <Reveal delay={100}>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                   <h3 className="font-bold text-slate-900 mb-4">Search Articles</h3>
                   <input type="text" placeholder="Keywords..." className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
                </div>
             </Reveal>

             {/* Categories */}
             <Reveal delay={200}>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                   <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Tag size={18} className="text-primary-500" /> Categories
                   </h3>
                   <div className="flex flex-wrap gap-2">
                      {categories.map((cat, idx) => (
                         <Link key={idx} to="#" className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium hover:bg-primary-50 hover:text-primary-600 transition-colors">
                            {cat}
                         </Link>
                      ))}
                   </div>
                </div>
             </Reveal>

             {/* Popular */}
             <Reveal delay={300}>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                   <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <TrendingUp size={18} className="text-primary-500" /> Editor's Pick
                   </h3>
                   
                   <div className="mb-4 rounded-xl overflow-hidden relative h-40">
                      <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="Editor Pick" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                          <h4 className="text-white font-bold text-sm">Strategic Planning for Q4 Sales</h4>
                      </div>
                   </div>

                   <ul className="space-y-4">
                      <li>
                         <Link to="#" className="group">
                            <h4 className="font-bold text-slate-800 text-sm group-hover:text-primary-600 transition-colors line-clamp-2">10 AI Tools You Need in 2025</h4>
                            <span className="text-xs text-slate-400">Oct 14 • 12k views</span>
                         </Link>
                      </li>
                      <li>
                         <Link to="#" className="group">
                            <h4 className="font-bold text-slate-800 text-sm group-hover:text-primary-600 transition-colors line-clamp-2">Why Vintage Fashion is Booming</h4>
                            <span className="text-xs text-slate-400">Sep 29 • 8k views</span>
                         </Link>
                      </li>
                      <li>
                         <Link to="#" className="group">
                            <h4 className="font-bold text-slate-800 text-sm group-hover:text-primary-600 transition-colors line-clamp-2">Beginner's Guide to Crypto Payments</h4>
                            <span className="text-xs text-slate-400">Sep 15 • 6.5k views</span>
                         </Link>
                      </li>
                   </ul>
                </div>
             </Reveal>

             {/* Newsletter */}
             <Reveal delay={400}>
                <div className="bg-primary-900 p-8 rounded-2xl text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600 rounded-full filter blur-[40px] opacity-50"></div>
                   <h3 className="font-bold text-xl mb-2 relative z-10">Subscribe for Updates</h3>
                   <p className="text-primary-200 text-sm mb-6 relative z-10">Get the latest guides and news sent to your inbox weekly.</p>
                   <input type="email" placeholder="Your email" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-primary-300 focus:outline-none focus:bg-white/20 mb-3 relative z-10" />
                   <button className="w-full py-3 bg-white text-primary-900 font-bold rounded-xl hover:bg-primary-50 transition-colors relative z-10">Subscribe</button>
                </div>
             </Reveal>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Blog;