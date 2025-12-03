import React from 'react';
import { Flame, TrendingUp, Globe, Award } from 'lucide-react';
import Reveal from '../components/Reveal';

const Trending: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <Reveal>
            <div className="inline-flex items-center justify-center p-3 bg-orange-100 text-orange-600 rounded-full mb-4">
               <Flame size={32} fill="currentColor" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">What’s Hot Right Now</h1>
            <p className="mt-2 text-xl text-slate-600">Stay updated with trending tools and viral topics.</p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           
           {/* Section 1: Buzz */}
           <Reveal>
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-full">
                <div className="flex items-center gap-3 mb-6">
                   <Globe className="text-blue-500" size={28} />
                   <h2 className="text-2xl font-bold text-slate-900">Today’s Digital Buzz</h2>
                </div>
                <ul className="space-y-4">
                   {[
                     { title: 'AI Innovation', desc: 'New generative models changing design workflows.' },
                     { title: 'New Apps', desc: 'The rise of decentralized social media platforms.' },
                     { title: 'Automation Tools', desc: 'No-code solutions for small businesses.' },
                     { title: 'Security Trends', desc: 'Passwordless authentication adoption.' }
                   ].map((item, i) => (
                      <li key={i} className="flex gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors">
                         <span className="text-2xl font-bold text-slate-200">0{i+1}</span>
                         <div>
                            <h3 className="font-bold text-slate-800">{item.title}</h3>
                            <p className="text-sm text-slate-600">{item.desc}</p>
                         </div>
                      </li>
                   ))}
                </ul>
             </div>
           </Reveal>

           {/* Section 2: Top Picks */}
           <Reveal delay={200}>
             <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 p-8 rounded-2xl shadow-lg text-white h-full">
                <div className="flex items-center gap-3 mb-6">
                   <Award className="text-yellow-400" size={28} />
                   <h2 className="text-2xl font-bold">Top Picks</h2>
                </div>
                <p className="mb-8 text-indigo-200">Hand-selected updates that users find most helpful this week.</p>
                
                <div className="space-y-6">
                   <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                         <span className="bg-yellow-400 text-indigo-900 text-xs font-bold px-2 py-1 rounded">EDITOR'S CHOICE</span>
                         <TrendingUp size={16} />
                      </div>
                      <h3 className="font-bold text-lg">The Best VS Code Extensions 2025</h3>
                      <p className="text-sm text-indigo-200 mt-1">A curated list for maximum productivity.</p>
                   </div>

                   <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                       <div className="flex justify-between items-start mb-2">
                         <span className="bg-green-400 text-green-900 text-xs font-bold px-2 py-1 rounded">POPULAR</span>
                         <TrendingUp size={16} />
                      </div>
                      <h3 className="font-bold text-lg">Python for Beginners</h3>
                      <p className="text-sm text-indigo-200 mt-1">Why it remains the #1 language to learn.</p>
                   </div>
                </div>
             </div>
           </Reveal>

        </div>
      </div>
    </div>
  );
};

export default Trending;