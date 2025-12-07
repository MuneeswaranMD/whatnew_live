import React from 'react';
import { Calendar, Clock, ArrowRight, BookOpen, User, Tag, ChevronRight, TrendingUp, Smartphone, Download, Zap, Globe, Cpu, Star } from 'lucide-react';
import { BlogPost } from '../types';
import Reveal from '../components/Reveal';
import { Link } from 'react-router-dom';

interface BlogPostWithImage extends BlogPost {
   image: string;
}

const posts: BlogPostWithImage[] = [
   {
      id: 1,
      title: 'The Rise of Holographic Displays',
      excerpt: 'Beyond VR: How screenless 3D displays are changing entertainment and communication.',
      date: 'Dec 12, 2025',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?auto=format&fit=crop&w=800&q=80'
   },
   {
      id: 2,
      title: 'Web3 & The New Internet Economy',
      excerpt: 'Understanding the shift to decentralized finance and ownership in the digital age.',
      date: 'Dec 10, 2025',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80'
   },
   {
      id: 3,
      title: 'AI in Everyday Life: 2026 Predictions',
      excerpt: 'From smart homes to personalized healthcare, how AI will seamlessly integrate into our daily routines.',
      date: 'Dec 05, 2025',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80'
   },
   {
      id: 4,
      title: 'Sustainable Tech: Green Innovations',
      excerpt: 'The gadgets and systems reducing our carbon footprint without compromising performance.',
      date: 'Nov 28, 2025',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1542601906990-24d4a8d60510?auto=format&fit=crop&w=800&q=80'
   },
   {
      id: 5,
      title: 'The Evolution of Digital Fashion',
      excerpt: 'Why virtual clothing is becoming a multi-billion dollar industry in the metaverse.',
      date: 'Nov 22, 2025',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80'
   },
   {
      id: 6,
      title: 'Brain-Computer Interfaces',
      excerpt: 'Connecting mind and machine: The latest breakthroughs in neural technology.',
      date: 'Nov 15, 2025',
      readTime: '9 min read',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
   }
];

const topics = [
   { name: 'Future Tech', icon: <Cpu size={20} />, color: 'bg-blue-500', count: '12 Articles' },
   { name: 'Live Commerce', icon: <Zap size={20} />, color: 'bg-yellow-500', count: '8 Articles' },
   { name: 'Global Trends', icon: <Globe size={20} />, color: 'bg-purple-500', count: '15 Articles' },
   { name: 'Creator Economy', icon: <Star size={20} />, color: 'bg-rose-500', count: '10 Articles' },
];

