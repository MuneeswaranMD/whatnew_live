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
            <div className="prose prose-slate max-w-none mb-12">
              <p className="text-xl text-slate-600 font-medium leading-relaxed">
                We respect your privacy. At WhatNew, we believe in transparency and security. Here is exactly how we handle your data in plain English.
              </p>
            </div>

            <div className="grid gap-6">

              {/* Section 1 */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-primary-100 transition-colors">
                <div className="flex gap-6 items-start">
                  <div className="bg-white p-4 rounded-2xl text-primary-600 shadow-sm flex-shrink-0">
                    <Lock size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl mb-3">Data Collection</h3>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      We do not sell personal information. We only collect basic data needed to improve your experience, such as:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-2 marker:text-primary-500">
                      <li>Account details (Name, Email) for login.</li>
                      <li>Shipping address for order fulfillment.</li>
                      <li>Transaction history for your records.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-primary-100 transition-colors">
                <div className="flex gap-6 items-start">
                  <div className="bg-white p-4 rounded-2xl text-primary-600 shadow-sm flex-shrink-0">
                    <Eye size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl mb-3">Cookies & Analytics</h3>
                    <p className="text-slate-600 leading-relaxed">
                      We use cookies solely to keep you logged in and understand which products are popular. All analytics data is anonymized. You can disable non-essential cookies in your browser settings.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-primary-100 transition-colors">
                <div className="flex gap-6 items-start">
                  <div className="bg-white p-4 rounded-2xl text-primary-600 shadow-sm flex-shrink-0">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl mb-3">Third-Party Services</h3>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      Our platform integrates with trusted partners to function. We share the minimum necessary data with:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700">Stripe (Payments)</div>
                      <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700">Shippo (Labels)</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 text-center text-sm text-slate-400">
              Last updated: January 2025. Check back periodically for updates.
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default Privacy;