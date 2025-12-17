import React from 'react';
import { CheckCircle, DollarSign, Link as LinkIcon, Share2, ChevronDown, Star, ArrowRight, TrendingUp, Users } from 'lucide-react';
import Reveal from '../components/Reveal';
import { Link } from 'react-router-dom';

const Affiliates: React.FC = () => {
  const steps = [
    {
      title: "1. Apply",
      description: "Apply directly via Impact.com. It takes just a few minutes to set up your account and get started.",
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      color: "bg-blue-500"
    },
    {
      title: "2. Create Links",
      description: "Generate unique referral links for any product, category, or search on WhatNew.",
      icon: <LinkIcon className="w-6 h-6 text-white" />,
      color: "bg-purple-500"
    },
    {
      title: "3. Share",
      description: "Share your links on social media, blogs, newsletters, or with your community.",
      icon: <Share2 className="w-6 h-6 text-white" />,
      color: "bg-pink-500"
    },
    {
      title: "4. Earn",
      description: "Earn a commission every time someone makes a qualifying purchase through your link.",
      icon: <DollarSign className="w-6 h-6 text-white" />,
      color: "bg-green-500"
    }
  ];

  const faqs = [
    { q: "Who Can Apply?", a: "Content creators, influencers, community leaders, website owners, and bloggers are all welcome to join the WhatNew Affiliate Program." },
    { q: "How long does the cookie last?", a: "We offer a 3-day cookie window. If a user clicks your link and purchases within 3 days, you earn a commission." },
    { q: "How are referrals tracked?", a: "We partner with Impact.com for reliable third-party tracking, reporting, and payments." },
    { q: "When do I get paid?", a: "Payments are processed monthly via Impact.com, provided you meet the minimum withdrawal threshold." },
    { q: "Is it global?", a: "Yes! You can join from anywhere, provided WhatNew operates and ships to your audience's region." },
    { q: "Is there a fee to join?", a: "No, the WhatNew Affiliate Program is completely free to join." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* Hero Section */}
      <div className="bg-slate-900 text-white pt-24 pb-32 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1920&q=80"
            alt="Affiliate Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>

        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-600/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-primary-300 text-sm font-medium mb-8">
              <Star size={14} fill="currentColor" /> Official Partner Program
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
              Partner with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-orange-400">WhatNew</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              Monetize your content. Earn by sharing the products you love from the world's most exciting live shopping marketplace.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-primary-600 text-white font-bold py-4 px-10 rounded-full hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-primary-600/25 flex items-center justify-center gap-2">
                Apply Now <ArrowRight size={20} />
              </button>
              <button className="bg-white/5 text-white border border-white/10 backdrop-blur-sm font-bold py-4 px-10 rounded-full hover:bg-white/10 transition-all">
                Login
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-slate-400 text-sm font-medium">
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Free to join</div>
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Reliable tracking</div>
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Monthly payouts</div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Why Join Section */}
      <section className="py-20 bg-white relative -mt-16 z-20 rounded-t-[3rem] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-2">Why Join?</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">Empower Your Community</h3>
          </Reveal>

          <div className="flex flex-col lg:flex-row gap-12 items-center mb-16">
            <Reveal className="lg:w-1/2">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80" alt="Community Connection" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <p className="text-white text-lg font-bold">"Partnering with WhatNew helped me monetize my hobby and connect with other collectors."</p>
                </div>
              </div>
            </Reveal>
            <div className="lg:w-1/2 grid gap-6">
              <Reveal delay={100} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:shadow-lg transition-all duration-300 flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 flex-shrink-0">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">High Conversion</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Our live shopping format drives higher engagement and conversion rates compared to traditional e-commerce.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={200} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:shadow-lg transition-all duration-300 flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 flex-shrink-0">
                  <DollarSign size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Competitive Rates</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Earn competitive commission rates on every qualifying purchase made through your unique links.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={300} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:shadow-lg transition-all duration-300 flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Growing Platform</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Join one of the fastest-growing marketplaces in North America and Europe. Be part of the movement.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-2">How It Works</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">Your Path to Partnership</h3>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Joining the WhatNew Affiliate Program is straightforward. Follow these simple steps to start earning.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <Reveal key={idx} delay={idx * 100} className="h-full">
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 h-full flex flex-col items-center text-center group hover:shadow-xl transition-all duration-300">
                  <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mb-6 text-white text-2xl font-bold shadow-md group-hover:scale-105 transition-transform`}>
                    {idx + 1}
                  </div>
                  <div className="mb-4">
                    {React.cloneElement(step.icon, { className: `w-8 h-8 ${step.color.replace('bg-', 'text-')}` })}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-base text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </Reveal>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Reveal key={index} delay={index * 50}>
                <div className="border border-slate-100 rounded-2xl bg-slate-50 overflow-hidden">
                  <details className="group">
                    <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-slate-800 hover:bg-slate-100 transition-colors select-none">
                      <span>{faq.q}</span>
                      <span className="transition-transform duration-300 group-open:rotate-180 bg-white p-1 rounded-full shadow-sm">
                        <ChevronDown size={20} className="text-slate-400" />
                      </span>
                    </summary>
                    <div className="text-slate-600 px-6 pb-6 pt-0 leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-slate-900 py-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute right-0 top-0 w-96 h-96 bg-primary-600 rounded-full filter blur-[100px]"></div>
          <div className="absolute left-0 bottom-0 w-96 h-96 bg-blue-600 rounded-full filter blur-[100px]"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to grow with WhatNew?</h2>
            <p className="text-slate-300 mb-10 text-lg max-w-2xl mx-auto">
              Join thousands of creators who are earning by sharing their favorite finds.
            </p>
            <button className="bg-primary-600 text-white font-bold py-4 px-12 rounded-full hover:bg-primary-500 transition-all transform hover:scale-105 shadow-xl hover:shadow-primary-600/30">
              Join the Program
            </button>
          </Reveal>
        </div>
      </section>

    </div>
  );
};

export default Affiliates;