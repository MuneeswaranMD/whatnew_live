import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';
import Reveal from '../components/Reveal';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
       {/* Hero Header */}
       <div className="bg-slate-900 text-white pt-24 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Reveal>
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-primary-300 text-sm font-medium mb-6">
               <ShieldCheck size={14} fill="currentColor" /> Legal
            </div>
            <h1 className="text-4xl font-black text-white mb-6">Privacy Policy</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
               Transparency and security are at the core of our platform.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20 -mt-10">
        
        <Reveal>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
              <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                We respect your privacy. At WhatNew, we believe in transparency and security. Here is exactly how we handle your data.
              </p>

              <div className="space-y-8">
                
                <div className="flex gap-6 items-start">
                    <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 flex-shrink-0">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-xl mb-2">Data Collection</h3>
                        <p className="text-slate-600 leading-relaxed">
                             We do not sell personal information. We only collect basic data needed to improve your experience on our website, such as account preferences and transaction history.
                        </p>
                    </div>
                </div>

                <div className="w-full h-px bg-slate-100"></div>

                 <div className="flex gap-6 items-start">
                    <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 flex-shrink-0">
                        <Eye size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-xl mb-2">Cookies & Analytics</h3>
                        <p className="text-slate-600 leading-relaxed">
                            We use cookies to understand usage patterns. This data is anonymized and used solely to optimize website performance and content relevance.
                        </p>
                    </div>
                </div>

                <div className="w-full h-px bg-slate-100"></div>

                 <div className="flex gap-6 items-start">
                    <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 flex-shrink-0">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-xl mb-2">Third-Party Services</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Our platform integrates with trusted partners like Stripe, Klarna, and Impact.com. We encourage you to review their privacy policies for transaction-specific details.
                        </p>
                    </div>
                </div>

              </div>
              
              <div className="mt-12 bg-slate-50 p-6 rounded-2xl text-center text-sm text-slate-500">
                Last updated: January 2025. Check back periodically for updates.
              </div>
            </div>
        </Reveal>
      </div>
    </div>
  );
};

export default Privacy;