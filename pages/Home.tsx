import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Zap, Gift, Tag, Play, Mail, CheckCircle, Smartphone, QrCode } from 'lucide-react';
import Reveal from '../components/Reveal';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 pt-32 pb-40 overflow-hidden text-white">
        <div className="absolute inset-0 overflow-hidden">
           <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
           <div className="absolute top-40 -left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
              Live Shopping Marketplace
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              The Live Shopping <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-orange-400">Marketplace</span>
            </h1>
            
            <p className="mt-4 max-w-2xl mx-auto text-xl md:text-2xl text-slate-300 mb-10 font-light">
              Shop, sell, and connect around the things you love.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/blog" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-primary-600/30 transition-all duration-300 transform hover:scale-105">
                Start Exploring <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 border border-white/20 backdrop-blur-sm text-lg font-bold rounded-full text-white bg-white/5 hover:bg-white/10 transition-all duration-300">
                Become a Seller
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white relative -mt-16 z-20 rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Reveal className="text-center mb-16">
             <h2 className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-2">Live Shopping</h2>
             <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">Experience the Future of Retail</h3>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Card 1: Join In the Fun */}
            <Reveal delay={200} className="h-full">
              <div className="bg-slate-50 rounded-3xl p-8 lg:p-12 border border-slate-100 hover:shadow-xl transition-all duration-300 group h-full">
                <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Play className="text-orange-600 w-8 h-8 fill-current" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Join In the Fun</h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  Take part in fast-paced auctions, incredible flash sales, live show giveaways, and so much more. Interact with sellers and other collectors in real-time.
                </p>
                <ul className="space-y-3">
                   <li className="flex items-center text-slate-700"><CheckCircle size={18} className="text-green-500 mr-2"/> Live Chat & Bidding</li>
                   <li className="flex items-center text-slate-700"><CheckCircle size={18} className="text-green-500 mr-2"/> Instant Giveaways</li>
                </ul>
              </div>
            </Reveal>

            {/* Card 2: We've Got It All */}
            <Reveal delay={400} className="h-full">
              <div className="bg-slate-50 rounded-3xl p-8 lg:p-12 border border-slate-100 hover:shadow-xl transition-all duration-300 group h-full">
                <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingBag className="text-purple-600 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">We've Got It All</h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  Explore 250+ categories, including fashion, coins, sports & Pokémon cards, sneakers, and more. Find rare collectibles and everyday essentials.
                </p>
                 <div className="flex flex-wrap gap-2">
                    <span className="bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-medium text-slate-600">Sneakers</span>
                    <span className="bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-medium text-slate-600">TCG</span>
                    <span className="bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-medium text-slate-600">Vintage</span>
                    <span className="bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-medium text-slate-600">Electronics</span>
                 </div>
              </div>
            </Reveal>
          </div>

        </div>
      </section>

      {/* Deals Section */}
      <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500 rounded-full filter blur-[100px]"></div>
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-16">
            <Reveal className="md:w-1/2">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-400 text-sm font-bold mb-6">
                  <Zap size={16} fill="currentColor"/> Exciting Shopping
               </div>
               <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                  Find Incredible Deals on <span className="text-primary-400">Name Brands</span>
               </h2>
               <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                  From the brands you love, to hard-to-find specialty products. There's a deal on whatever you're looking for. Don't miss out on daily drops.
               </p>
               <Link to="/blog" className="inline-flex items-center font-bold text-primary-400 hover:text-primary-300 transition-colors">
                  Shop Deals Now <ArrowRight className="ml-2" />
               </Link>
            </Reveal>
            
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
               {/* Decorative Cards */}
               <Reveal delay={200} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 transform translate-y-8">
                  <Tag className="text-primary-400 w-8 h-8 mb-4" />
                  <div className="h-4 w-24 bg-slate-700 rounded mb-2"></div>
                  <div className="h-3 w-32 bg-slate-700 rounded opacity-50"></div>
               </Reveal>
               <Reveal delay={400} className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                  <Gift className="text-purple-400 w-8 h-8 mb-4" />
                  <div className="h-4 w-24 bg-slate-700 rounded mb-2"></div>
                  <div className="h-3 w-32 bg-slate-700 rounded opacity-50"></div>
               </Reveal>
               <Reveal delay={600} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 transform translate-y-8">
                  <ShoppingBag className="text-green-400 w-8 h-8 mb-4" />
                  <div className="h-4 w-24 bg-slate-700 rounded mb-2"></div>
                  <div className="h-3 w-32 bg-slate-700 rounded opacity-50"></div>
               </Reveal>
               <Reveal delay={800} className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                  <Zap className="text-yellow-400 w-8 h-8 mb-4" />
                  <div className="h-4 w-24 bg-slate-700 rounded mb-2"></div>
                  <div className="h-3 w-32 bg-slate-700 rounded opacity-50"></div>
               </Reveal>
            </div>
         </div>
      </section>

      {/* App Download Section */}
      <section className="py-32 bg-gradient-to-br from-primary-900 to-slate-900 relative overflow-hidden text-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
             <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <Reveal className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6">
                <Smartphone size={14} /> Official App Launch
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">Experience WhatNew<br/>on the Go</h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                We are thrilled to announce the official launch of the WhatNew mobile app! 
                Shop live auctions, get instant notifications for drops, and manage your sales from anywhere.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="flex items-center gap-3 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 384 512" fill="currentColor" className="w-5 h-5"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-46.6-35.5-5.6-77.3 18.1-113 18.1-36.7 0-79.3-23.7-109.1-23.7-56.5 0-112 33.2-139 96.1-42.8 101.4-1.1 214.3 43.5 283.5 19.3 29.8 45 69.8 81.3 69.8 32.5 0 45-23.2 108.9-23.2 61 0 77 23.2 108.9 23.2 37.6 0 68.8-44.5 94.6-83 18-26.6 25.4-52.9 26.6-53.5-3.2-2.5-16.7-10.8-17.1-76zM245.5 76c16-19.6 30.7-50.6 26.8-80-26.4 1.5-57.5 16-75.5 37.2-14.7 17.5-26.3 49.3-22.6 77.2 29.5 2.7 57.5-16 71.3-34.4z"/></svg>
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wide opacity-60">Download on the</div>
                    <div className="text-sm leading-none">App Store</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 bg-white/10 text-white border border-white/20 px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 512 512" fill="currentColor" className="w-5 h-5"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
                  </div>
                   <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wide opacity-60">Get it on</div>
                    <div className="text-sm leading-none">Google Play</div>
                  </div>
                </button>
              </div>

              <div className="flex items-center gap-4 text-sm text-primary-200">
                <div className="flex -space-x-2">
                   <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-primary-900"></div>
                   <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-primary-900"></div>
                   <div className="w-8 h-8 rounded-full bg-slate-500 border-2 border-primary-900"></div>
                </div>
                <p>Rated 4.9/5 by 10k+ shoppers</p>
              </div>

            </Reveal>
            
            <Reveal delay={200} className="lg:w-1/2 flex justify-center relative">
               <div className="relative bg-white p-4 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://whatnew.com/download" 
                    alt="Download App QR Code" 
                    className="w-48 h-48 md:w-64 md:h-64 rounded-xl"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-primary-600 text-white p-4 rounded-2xl shadow-lg flex items-center gap-2">
                     <QrCode size={24} />
                     <span className="font-bold">Scan to Install</span>
                  </div>
               </div>
               
               {/* Decorative elements */}
               <div className="absolute top-10 -right-10 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="flex items-center gap-3">
                     <div className="bg-green-500 w-10 h-10 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-white" size={20} />
                     </div>
                     <div>
                        <div className="text-xs text-slate-300">New Sale</div>
                        <div className="font-bold text-white">iPhone 15 Pro Max</div>
                     </div>
                  </div>
               </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 bg-white">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Reveal>
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-8">
                 <Mail size={32} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-slate-600 text-lg mb-10">
                 Stay updated with the latest deals, offers, and live shopping events!
              </p>
              
              <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                 <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="flex-1 px-6 py-4 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 bg-slate-50"
                 />
                 <button type="submit" className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-full transition-colors shadow-lg hover:shadow-primary-600/25">
                    Subscribe
                 </button>
              </form>
              <p className="text-xs text-slate-400 mt-4">
                 We care about your data in our <Link to="/privacy" className="underline hover:text-slate-600">privacy policy</Link>.
              </p>
            </Reveal>
         </div>
      </section>

    </div>
  );
};

export default Home;