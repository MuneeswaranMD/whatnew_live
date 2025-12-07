import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Zap, Gift, Tag, Play, Mail, CheckCircle, Smartphone, QrCode, Globe, Users, TrendingUp, Shield, Star, Crown, Timer, Sparkles, MessageCircle } from 'lucide-react';
import Reveal from '../components/Reveal';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 [perspective:2000px] overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute -top-[30%] -right-[10%] w-[800px] h-[800px] bg-primary-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-blob"></div>
          <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-secondary-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 right-[20%] w-[500px] h-[500px] bg-blue-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Text Content */}
            <div className="text-center lg:text-left">
              <Reveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-primary-300 text-xs font-bold uppercase tracking-widest mb-8 hover:bg-white/10 transition-colors">
                  <Crown size={14} className="text-yellow-400" />
                  The #1 Live Commerce Platform
                </div>

                <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]">
                  Shop Live. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 animate-gradient-x">Connect Real.</span>
                </h1>

                <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Experience the thrill of real-time auctions, exclusive drops, and community-driven shopping. The future of retail is live.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/blog" className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg hover:bg-primary-500 hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] flex items-center justify-center gap-2">
                    Start Watching <Play size={20} fill="currentColor" />
                  </Link>
                  <Link to="/contact" className="px-8 py-4 bg-white/5 backdrop-blur-sm text-white border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center">
                    Start Selling
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="mt-12 flex items-center gap-8 justify-center lg:justify-start text-slate-400 text-sm font-medium">
                  <div className="flex items-center gap-2"><CheckCircle size={16} className="text-primary-400" /> Vetted Sellers</div>
                  <div className="flex items-center gap-2"><CheckCircle size={16} className="text-primary-400" /> Buyer Protection</div>
                  <div className="flex items-center gap-2"><CheckCircle size={16} className="text-primary-400" /> Authenticity Guarantee</div>
                </div>
              </Reveal>
            </div>

            {/* 3D Visual */}
            <div className="relative [transform-style:preserve-3d] hidden lg:block perspective-1000">
              <Reveal delay={200} className="relative z-10 [transform:rotateY(-10deg)_rotateX(5deg)] hover:[transform:rotateY(-5deg)_rotateX(2deg)] transition-transform duration-700 ease-out">
                {/* Main Card */}
                <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

                  {/* Live Stream Mockup */}
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-inner mb-6">
                    <img src="https://images.unsplash.com/photo-1708455077076-db5476634532?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Live Stream" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

                    {/* Top UI */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md animate-pulse">LIVE</div>
                      <div className="bg-black/30 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1"><Users size={12} /> 12.5k</div>
                    </div>

                    {/* Bottom UI - Floating Product */}
                    <div className="absolute bottom-4 left-4 right-4 [transform:translateZ(40px)]">
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4 hover:bg-white/20 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-white rounded-lg p-1">
                          <img src="https://images.unsplash.com/photo-1600185365483-26d9a04f0ebd?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-contain rounded" />
                        </div>
                        <div>
                          <div className="text-white font-bold text-sm">Vintage Nike Air Jordan 1</div>
                          <div className="text-primary-300 font-bold">$2,450 <span className="text-slate-400 text-xs font-normal line-through ml-1">$3,000</span></div>
                        </div>
                        <button className="ml-auto bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-500"><ShoppingBag size={18} /></button>
                      </div>
                    </div>

                    {/* Chat Bubbles Floating */}
                    <div className="absolute bottom-24 right-4 flex flex-col items-end gap-2 [transform:translateZ(20px)]">
                      <div className="bg-black/40 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full rounded-tr-none">Copped! 🔥</div>
                      <div className="bg-black/40 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full rounded-tr-none">Wait for meee</div>
                      <div className="bg-black/40 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full rounded-tr-none">Keep 'em coming!</div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-10 -right-10 bg-white p-4 rounded-2xl shadow-xl [transform:translateZ(60px)] animate-float">
                  <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/100?img=5" className="w-10 h-10 rounded-full border-2 border-primary-500" />
                    <div>
                      <div className="text-xs text-slate-500 font-bold">Top Seller</div>
                      <div className="text-slate-900 font-black">SarahVerified</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 border-y border-white/5 py-10 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Users", value: "250K+" },
              { label: "Daily Streams", value: "1,200+" },
              { label: "Total Sales", value: "$45M+" },
              { label: "Brand Partners", value: "500+" }
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 100} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tight">{stat.value}</div>
                <div className="text-sm text-slate-400 uppercase tracking-wider font-bold">{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Live Sections */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12 flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-4">Trending Now</h2>
              <p className="text-slate-600 text-lg">Watch what everyone is talking about.</p>
            </div>
            <Link to="#" className="text-primary-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">View All <ArrowRight size={20} /></Link>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="group rounded-3xl overflow-hidden relative aspect-[3/4] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <img src={`https://images.unsplash.com/photo-${item === 1 ? '1607522370955-61434390394d' : item === 2 ? '1550745165-9bc0b252726f' : '1593121925328-369cc802e8d0'}?auto=format&fit=crop&w=600&q=80`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">LIVE</div>
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Users size={12} /> 2.4k</div>

                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <div className="text-white/80 text-sm font-bold mb-1">{item === 1 ? 'Tech & Gadgets' : item === 2 ? 'Retro Gaming' : 'Modern Art'}</div>
                    <h3 className="text-white text-xl font-bold leading-tight mb-4">{item === 1 ? 'Unboxing the New Vision Pro' : item === 2 ? 'Rare N64 Consoles Auction' : 'Abstract Art Exhibition Sale'}</h3>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-primary-500 bg-slate-800"></div>
                      <span className="text-white font-medium text-sm">StreamerName</span>
                      <button className="ml-auto bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary-500">Watch</button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Drops Section (New) */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-full h-full">
          <div className="absolute top-20 right-20 w-80 h-80 bg-primary-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-secondary-400 text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles size={14} /> Exclusive Access
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Upcoming Drops</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Set your reminders. These limited edition items won't last long.</p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "CyberPunk 2077 Jacket", price: "Starts at $150", date: "Tomorrow, 2 PM EST", image: "https://images.unsplash.com/photo-1559582798-678dfc71ccd8?auto=format&fit=crop&w=600&q=80" },
              { title: "Vintage Leica M6", price: "Starts at $2,400", date: "Fri, 10 AM EST", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80" },
              { title: "Nike Dunk Low 'Panda'", price: "Starts at $80", date: "Sat, 12 PM EST", image: "https://images.unsplash.com/photo-1627915570889-4e785501d386?auto=format&fit=crop&w=600&q=80" }
            ].map((drop, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors group cursor-pointer h-full flex flex-col">
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                    <img src={drop.image} alt={drop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">Notify Me</button>
                    </div>
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                      <Timer size={12} /> {drop.date}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{drop.title}</h3>
                  <p className="text-primary-300 font-medium">{drop.price}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section (New) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">How WhatNew Works</h2>
            <p className="text-xl text-slate-600">The easiest way to buy and sell in the live economy.</p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-100 -z-10"></div>

            {[
              { step: "01", title: "Join a Stream", desc: "Browse thousands of live shows happening 24/7." },
              { step: "02", title: "Bid & Chat", desc: "Interact with sellers and place bids in real-time." },
              { step: "03", title: "Win & Pay", desc: "Secure checkout instantly when you win an auction." }
            ].map((item, i) => (
              <Reveal key={i} delay={i * 150} className="text-center bg-white">
                <div className="w-24 h-24 mx-auto bg-white rounded-full border-4 border-slate-50 flex items-center justify-center mb-6 shadow-xl relative z-10 text-primary-600 font-black text-3xl">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 max-w-xs mx-auto text-lg">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-6">Built for the <span className="text-primary-600">Creator Economy</span></h2>
            <p className="text-xl text-slate-500">Everything you need to buy, sell, and grow your community in one powerful platform.</p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Zap className="w-8 h-8 text-primary-500" />, title: "Instant Auctions", desc: "Create auctions in seconds. Automated bidding and payment processing." },
              { icon: <Shield className="w-8 h-8 text-primary-500" />, title: "Verified Trust", desc: "Every seller is vetted. Every item over $100 is authenticated by experts." },
              { icon: <Globe className="w-8 h-8 text-primary-500" />, title: "Global Shipping", desc: "We handle the logistics. Ship to buyers in over 50 countries seamlessly." },
              { icon: <Gift className="w-8 h-8 text-primary-500" />, title: "Drops & Rewards", desc: "Exclusive limited drops and loyalty rewards for power users." },
              { icon: <Smartphone className="w-8 h-8 text-primary-500" />, title: "Mobile First", desc: "Stream from anywhere. Optimized for low latency on 5G networks." },
              { icon: <TrendingUp className="w-8 h-8 text-primary-500" />, title: "Analytics", desc: "Deep insights into your sales, viewer engagement, and growth." }
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full group">
                  <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                    {React.cloneElement(feature.icon as React.ReactElement, { className: "w-8 h-8 group-hover:text-white transition-colors" })}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Community Voices (New) */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">Loved by the Community</h2>
              <p className="text-slate-600 text-lg">Don't just take our word for it.</p>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={24} className="text-yellow-400 fill-current" />)}
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Alex Chen", role: "Power Seller", quote: "WhatNew completely changed my business. I went from $1k to $50k/month just by streaming 2 hours a day." },
              { name: "Jessica Wu", role: "Sneakerhead", quote: "The community here is unmatched. I've made actual friends while bidding on sneakers. It's addictive!", active: true },
              { name: "David Miller", role: "Vintage Collector", quote: "Finally a platform that understands collectors. The authentication service gives me total peace of mind." }
            ].map((review, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className={`p-8 rounded-3xl h-full flex flex-col ${review.active ? 'bg-primary-600 text-white shadow-xl scale-105' : 'bg-white text-slate-600 shadow-sm border border-slate-100'}`}>
                  <div className="mb-6">
                    <MessageCircle size={32} className={review.active ? 'text-primary-300' : 'text-primary-100'} />
                  </div>
                  <p className={`text-lg font-medium leading-relaxed mb-8 flex-grow italic`}>"{review.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${review.active ? 'bg-white/20' : 'bg-slate-100'} flex items-center justify-center font-bold`}>{review.name[0]}</div>
                    <div>
                      <div className={`font-bold ${review.active ? 'text-white' : 'text-slate-900'}`}>{review.name}</div>
                      <div className={`text-xs uppercase tracking-wide font-bold ${review.active ? 'text-primary-200' : 'text-slate-400'}`}>{review.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Redesigned */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16">
              {/* Background Glows */}
              <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-900/40 rounded-full mix-blend-screen filter blur-[150px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-900/20 rounded-full mix-blend-screen filter blur-[150px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

              {/* Left Content */}
              <div className="flex-1 relative z-10 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-primary-300 text-sm font-bold mb-8 mx-auto lg:mx-0">
                  <Smartphone size={16} /> Mobile App Live
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                  Shop Anywhere.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Sell Everywhere.</span>
                </h2>
                <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0">
                  Get the full experience on iOS and Android. Instant notifications, faster bidding, and mobile-only exclusive drops waiting for you.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button className="bg-white text-slate-900 pl-4 pr-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center gap-3">
                    <div className="text-3xl"></div>
                    <div className="text-left">
                      <div className="text-[10px] uppercase font-bold text-slate-500 leading-none mb-1">Download on the</div>
                      <div className="leading-none">App Store</div>
                    </div>
                  </button>
                  <button className="bg-white/10 text-white border border-white/10 pl-4 pr-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors flex items-center gap-3">
                    <div className="text-3xl">▶</div>
                    <div className="text-left">
                      <div className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Get it on</div>
                      <div className="leading-none">Google Play</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Right Content - Visual */}
              <div className="flex-1 relative z-10 w-full max-w-md lg:max-w-none">
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="bg-white p-4 rounded-2xl shadow-inner shrink-0">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://whatnew.com/download" alt="Download QR" className="w-32 h-32 md:w-40 md:h-40 mix-blend-multiply" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-2xl font-bold text-white mb-2">Scan to Install</h3>
                      <p className="text-slate-400 text-sm mb-4">Point your camera at the QR code to verify and install the app securely.</p>
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-primary-400 text-xs font-bold uppercase tracking-wide">
                        <CheckCircle size={14} /> Verified Safe
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
};

export default Home;