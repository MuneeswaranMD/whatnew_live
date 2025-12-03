import React from 'react';
import { Bell, Wrench, BookOpen, Check } from 'lucide-react';
import Reveal from '../components/Reveal';

const Features: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Reveal>
            <h1 className="text-4xl font-extrabold text-slate-900">What We Offer</h1>
            <p className="mt-4 text-xl text-slate-600">Comprehensive resources for the modern digital user.</p>
          </Reveal>
        </div>

        <div className="space-y-20">
          
          {/* Feature 1 */}
          <Reveal>
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center gap-12 border border-slate-100 hover:shadow-lg transition-shadow duration-300">
              <div className="md:w-1/2 order-2 md:order-1">
                <div className="inline-block p-3 bg-red-100 text-red-600 rounded-2xl mb-6">
                  <Bell size={32} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Latest Updates</h2>
                <p className="text-lg text-slate-600 mb-6">
                  We cover trending topics, launches, and updates that shape the digital world. Stay in the loop with notifications on major tech shifts.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-slate-700"><Check className="text-green-500 mr-2" size={20}/> Product Launches</li>
                  <li className="flex items-center text-slate-700"><Check className="text-green-500 mr-2" size={20}/> Software Versions</li>
                  <li className="flex items-center text-slate-700"><Check className="text-green-500 mr-2" size={20}/> Tech Policy News</li>
                </ul>
              </div>
              <div className="md:w-1/2 order-1 md:order-2 h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-lg group">
                   <img 
                    src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80" 
                    alt="Latest News" 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                   />
              </div>
            </div>
          </Reveal>

          {/* Feature 2 */}
          <Reveal delay={200}>
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center gap-12 border border-slate-100 hover:shadow-lg transition-shadow duration-300">
               <div className="md:w-1/2 h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-lg group">
                   <img 
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80" 
                    alt="Useful Tools" 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                   />
              </div>
              <div className="md:w-1/2">
                <div className="inline-block p-3 bg-blue-100 text-blue-600 rounded-2xl mb-6">
                  <Wrench size={32} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Useful Tools</h2>
                <p className="text-lg text-slate-600 mb-6">
                  We recommend tools that help you optimize your workflow. Our curated lists ensure you are using the best software available.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="font-bold text-slate-800">Study Smarter</h4>
                      <p className="text-sm text-slate-500">Research & Note-taking apps</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="font-bold text-slate-800">Work Faster</h4>
                      <p className="text-sm text-slate-500">Automation & Productivity</p>
                  </div>
                   <div className="bg-slate-50 p-4 rounded-lg sm:col-span-2">
                      <h4 className="font-bold text-slate-800">Create Better</h4>
                      <p className="text-sm text-slate-500">Design & Editing Software</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Feature 3 */}
           <Reveal delay={400}>
             <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center gap-12 border border-slate-100 hover:shadow-lg transition-shadow duration-300">
              <div className="md:w-1/2 order-2 md:order-1">
                <div className="inline-block p-3 bg-green-100 text-green-600 rounded-2xl mb-6">
                  <BookOpen size={32} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Learning Content</h2>
                <p className="text-lg text-slate-600 mb-6">
                  Simple tutorials, guides, and explainers for all users. We break down complex topics into digestible articles.
                </p>
                <button className="text-primary-600 font-semibold hover:text-primary-700 flex items-center">
                    Browse Guides <span className="ml-2">&rarr;</span>
                </button>
              </div>
              <div className="md:w-1/2 order-1 md:order-2 h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-lg group">
                   <img 
                    src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80" 
                    alt="Learning" 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                   />
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </div>
  );
};

export default Features;