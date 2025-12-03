import React from 'react';
import { ShieldCheck, Clock, AlertTriangle, FileText, ChevronRight, PackageX, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

const Returns: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
       {/* Hero Header */}
       <div className="bg-slate-900 text-white pt-24 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
             <div className="flex items-center text-sm text-primary-200 mb-4">
                <Link to="/" className="hover:text-white transition-colors">WhatNew</Link>
                <ChevronRight size={14} className="mx-2"/>
                <span>Policies</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">Buyer Protection</h1>
            <p className="text-slate-300">Shop with confidence. We've got you covered.</p>
          </Reveal>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20 -mt-10">
        
        <Reveal>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
               
               <div className="p-8">
                  
                  {/* Introduction */}
                  <div className="bg-primary-50 border border-primary-100 p-6 rounded-2xl mb-12 flex items-start gap-4">
                     <div className="bg-primary-600 p-2 rounded-xl text-white shadow-lg shadow-primary-600/20">
                         <ShieldCheck className="w-8 h-8" />
                     </div>
                     <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">We've got you covered</h3>
                        <p className="text-slate-700 leading-relaxed">
                           Our Buyer Protection Policy ensures you get exactly what you paid for. If something goes wrong, we're here to help.
                        </p>
                     </div>
                  </div>

                  {/* Section 1: Entitlement */}
                  <section className="mb-16">
                     <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                           <FileText size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Coverage Details</h2>
                     </div>
                     
                     <div className="grid gap-6 md:grid-cols-1">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-primary-100 transition-colors flex gap-4 items-start">
                           <div className="bg-slate-50 p-3 rounded-full text-slate-400">
                              <AlertTriangle size={24} />
                           </div>
                           <div>
                              <h3 className="font-bold text-slate-900 mb-2 text-lg">Incomplete or Incorrect</h3>
                              <p className="text-slate-600">One or more items are missing from your shipment or are different from what was ordered.</p>
                           </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-primary-100 transition-colors flex gap-4 items-start">
                           <div className="bg-slate-50 p-3 rounded-full text-slate-400">
                              <AlertCircle size={24} />
                           </div>
                           <div>
                              <h3 className="font-bold text-slate-900 mb-2 text-lg">Not as Described</h3>
                              <p className="text-slate-600">Items received are damaged, expired, defective, counterfeit, or do not match the condition description.</p>
                           </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-primary-100 transition-colors flex gap-4 items-start">
                           <div className="bg-slate-50 p-3 rounded-full text-slate-400">
                              <PackageX size={24} />
                           </div>
                           <div>
                              <h3 className="font-bold text-slate-900 mb-2 text-lg">Package Not Received</h3>
                              <p className="text-slate-600">Items are lost, delayed in transit, not shipped, or not received after being marked “delivered”.</p>
                           </div>
                        </div>
                     </div>
                  </section>

                  {/* Section 2: Timelines */}
                  <section>
                     <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                           <Clock size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Submission Deadlines</h2>
                     </div>

                     <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl">
                        <div className="mb-6 pb-6 border-b border-slate-700">
                            <h3 className="font-bold text-xl mb-2">Standard Policy</h3>
                            <p className="text-slate-300">Submit your request by the earlier of:</p>
                            <div className="flex gap-4 mt-4">
                                <span className="bg-primary-600 px-4 py-2 rounded-lg font-bold">30 Days from Purchase</span>
                                <span className="bg-slate-700 px-4 py-2 rounded-lg font-bold">14 Days from Delivery</span>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-primary-300">Category Exceptions</h3>
                            <div className="space-y-4">
                               <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                                  <span className="font-medium">Collectibles & Luxury</span>
                                  <span className="text-sm text-slate-400">7 Days from Delivery</span>
                               </div>
                               <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                                  <span className="font-medium">Live Plants</span>
                                  <span className="text-sm text-slate-400">2 Days from Delivery</span>
                               </div>
                            </div>
                        </div>
                     </div>
                  </section>

               </div>
            </div>
        </Reveal>

      </div>
    </div>
  );
};

export default Returns;