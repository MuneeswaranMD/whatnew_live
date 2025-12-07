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
                     <ChevronRight size={14} className="mx-2" />
                     <span>Policies</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-2">Buyer Protection</h1>
                  <p className="text-slate-300">Shop with confidence. We've got you covered.</p>
               </Reveal>
            </div>
         </div>

         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20 -mt-10">

            <Reveal>
               <div className="space-y-12">

                  {/* Hero Notification */}
                  <div className="bg-primary-50 border border-primary-100 p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2"></div>
                     <div className="bg-white p-4 rounded-2xl text-primary-600 shadow-xl shadow-primary-500/10 flex-shrink-0 relative z-10">
                        <ShieldCheck className="w-10 h-10" />
                     </div>
                     <div className="relative z-10 text-center md:text-left">
                        <h3 className="text-xl font-black text-slate-900 mb-2">We've got you covered</h3>
                        <p className="text-slate-600 leading-relaxed font-medium">
                           Our Buyer Protection Policy ensures you get exactly what you paid for. If something goes wrong, we're here to help.
                        </p>
                     </div>
                  </div>

                  {/* Coverage Grid */}
                  <section>
                     <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                           <FileText size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">What's Covered?</h2>
                     </div>

                     <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                           <div className="bg-orange-50 w-14 h-14 rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                              <AlertTriangle size={28} />
                           </div>
                           <h3 className="font-bold text-slate-900 mb-3 text-lg group-hover:text-orange-500 transition-colors">Incomplete Orders</h3>
                           <p className="text-slate-500 leading-relaxed text-sm">One or more items are missing from your shipment or are different from what was ordered.</p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                           <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
                              <AlertCircle size={28} />
                           </div>
                           <h3 className="font-bold text-slate-900 mb-3 text-lg group-hover:text-red-500 transition-colors">Not as Described</h3>
                           <p className="text-slate-500 leading-relaxed text-sm">Items received are damaged, expired, defective, counterfeit, or do not match the description.</p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                           <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                              <PackageX size={28} />
                           </div>
                           <h3 className="font-bold text-slate-900 mb-3 text-lg group-hover:text-blue-500 transition-colors">Item Not Received</h3>
                           <p className="text-slate-500 leading-relaxed text-sm">Items are lost in transit, never shipped, or not received after 2 days of delivery status.</p>
                        </div>
                     </div>
                  </section>

                  {/* Timeline Section */}
                  <section>
                     <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                           <Clock size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Deadlines</h2>
                     </div>

                     <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply blur-[100px] opacity-30"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-600 rounded-full mix-blend-multiply blur-[100px] opacity-30"></div>

                        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                           <div>
                              <h3 className="font-black text-3xl mb-4">Clock is Ticking.</h3>
                              <p className="text-slate-300 leading-relaxed mb-8">
                                 To ensure a swift resolution, please submit your return or refund request within the specified windows.
                              </p>
                              <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors">
                                 Start a Return <ChevronRight size={16} />
                              </Link>
                           </div>

                           <div className="space-y-4">
                              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex items-center justify-between group hover:bg-white/20 transition-colors">
                                 <div>
                                    <span className="block text-primary-300 font-bold text-xs uppercase tracking-wider mb-1">Standard Policy</span>
                                    <span className="font-bold text-lg">30 Days from Purchase</span>
                                 </div>
                                 <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                                    <Clock size={20} />
                                 </div>
                              </div>

                              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex items-center justify-between group hover:bg-white/20 transition-colors">
                                 <div>
                                    <span className="block text-rose-300 font-bold text-xs uppercase tracking-wider mb-1">Items Marked Delivered</span>
                                    <span className="font-bold text-lg">14 Days from Delivery</span>
                                 </div>
                                 <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-rose-500 transition-colors">
                                    <PackageX size={20} />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </section>

               </div>
            </Reveal>

         </div>
      </div>
   );
};

export default Returns;