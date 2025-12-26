import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Zap, Gift, Tag, Play, Mail, CheckCircle, Smartphone, QrCode, Globe, Users, TrendingUp, Shield, Star, Crown, Timer, Sparkles, MessageCircle, Activity, DollarSign, Award, Apple } from 'lucide-react';
import Reveal from '../components/Reveal';
import { contentService, LiveStream, Drop, Testimonial } from '../services/contentService';

// Animated Counter Hook
const useCountUp = (end: number, duration: number = 2000, startOnView: boolean = true) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [startOnView, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, hasStarted]);

  return { count, ref };
};

// Stat Card Component with Animated Counter
interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, prefix = '', suffix = '', label, gradient }) => {
  const { count, ref } = useCountUp(value, 2000);

  return (
    <div
      ref={ref}
      className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
    >
      {/* Background Gradient Glow */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${gradient} rounded-full blur-[60px] opacity-30 group-hover:opacity-50 transition-opacity`}></div>

      {/* Icon */}
      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white mb-6 shadow-lg`}>
        {icon}
      </div>

      {/* Counter Value */}
      <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
        {prefix}{count.toLocaleString()}{suffix}
      </div>

      {/* Label */}
      <div className="text-slate-400 font-medium uppercase tracking-wider text-sm">{label}</div>

      {/* Decorative Line */}
      <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${gradient} w-0 group-hover:w-full transition-all duration-500`}></div>
    </div>
  );
};

const Home: React.FC = () => {
  const [trendingStreams, setTrendingStreams] = useState<LiveStream[]>([]);
  const [upcomingDrops, setUpcomingDrops] = useState<Drop[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [streams, drops, reviews] = await Promise.all([
          contentService.getTrendingStreams(),
          contentService.getUpcomingDrops(),
          contentService.getTestimonials()
        ]);
        setTrendingStreams(streams);
        setUpcomingDrops(drops);
        setTestimonials(reviews);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-bold text-xl">Loading Experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 [perspective:2000px] overflow-x-hidden">

      {/* Hero Section - New Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/30 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse animation-delay-4000"></div>
          </div>
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAyIiBkPSJNMCAwaDYwdjYwSDB6Ii8+PHBhdGggZD0iTTYwIDBIMHY2MGg2MFYwek0xIDFoNTh2NThIMVYxeiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDMiLz48L2c+PC9zdmc+')] opacity-40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">

          {/* Centered Text Content */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <Reveal animation="blur-in" duration={1200}>
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-xl border border-white/10 mb-8">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-white/80 text-sm font-medium">15,000+ Live Now</span>
                <span className="text-white/40">•</span>
                <span className="text-white text-sm font-bold">Join the Action</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white mb-8 leading-[0.95] tracking-tight">
                Live Shopping
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-pink-400 to-secondary-400 animate-gradient-x">
                  Reimagined
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl sm:text-2xl text-slate-300/90 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                Watch. Bid. Win. Experience the thrill of live auctions and connect with sellers in real-time.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/blog" className="group relative px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_50px_-12px_rgba(255,255,255,0.4)]">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Explore Live Shows <Play size={20} fill="currentColor" />
                  </span>
                </Link>
                <Link to="/contact" className="px-8 py-4 bg-white/5 backdrop-blur-xl text-white border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-2">
                  <ShoppingBag size={20} /> Become a Seller
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm">
                  <Shield size={16} className="text-green-400" /> Buyer Protected
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm">
                  <CheckCircle size={16} className="text-blue-400" /> Verified Sellers
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm">
                  <Star size={16} className="text-yellow-400" /> 4.9★ Rated
                </div>
              </div>
            </Reveal>
          </div>

          {/* Floating Product Cards */}
          <Reveal delay={400} animation="slide-up-scale">
            <div className="relative max-w-5xl mx-auto">
              {/* Main Featured Stream Card */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-pink-500 to-secondary-500 rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative rounded-3xl overflow-hidden bg-slate-800/90 backdrop-blur-xl border border-white/10">
                  <div className="aspect-[21/9] relative">
                    <img
                      src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1920&q=80"
                      alt="Featured Live Stream"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>

                    {/* Live Badge */}
                    <div className="absolute top-6 left-6 flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full animate-pulse">
                        <span className="w-2 h-2 bg-white rounded-full"></span> LIVE
                      </div>
                      <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md text-white text-sm font-medium px-4 py-2 rounded-full">
                        <Users size={14} /> 24.5k watching
                      </div>
                    </div>

                    {/* Stream Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-end justify-between gap-8">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <img src="https://i.pravatar.cc/100?img=1" className="w-12 h-12 rounded-full border-2 border-primary-500" alt="Seller" />
                            <div>
                              <div className="text-white font-bold text-lg">FashionHouseOfficial</div>
                              <div className="text-primary-300 text-sm">Verified Seller • 125k followers</div>
                            </div>
                          </div>
                          <h3 className="text-white text-2xl font-bold mb-2">🔥 Designer Bags Mega Sale - Up to 70% Off!</h3>
                          <p className="text-slate-300">Limited inventory - First come, first served</p>
                        </div>
                        <button className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-primary-500/30 flex items-center gap-2">
                          Join Stream <ArrowRight size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Small Floating Cards */}
              <div className="absolute -left-4 lg:-left-20 top-1/2 -translate-y-1/2 hidden md:block animate-float">
                <div className="bg-white rounded-2xl p-4 shadow-2xl w-52">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <TrendingUp size={16} className="text-green-600" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase">Just Sold</span>
                  </div>
                  <div className="text-slate-900 font-bold">Nike Air Max 97</div>
                  <div className="text-primary-600 font-bold text-lg">₹8,500</div>
                </div>
              </div>

              <div className="absolute -right-4 lg:-right-16 top-10 hidden md:block animate-float animation-delay-2000">
                <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl p-4 shadow-2xl w-48 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} />
                    <span className="text-xs font-bold uppercase opacity-80">Deal of the Day</span>
                  </div>
                  <div className="font-bold">50% OFF</div>
                  <div className="text-sm opacity-80">On all electronics</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/40 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Stats Section - Redesigned */}
      {/* <section className="relative py-20 mb-10 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
       
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-5 mt-10 sm:px-6 lg:px-5 relative z-10">
         
          <Reveal className="text-center mb-16">
            <span className="text-primary-400 font-bold text-sm uppercase tracking-widest">Our Impact</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-2">Trusted by Millions</h2>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Reveal delay={100}>
              <StatCard
                icon={<Users size={28} />}
                value={250}
                suffix="K+"
                label="Active Users"
                gradient="from-blue-500 to-cyan-500"
              />
            </Reveal>

            <Reveal delay={200}>
              <StatCard
                icon={<Activity size={28} />}
                value={1200}
                suffix="+"
                label="Daily Streams"
                gradient="from-purple-500 to-pink-500"
              />
            </Reveal>
            <Reveal delay={300}>
              <StatCard
                icon={<DollarSign size={28} />}
                value={45}
                prefix="₹"
                suffix="M+"
                label="Total Sales"
                gradient="from-green-500 to-emerald-500"
              />
            </Reveal>

            
            <Reveal delay={400}>
              <StatCard
                icon={<Award size={28} />}
                value={500}
                suffix="+"
                label="Brand Partners"
                gradient="from-orange-500 to-yellow-500"
              />
            </Reveal>
          </div>
        </div>
      </section> */}

      {/* Trending Live Sections */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal animation="slide-up-scale" className="mb-12 flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-4">🔥 Hot Right Now</h2>
              <p className="text-slate-600 text-lg">The most popular live streams happening right now.</p>
            </div>
            <Link to="/trending" className="text-primary-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">View All <ArrowRight size={20} /></Link>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {trendingStreams.map((item, i) => (
              <Reveal key={i} delay={i * 150} animation="zoom-in">
                <div className="group rounded-3xl overflow-hidden relative aspect-[3/4] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">LIVE</div>
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Users size={12} /> {item.viewers}</div>

                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <div className="text-primary-300 text-sm font-bold mb-1">{item.category}</div>
                    <h3 className="text-white text-xl font-bold leading-tight mb-4">{item.title}</h3>

                    <div className="flex items-center gap-3">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-8 h-8 rounded-full border-2 border-primary-500" alt={item.streamer} />
                      <span className="text-white font-medium text-sm">{item.streamer}</span>
                      <button className="ml-auto bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary-500">Watch</button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Drops Section - Redesigned */}
      <section className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/20 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary-900/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <Reveal animation="fade-right" className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-white/10 text-white text-sm font-bold mb-4">
                <Sparkles size={16} className="text-yellow-400" />
                <span>Limited Edition</span>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-3">
                Upcoming <span className="text-warning-500 bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Drops</span>
              </h2>
              <p className="text-slate-400 text-lg">Exclusive releases. Set your reminders before they're gone.</p>
            </div>

          </Reveal>

          {/* Drops Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingDrops.map((drop, i) => (
              <Reveal key={i} delay={i * 150} animation="flip-in">
                <div className="group relative h-full">
                  {/* Gradient Border Glow */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${drop.gradient} rounded-3xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500`}></div>

                  {/* Card Content */}
                  <div className="relative bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden h-full flex flex-col">
                    {/* Image Section */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={drop.image}
                        alt={drop.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

                      {/* Date Badge */}
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl">
                        <div className="text-white font-black text-lg">{drop.date}</div>
                        <div className="text-slate-400 text-xs">{drop.time} IST</div>
                      </div>

                      {/* Interested Badge */}
                      <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                        <Users size={12} /> {(drop.interested || 0).toLocaleString()} interested
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="text-slate-400 text-sm font-medium mb-1">{drop.brand}</div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-300 transition-colors">{drop.title}</h3>

                      {/* Price */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${drop.gradient}`}>{drop.price}</span>
                        <span className="text-slate-500 line-through text-sm">{drop.originalPrice}</span>
                        <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded-full">-30%</span>
                      </div>

                      {/* Spots Remaining */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400">Only {drop.spots} spots left</span>
                          <span className="text-primary-400 font-bold">Hurry!</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${drop.gradient} rounded-full`} style={{ width: `${100 - (drop.spots / 100) * 100}%` }}></div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button className={`mt-auto w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r ${drop.gradient} hover:opacity-90 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg`}>
                        <Timer size={18} /> Set Reminder
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Bottom CTA */}
          <Reveal animation="bounce-in" delay={200} className="mt-12 text-center">
            <p className="text-slate-400 mb-4">Want early access to all drops?</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all hover:scale-105">
              <Crown size={20} className="text-yellow-500" /> Join VIP Waitlist
            </Link>
          </Reveal>
        </div>
      </section>

      {/* How It Works Section (New) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal animation="blur-in" className="text-center max-w-3xl mx-auto mb-16">
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
              <Reveal key={i} delay={i * 200} animation="bounce-in" className="text-center bg-white">
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

      {/* Features Grid - Redesigned */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-100 rounded-full blur-[100px] opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary-100 rounded-full blur-[100px] opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal animation="fade-down" className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary-600 font-bold text-sm uppercase tracking-widest">Platform Features</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 mb-6">
              Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">Succeed</span>
            </h2>
            <p className="text-xl text-slate-500">Powerful tools for buyers and sellers in the live commerce economy.</p>
          </Reveal>

          {/* Bento Grid Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Large Feature Card */}
            <Reveal animation="slide-up-scale" className="lg:col-span-2 lg:row-span-2">
              <div className="h-full bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <Zap className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Instant Auctions</h3>
                  <p className="text-white/80 text-lg mb-8 max-w-md">Create auctions in seconds with automated bidding, payment processing, and real-time notifications.</p>
                  <div className="flex flex-wrap gap-3">
                    {['Auto-bidding', 'Secure Payments', 'Live Analytics'].map((tag, i) => (
                      <span key={i} className="px-4 py-2 bg-white/10 rounded-full text-sm font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Regular Feature Cards */}
            {[
              { icon: <Shield className="w-7 h-7" />, title: "Verified Trust", desc: "Every seller vetted. Items over ₹100 authenticated.", gradient: "from-green-500 to-emerald-500", bg: "bg-green-50" },
              { icon: <Globe className="w-7 h-7" />, title: "Global Shipping", desc: "Ship to 50+ countries seamlessly.", gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-50" },
              { icon: <Gift className="w-7 h-7" />, title: "Drops & Rewards", desc: "Exclusive drops and loyalty perks.", gradient: "from-purple-500 to-pink-500", bg: "bg-purple-50" },
              { icon: <Smartphone className="w-7 h-7" />, title: "Mobile First", desc: "Stream anywhere on 5G networks.", gradient: "from-orange-500 to-red-500", bg: "bg-orange-50" },
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 120} animation="rotate-in">
                <div className={`h-full ${feature.bg} p-8 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border border-slate-100`}>
                  <div className={`bg-gradient-to-br ${feature.gradient} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Community Voices - Redesigned */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-600/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal animation="zoom-out" className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-300 text-sm font-bold mb-6">
              <Star size={16} className="text-yellow-400 fill-current" />
              Loved by the Community <span className="text-white">4.9/5 from 50,000+ reviews</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Loved by the Community</h2>
            <p className="text-xl text-slate-400">Real stories from real users who transformed their lives with WhatNew.</p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((review, i) => (
              <Reveal key={i} delay={i * 150} animation="fade-left">
                <div className={`relative h-full group ${review.featured ? 'md:-mt-4 md:mb-4' : ''}`}>
                  {/* Gradient Border for Featured */}
                  {review.featured && (
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 via-pink-500 to-secondary-500 rounded-3xl blur opacity-50"></div>
                  )}

                  <div className={`relative h-full p-8 rounded-3xl flex flex-col ${review.featured ? 'bg-slate-800' : 'bg-white/5'} backdrop-blur-xl border border-white/10`}>
                    {/* Quote Icon */}
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${review.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                      <MessageCircle size={24} className="text-white" />
                    </div>

                    {/* Quote */}
                    <p className="text-white/90 text-lg leading-relaxed mb-8 flex-grow">"{review.quote}"</p>

                    {/* Stats Badge */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${review.gradient} text-white text-sm font-bold mb-6 self-start`}>
                      <TrendingUp size={14} /> {review.stats}
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                      <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full border-2 border-white/20" />
                      <div>
                        <div className="text-white font-bold">{review.name}</div>
                        <div className="text-slate-400 text-sm">{review.role}</div>
                      </div>
                      <div className="ml-auto flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="text-yellow-400 fill-current" />)}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Live Shopping Marketplace Section */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal animation="blur-in" className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">The Live Shopping Marketplace</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">Shop, sell, and connect around the things you love.</p>
            <Link to="/blog" className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary-500 transition-all hover:scale-105 shadow-lg shadow-primary-600/30">
              Shop Now <ArrowRight size={20} />
            </Link>
          </Reveal>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {/* Join In the Fun */}
            <Reveal delay={100} animation="fade-right">
              <div className="group relative rounded-3xl overflow-hidden h-[450px] cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80"
                  alt="Live Shopping"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <span className="text-primary-400 text-sm font-bold uppercase tracking-wider mb-2">Live Shopping</span>
                  <h3 className="text-2xl font-bold text-white mb-3">Join In the Fun</h3>
                  <p className="text-slate-300 mb-6">Take part in fast-paced auctions, flash sales, live show giveaways, and more.</p>
                  <Link to="/blog" className="inline-flex items-center gap-2 text-white font-bold hover:text-primary-400 transition-colors">
                    Shop Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* We've Got It All */}
            <Reveal delay={200} animation="fade-up">
              <div className="group relative rounded-3xl overflow-hidden h-[450px] cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
                  alt="Categories"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <span className="text-secondary-400 text-sm font-bold uppercase tracking-wider mb-2">Explore Categories</span>
                  <h3 className="text-2xl font-bold text-white mb-3">We've Got It All</h3>
                  <p className="text-slate-300 mb-6">Explore 250+ categories including fashion, sports cards, sneakers, and more.</p>
                  <Link to="/categories" className="inline-flex items-center gap-2 text-white font-bold hover:text-secondary-400 transition-colors">
                    Shop Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Find Incredible Deals */}
            <Reveal delay={300} animation="zoom-in">
              <div className="group relative rounded-3xl overflow-hidden h-[450px] cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80"
                  alt="Deals"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <span className="text-yellow-400 text-sm font-bold uppercase tracking-wider mb-2">Deals</span>
                  <h3 className="text-2xl font-bold text-white mb-3">Find Incredible Deals</h3>
                  <p className="text-slate-300 mb-6">Discover deals on your favorite brands and specialty products.</p>
                  <Link to="/trending" className="inline-flex items-center gap-2 text-white font-bold hover:text-yellow-400 transition-colors">
                    Shop Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary-600/20 rounded-full mix-blend-screen filter blur-[150px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary-600/20 rounded-full mix-blend-screen filter blur-[150px] translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Reveal animation="slide-up-scale">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-primary-300 text-sm font-bold mb-6">
              <Mail size={16} className="text-white" /> <span className="text-white">Stay Connected</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Subscribe to Our Newsletter</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Stay updated with the latest offers and live shopping events.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white/20 transition-all"
              />
              <button className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-500 transition-all hover:scale-105 shadow-lg shadow-primary-600/30 whitespace-nowrap">
                Subscribe Now
              </button>
            </div>

            <p className="text-slate-500 text-sm mt-6">Join 50,000+ subscribers. No spam, unsubscribe anytime.</p>
          </Reveal>
        </div>
      </section>

      {/* Call to Action - Redesigned */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <Reveal animation="bounce-in">
            <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16">
              {/* Background Glows */}
              <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-900/40 rounded-full mix-blend-screen filter blur-[150px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-900/20 rounded-full mix-blend-screen filter blur-[150px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

              {/* Left Content */}
              <div className="flex-1 relative z-10 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600 text-primary-300 text-sm font-bold mb-8 mx-auto lg:mx-0">
                  <Smartphone size={16} className="text-white" /> <span className="text-white">Mobile App Live</span>
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
                    <Apple size={32} />
                    <div className="text-left">
                      <div className="text-[10px] uppercase font-bold text-slate-500 leading-none mb-1">Download on the</div>
                      <div className="leading-none">App Store</div>
                    </div>
                  </button>
                  <button className="bg-white/10 text-white border border-white/10 pl-4 pr-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors flex items-center gap-3">
                    <Play size={32} />
                    <div className="text-left">
                      <div className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Get it on</div>
                      <div className="leading-none">Google Play</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Right Content - Visual */}
              <div className="flex-1 relative z-10 w-full max-w-md lg:max-w-none flex justify-center lg:justify-end">
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transform transition-all duration-500 hover:bg-white/10 group">
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="bg-white p-4 rounded-2xl shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] shrink-0 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://whatnew.com/download"
                        alt="Download QR"
                        className="w-32 h-32 md:w-36 md:h-36 mix-blend-multiply"
                      />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-2xl font-bold text-white mb-2">Scan to Install</h3>
                      <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                        Point your camera at the QR code to verify and install the app securely.
                      </p>
                      <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wide bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-500/20">
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