import React from 'react';
import { Target, Eye, Users, Zap, Heart, Shield, Sparkles, Award, Calendar, MapPin, Linkedin, Twitter } from 'lucide-react';
import Reveal from '../components/Reveal';

const teamMembers = [
  { name: 'Rahul Verma', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', bio: 'Former tech lead at Amazon with 10+ years in e-commerce' },
  { name: 'Priya Nair', role: 'CTO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', bio: 'AI & ML expert, previously at Google Research' },
  { name: 'David Kim', role: 'Head of Product', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80', bio: 'Built products at Shopify and Instagram' },
  { name: 'Sarah Johnson', role: 'VP of Marketing', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80', bio: 'Brand strategist with Fortune 500 experience' },
];

const milestones = [
  { year: '2021', title: 'Founded', description: 'WhatNew was born from a vision to revolutionize live commerce' },
  { year: '2022', title: 'Seed Funding', description: 'Raised ₹5 Crore to build our platform' },
  { year: '2023', title: '100K Users', description: 'Reached our first 100,000 active users' },
  { year: '2024', title: 'Series A', description: 'Secured ₹25 Crore for expansion' },
  { year: '2025', title: '500+ Partners', description: 'Onboarded 500+ verified sellers and brands' },
];

const coreValues = [
  { icon: <Sparkles size={28} />, title: 'Innovation', description: 'We push boundaries and embrace new technologies to stay ahead.' },
  { icon: <Shield size={28} />, title: 'Trust', description: 'Every transaction is protected. Every seller is verified.' },
  { icon: <Heart size={28} />, title: 'Community', description: 'We build connections between buyers, sellers, and collectors.' },
  { icon: <Award size={28} />, title: 'Excellence', description: 'We strive for the highest quality in everything we do.' },
];

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

        {/* Core Values Section */}
        <div className="mt-24">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Core Values</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">The principles that guide everything we do</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <Reveal key={index} delay={index * 100}>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group h-full">
                  <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                  <p className="text-slate-500">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-24">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-sm font-bold mb-4">
                <Users size={14} /> Meet the Team
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">The People Behind WhatNew</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">Passionate individuals dedicated to transforming live commerce</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Reveal key={index} delay={index * 100}>
                <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group h-full">
                  <div className="h-48 overflow-hidden">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                    <p className="text-primary-600 font-medium text-sm mb-3">{member.role}</p>
                    <p className="text-slate-500 text-sm">{member.bio}</p>
                    <div className="flex gap-3 mt-4">
                      <button className="text-slate-400 hover:text-primary-600 transition-colors"><Linkedin size={18} /></button>
                      <button className="text-slate-400 hover:text-primary-600 transition-colors"><Twitter size={18} /></button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Milestones Timeline */}
        <div className="mt-24">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-bold mb-4">
                <Calendar size={14} /> Our Journey
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Key Milestones</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">From startup to industry leader</p>
            </div>
          </Reveal>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2"></div>

            <div className="space-y-8 md:space-y-0">
              {milestones.map((milestone, index) => (
                <Reveal key={index} delay={index * 100}>
                  <div className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all inline-block">
                        <span className="text-primary-600 font-black text-2xl">{milestone.year}</span>
                        <h3 className="text-xl font-bold text-slate-900 mt-2">{milestone.title}</h3>
                        <p className="text-slate-500 mt-1">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="hidden md:flex w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                    <div className="md:w-1/2"></div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;