const experts = [
   { name: 'Alex Rivera', role: 'Tech Editor', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80' },
   { name: 'Sarah Chen', role: 'Market Analyst', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80' },
   { name: 'Jordan Lee', role: 'Product Lead', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
];

const categories = ["Live Shopping", "Technology", "Collectibles", "Seller Tips", "Market Trends", "Productivity"];

const Blog: React.FC = () => {
   return (
      <div className="min-h-screen bg-slate-50">

         {/* Hero Header */}
         <div className="bg-slate-900 text-white pt-24 pb-24 relative overflow-hidden [perspective:2000px]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center [transform-style:preserve-3d]">
               <Reveal>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-primary-300 text-sm font-medium mb-6 hover:scale-105 transition-transform">
                     <BookOpen size={14} fill="currentColor" /> The Blog
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-6 [transform:translateZ(40px)]">Latest Insights</h1>
                  <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed [transform:translateZ(20px)]">
                     News, guides, and stories from the world of tech and live commerce.
                  </p>
               </Reveal>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-20 -mt-10">

            {/* Featured Post - App Launch */}
            <Reveal className="mb-16">
               <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden flex flex-col md:flex-row group cursor-pointer relative transition-all duration-500 hover:shadow-2xl [transform-style:preserve-3d] hover:[transform:rotateX(2deg)_rotateY(2deg)]">
                  <div className="md:w-1/2 bg-slate-900 h-64 md:h-auto relative overflow-hidden flex items-center justify-center [transform-style:preserve-3d]">
                     <div className="absolute inset-0 bg-gradient-to-tr from-primary-900 to-slate-900 z-10"></div>
                     <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-30 group-hover:scale-110 transition-transform duration-700 [transform:translateZ(-10px)]"></div>

                     <div className="relative z-20 text-center p-8 [transform:translateZ(30px)]">
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl transform group-hover:-translate-y-2 transition-transform duration-500">
                           <TrendingUp className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                           <div className="text-white font-bold text-lg">Commerce Live</div>
                           <div className="text-primary-300 text-sm">Now Available</div>
                        </div>
                     </div>

                     <div className="absolute bottom-6 left-6 z-20 [transform:translateZ(20px)]">
                        <span className="bg-secondary-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                           <Download size={12} /> Feature Update
                        </span>
                     </div>
                  </div>

                  <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center [transform-style:preserve-3d]">
                     <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                        <span className="flex items-center gap-1"><Calendar size={14} /> Dec 14, 2025</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> 5 min read</span>
                     </div>
                     <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 group-hover:text-primary-600 transition-colors [transform:translateZ(20px)]">
                        The Era of Live Commerce is Here
                     </h2>
                     <p className="text-lg text-slate-600 mb-8 leading-relaxed [transform:translateZ(10px)]">
                        Connect with customers like never before. Stream live, showcase products in real-time, and drive instant engagement with our new Ecommerce Live suite. The future of shopping is interactive.
                     </p>
                     <div className="flex items-center gap-3 [transform:translateZ(10px)]">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                           <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500"><User size={20} /></div>
                        </div>
                        <div>
                           <p className="text-sm font-bold text-slate-900">WhatNew Team</p>
                           <p className="text-xs text-slate-500">Official Announcement</p>
                        </div>
                     </div>
                  </div>
               </div>
            </Reveal>
            {/* New Sections: Topics & Experts */}
            <div className="mb-20 space-y-20">
               {/* Trending Topics Grid */}
               <Reveal>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                     {topics.map((topic, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer [transform-style:preserve-3d]">
                           <div className={`${topic.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                              {topic.icon}
                           </div>
                           <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{topic.name}</h3>
                           <p className="text-sm text-slate-500 mt-1">{topic.count}</p>
                        </div>
                     ))}
                  </div>
               </Reveal>

               {/* Expert Contributors */}
               <Reveal>
                  <div className="bg-slate-900 rounded-3xl p-8 md:p-12 relative overflow-hidden text-center md:text-left">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 rounded-full mix-blend-multiply filter blur-[80px] opacity-20"></div>
                     <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-20"></div>

                     <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="md:w-1/3">
                           <h2 className="text-3xl font-black text-white mb-4">Meet Our Experts</h2>
                           <p className="text-slate-300 mb-6">Insights directly from the people building the future of commerce.</p>
                           <button className="bg-white text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors">See All Authors</button>
                        </div>
                        <div className="flex gap-6 justify-center md:justify-end flex-wrap">
                           {experts.map((expert, idx) => (
                              <div key={idx} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col items-center w-32 hover:bg-white/20 transition-colors cursor-pointer">
                                 <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-primary-400">
                                    <img src={expert.image} alt={expert.name} className="w-full h-full object-cover" />
                                 </div>
                                 <div className="text-white font-bold text-sm text-center">{expert.name}</div>
                                 <div className="text-primary-300 text-xs text-center">{expert.role}</div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </Reveal>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">

               {/* Main Content */}
               <div className="lg:w-2/3">
                  <div className="grid gap-8">
                     {posts.map((post, index) => (
                        <Reveal key={post.id} delay={index * 100}>
                           <article className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500 group flex flex-col overflow-hidden [transform-style:preserve-3d] hover:[transform:rotateX(2deg)_translateY(-5px)]">
                              <div className="h-56 overflow-hidden relative [transform-style:preserve-3d]">
                                 <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 [transform:translateZ(-10px)]"
                                 />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                                 <div className="absolute bottom-4 left-4 flex items-center gap-4 text-xs font-medium text-white [transform:translateZ(10px)]">
                                    <span className="bg-primary-600 px-2 py-1 rounded">Article</span>
                                    <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                                 </div>
                              </div>

                              <div className="p-8 [transform-style:preserve-3d]">
                                 <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                                    <Calendar size={14} /> {post.date}
                                 </div>
                                 <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors cursor-pointer [transform:translateZ(15px)]">
                                    {post.title}
                                 </h2>
                                 <p className="text-lg text-slate-600 mb-6 leading-relaxed [transform:translateZ(5px)]">
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