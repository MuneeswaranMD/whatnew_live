import React from 'react';
import { Calendar, Clock, ArrowRight, BookOpen, User, Tag, TrendingUp, Smartphone, Zap, Globe, Cpu, Star, Search, Eye, Heart, Share2, Bookmark, Play } from 'lucide-react';
import Reveal from '../components/Reveal';
import { Link } from 'react-router-dom';

// Blog Post Interface
interface BlogPost {
   id: number;
   title: string;
   excerpt: string;
   content?: string;
   author: {
      name: string;
      role: string;
      image: string;
   };
   category: string;
   tags: string[];
   date: string;
   readTime: string;
   image: string;
   views: number;
   likes: number;
   featured?: boolean;
}

// Manual Blog Posts Data
const blogPosts: BlogPost[] = [
   {
      id: 1,
      title: 'The Complete Guide to Live Shopping in 2025',
      excerpt: 'Discover how live commerce is revolutionizing the way we shop online. From real-time auctions to interactive product demos, learn everything you need to know about this booming industry.',
      author: { name: 'Sarah Chen', role: 'Commerce Expert', image: 'https://i.pravatar.cc/100?img=5' },
      category: 'Live Commerce',
      tags: ['Live Shopping', 'E-commerce', 'Trends'],
      date: 'Dec 15, 2025',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
      views: 15420,
      likes: 892,
      featured: true
   },
   {
      id: 2,
      title: 'How AI is Transforming Customer Experience',
      excerpt: 'Artificial Intelligence is no longer just a buzzword. See how AI-powered tools are creating personalized shopping experiences and boosting conversion rates.',
      author: { name: 'Alex Rivera', role: 'Tech Editor', image: 'https://i.pravatar.cc/100?img=11' },
      category: 'Technology',
      tags: ['AI', 'Machine Learning', 'Customer Experience'],
      date: 'Dec 14, 2025',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
      views: 12350,
      likes: 654
   },
   {
      id: 3,
      title: 'Building Your Brand Through Live Streaming',
      excerpt: 'Learn proven strategies to grow your audience, engage viewers, and build a loyal community through authentic live streaming content.',
      author: { name: 'Jessica Wu', role: 'Content Strategist', image: 'https://i.pravatar.cc/100?img=9' },
      category: 'Creator Tips',
      tags: ['Branding', 'Streaming', 'Growth'],
      date: 'Dec 13, 2025',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      views: 9870,
      likes: 521
   },
   {
      id: 4,
      title: 'NFTs and Digital Collectibles: What You Need to Know',
      excerpt: 'The intersection of blockchain technology and collectibles is creating new opportunities for sellers and collectors alike.',
      author: { name: 'Marcus Wong', role: 'Blockchain Writer', image: 'https://i.pravatar.cc/100?img=12' },
      category: 'Web3',
      tags: ['NFT', 'Blockchain', 'Collectibles'],
      date: 'Dec 12, 2025',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
      views: 8540,
      likes: 432
   },
   {
      id: 5,
      title: 'The Psychology Behind Auction Bidding',
      excerpt: 'Understanding the psychological triggers that drive auction behavior can help both buyers and sellers maximize their success.',
      author: { name: 'Priya Sharma', role: 'Market Analyst', image: 'https://i.pravatar.cc/100?img=23' },
      category: 'Insights',
      tags: ['Psychology', 'Auctions', 'Behavior'],
      date: 'Dec 11, 2025',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
      views: 7650,
      likes: 398
   },
   {
      id: 6,
      title: 'Sustainable Fashion in the Digital Age',
      excerpt: 'How technology is enabling eco-conscious shopping and helping reduce the fashion industry\'s environmental footprint.',
      author: { name: 'Emma Davis', role: 'Sustainability Editor', image: 'https://i.pravatar.cc/100?img=25' },
      category: 'Sustainability',
      tags: ['Fashion', 'Sustainability', 'Environment'],
      date: 'Dec 10, 2025',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
      views: 6890,
      likes: 356
   }
];

