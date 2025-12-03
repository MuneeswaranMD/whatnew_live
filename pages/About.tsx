import React from 'react';
import { Target, Eye, Users, Zap } from 'lucide-react';
import Reveal from '../components/Reveal';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <div className="bg-slate-900 text-white pt-24 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
             <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=80" alt="Team" className="w-full h-full object-cover opacity-10" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-primary-300 text-sm font-medium mb-6">
               <Zap size={14} fill="currentColor" /> Our Story
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Who We Are</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              WhatNew is a digital knowledge platform created for people who want fast, clean, and reliable information.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <Reveal>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Simplifying Technology</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Our mission is to remove confusion from technology and deliver content that helps you grow in skills, productivity, and awareness.
              In a world overflowing with information, we act as a filter, bringing you only what matters.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Whether you are a developer looking for the latest libraries, a student researching AI, or just someone who wants to stay updated, WhatNew is built for you.
            </p>
            <div className="rounded-2xl overflow-hidden shadow-lg h-64">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="Team working" className="w-full h-full object-cover" />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-8">
             {/* Mission Card */}
            <Reveal delay={200}>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex gap-6 items-start hover:shadow-md transition-shadow duration-300">
                 <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 flex-shrink-0">
                    <Target size={28} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Our Mission</h3>
                    <p className="text-slate-600">
                      To provide quality digital content that is easy to read, quick to understand, and useful in real-life situations.
                    </p>
                 </div>
              </div>
            </Reveal>

            {/* Vision Card */}
            <Reveal delay={400}>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex gap-6 items-start hover:shadow-md transition-shadow duration-300">
                 <div className="bg-slate-100 p-4 rounded-2xl text-slate-600 flex-shrink-0">
                    <Eye size={28} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Our Vision</h3>
                    <p className="text-slate-600">
                      To become a trusted hub for digital learning and daily updates, empowering users worldwide.
                    </p>
                 </div>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;