// Categories
const categories = [
   { name: 'Live Commerce', count: 24, color: 'from-blue-500 to-cyan-500' },
   { name: 'Technology', count: 18, color: 'from-purple-500 to-pink-500' },
   { name: 'Creator Tips', count: 15, color: 'from-orange-500 to-red-500' },
   { name: 'Web3', count: 12, color: 'from-green-500 to-emerald-500' },
   { name: 'Insights', count: 20, color: 'from-yellow-500 to-amber-500' },
   { name: 'Sustainability', count: 8, color: 'from-teal-500 to-cyan-500' },
];

// Trending Topics
const trendingTopics = ['#LiveShopping', '#AI2025', '#SneakerDrops', '#VintageCollecting', '#CryptoCommerce', '#CreatorEconomy'];

const Blog: React.FC = () => {
   const featuredPost = blogPosts.find(post => post.featured);
   const regularPosts = blogPosts.filter(post => !post.featured);

   return (
      <div className="min-h-screen bg-slate-50">

         {/* Hero Section - Modern Design */}
         <section className="relative bg-gradient-to-br from-slate-900 via-gray-950 to-indigo-950 pt-24 pb-32 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
               <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full mix-blend-screen blur-[150px]"></div>
               <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full mix-blend-screen blur-[180px]"></div>
               <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA0IiBkPSJNMCAwaDYwdjYwSDB6Ii8+PC9nPjwvc3ZnPg==')] opacity-40"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
               <Reveal className="text-center">
                  
                  <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight text-center">
                     Discover. Learn. <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400">Innovate</span>.
                  </h1>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 text-center">
                     Dive deep into the insights shaping tomorrow's digital landscape, from cutting-edge tech to creator economy trends.
                  </p>

                  {/* Search Bar */}
                  <div className="max-w-xl mx-auto relative">
                     <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                     <input
                        type="text"
                        placeholder="Search for articles, topics, or creators..."
                        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white/15 transition-all shadow-lg"
                     />
                  </div>
               </Reveal>

               {/* Trending Topics */}
               <Reveal delay={200} className="mt-20">
                  <div className="flex flex-wrap justify-center gap-3 mt-10">
                     <span className="text-gray-400 text-sm font-medium">Trending:</span>
                     {trendingTopics.map((topic, idx) => (
                        <Link key={idx} to="#" className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm text-white font-medium transition-all shadow-md">
                           {topic}
                        </Link>
                     ))}
                  </div>
               </Reveal>
            </div>
         </section>

         {/* Main Content */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-20 relative z-20">

            {/* Featured Post */}
            {featuredPost && (
               <Reveal className="mb-16">
                  <div className="relative group">
                     <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-pink-500 to-secondary-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                     <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden">
                        <div className="grid lg:grid-cols-2">
                           {/* Image Side */}
                           <div className="relative h-64 lg:h-auto overflow-hidden">
                              <img
                                 src={featuredPost.image}
                                 alt={featuredPost.title}
                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                              <div className="absolute top-6 left-6">
                                 <span className="bg-primary-600 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide">
                                    Featured
                                 </span>
                              </div>
                              <div className="absolute bottom-6 left-6 flex items-center gap-4">
                                 <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md text-white text-sm px-3 py-1.5 rounded-full">
                                    <Eye size={14} /> {featuredPost.views.toLocaleString()}
                                 </div>
                                 <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md text-white text-sm px-3 py-1.5 rounded-full">
                                    <Heart size={14} /> {featuredPost.likes}
                                 </div>
                              </div>
                           </div>

                           {/* Content Side */}
                           <div className="p-8 lg:p-12 flex flex-col justify-center">
                              <div className="flex items-center gap-3 mb-4">
                                 <span className="bg-primary-50 text-primary-600 text-sm font-bold px-3 py-1 rounded-full">
                                    {featuredPost.category}
                                 </span>
                                 <span className="text-slate-400 text-sm flex items-center gap-1">
                                    <Clock size={14} /> {featuredPost.readTime}
                                 </span>
                              </div>

                              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 group-hover:text-primary-600 transition-colors">
                                 {featuredPost.title}
                              </h2>

                              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                 {featuredPost.excerpt}
                              </p>

                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                    <img src={featuredPost.author.image} alt={featuredPost.author.name} className="w-12 h-12 rounded-full border-2 border-primary-200" />
                                    <div>
                                       <div className="font-bold text-slate-900">{featuredPost.author.name}</div>
                                       <div className="text-sm text-slate-500">{featuredPost.author.role}</div>
                                    </div>
                                 </div>
                                 <Link to="#" className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors">
                                    Read Article <ArrowRight size={18} />
                                 </Link>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </Reveal>
            )}

            {/* Categories Bar */}
            <Reveal className="mb-12">
               <div className="flex flex-wrap gap-3 justify-center">
                  <button className="px-6 py-2.5 bg-slate-900 text-white rounded-full font-bold text-sm">
                     All Posts
                  </button>
                  {categories.map((cat, idx) => (
                     <button
                        key={idx}
                        className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-full font-medium text-sm hover:border-primary-300 hover:text-primary-600 transition-all"
                     >
                        {cat.name} <span className="text-slate-400">({cat.count})</span>
                     </button>
                  ))}
               </div>
            </Reveal>

            {/* Blog Posts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
               {regularPosts.map((post, index) => (
                  <Reveal key={post.id} delay={index * 100}>
                     <article className="group bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                        {/* Image */}
                        <div className="relative h-52 overflow-hidden">
                           <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                           {/* Category Badge */}
                           <div className="absolute top-4 left-4">
                              <span className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full">
                                 {post.category}
                              </span>
                           </div>

                           {/* Actions */}
                           <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-700 hover:text-primary-600 transition-colors">
                                 <Bookmark size={14} />
                              </button>
                              <button className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-700 hover:text-primary-600 transition-colors">
                                 <Share2 size={14} />
                              </button>
                           </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                           {/* Meta */}
                           <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                              <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                              <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>
                           </div>

                           {/* Title */}
                           <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                              {post.title}
                           </h3>

                           {/* Excerpt */}
                           <p className="text-slate-600 mb-6 flex-1 line-clamp-3">
                              {post.excerpt}
                           </p>

                           {/* Author & Stats */}
                           <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                              <div className="flex items-center gap-3">
                                 <img src={post.author.image} alt={post.author.name} className="w-9 h-9 rounded-full" />
                                 <span className="text-sm font-medium text-slate-700">{post.author.name}</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-slate-400">
                                 <span className="flex items-center gap-1"><Eye size={14} /> {(post.views / 1000).toFixed(1)}k</span>
                                 <span className="flex items-center gap-1"><Heart size={14} /> {post.likes}</span>
                              </div>
                           </div>
                        </div>
                     </article>
                  </Reveal>
               ))}
            </div>

            {/* Load More */}
            <div className="text-center mb-20">
               <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors">
                  Load More Articles
               </button>
            </div>

            {/* Newsletter Section */}
            <Reveal>
               <div className="relative bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-8 md:p-16 overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px]"></div>
                  <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 rounded-full blur-[60px]"></div>

                  <div className="relative z-10 max-w-2xl mx-auto text-center">
                     <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-bold mb-6">
                        <Zap size={16} /> Never Miss an Update
                     </div>
                     <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                        Subscribe to Our Newsletter
                     </h3>
                     <p className="text-white/80 text-lg mb-8">
                        Get the latest articles, insights, and exclusive content delivered straight to your inbox every week.
                     </p>
                     <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <input
                           type="email"
                           placeholder="Enter your email"
                           className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                        <button className="px-8 py-4 bg-white text-primary-700 rounded-2xl font-bold hover:bg-slate-100 transition-colors whitespace-nowrap">
                           Subscribe
                        </button>
                     </div>
                     <p className="text-white/60 text-sm mt-4">No spam. Unsubscribe anytime.</p>
                  </div>
               </div>
            </Reveal>
         </div>
      </div>
   );
};

export default Blog;