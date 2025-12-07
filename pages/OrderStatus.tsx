import React from 'react';
import { Package, Search, AlertCircle, Clock, Smartphone, Monitor, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

const OrderStatus: React.FC = () => {
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
                     <span>General Help</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-2">Track Your Order</h1>
                  <p className="text-slate-300">Detailed guides on tracking via app or website.</p>
               </Reveal>
            </div>
         </div>

         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20 -mt-10">

            {/* Main Card */}
            <Reveal>
               {/* Order Lookup Form */}
               <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden mb-12 relative z-20">
                  <div className="p-8 md:p-12 text-center">
                     <h2 className="text-2xl font-black text-slate-900 mb-6">Track Your Package</h2>
                     <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
                        <input type="text" placeholder="Order Number (e.g. WN-83920)" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:border-primary-500 transition-colors" />
                        <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-primary-600/20 transition-all flex items-center justify-center gap-2">
                           <Search size={20} /> Track
                        </button>
                     </div>
                     <p className="text-slate-400 text-sm mt-4">
                        <Link to="/login" className="text-primary-600 font-bold hover:underline">Sign in</Link> to view all your orders.
                     </p>
                  </div>
                  <div className="bg-slate-50 border-t border-slate-100 p-8 md:p-12">
                     <div className="flex items-center gap-2 mb-6 text-sm font-bold text-slate-500 uppercase tracking-wider">
                        <AlertCircle size={16} /> Recent Search Example
                     </div>

                     {/* Dummy Order Progress */}
                     <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
                           <div>
                              <div className="text-xs font-bold text-slate-400 uppercase">Order #WN-8492</div>
                              <div className="text-xl font-black text-slate-900">Sony WH-1000XM5 Headphones</div>
                           </div>
                           <div className="text-right">
                              <div className="text-xs font-bold text-slate-400 uppercase">Est. Delivery</div>
                              <div className="text-xl font-bold text-green-600">Tomorrow by 8 PM</div>
                           </div>
                        </div>

                        <div className="relative">
                           <div className="absolute top-0 bottom-0 left-[19px] md:left-0 md:right-0 md:top-[19px] md:bottom-auto w-0.5 md:w-full md:h-0.5 bg-slate-100 -z-10"></div>
                           <div className="grid grid-rows-4 md:grid-rows-1 md:grid-cols-4 gap-8">

                              <div className="flex md:flex-col items-center gap-4 text-left md:text-center relative">
                                 <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white ring-4 ring-white">
                                    <Monitor size={16} />
                                 </div>
                                 <div>
                                    <div className="font-bold text-slate-900 text-sm">Order Placed</div>
                                    <div className="text-xs text-slate-500">Oct 24, 2:30 PM</div>
                                 </div>
                              </div>

                              <div className="flex md:flex-col items-center gap-4 text-left md:text-center relative">
                                 <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white ring-4 ring-white">
                                    <Package size={16} />
                                 </div>
                                 <div>
                                    <div className="font-bold text-slate-900 text-sm">Shipped</div>
                                    <div className="text-xs text-slate-500">Oct 25, 9:00 AM</div>
                                 </div>
                              </div>

                              <div className="flex md:flex-col items-center gap-4 text-left md:text-center relative">
                                 <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white ring-4 ring-white animate-pulse">
                                    <Smartphone size={16} />
                                 </div>
                                 <div>
                                    <div className="font-bold text-blue-600 text-sm">Out for Delivery</div>
                                    <div className="text-xs text-slate-500">Today, 7:45 AM</div>
                                 </div>
                              </div>

                              <div className="flex md:flex-col items-center gap-4 text-left md:text-center relative opacity-50 grayscale">
                                 <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 ring-4 ring-white">
                                    <Clock size={16} />
                                 </div>
                                 <div>
                                    <div className="font-bold text-slate-900 text-sm">Delivered</div>
                                    <div className="text-xs text-slate-500">Pending</div>
                                 </div>
                              </div>

                           </div>
                        </div>
                     </div>

                  </div>
               </div>

               {/* Help Guides Grid */}
               <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-primary-200 transition-colors group">
                     <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                        <AlertCircle size={24} />
                     </div>
                     <h3 className="font-bold text-slate-900 mb-2">Missing Package?</h3>
                     <p className="text-slate-500 text-sm mb-4">Check with neighbors or front desk. If not found in 48h, contact us.</p>
                     <Link to="/contact" className="text-indigo-600 text-sm font-bold hover:underline">Get Help &rarr;</Link>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-primary-200 transition-colors group">
                     <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-4 group-hover:scale-110 transition-transform">
                        <Clock size={24} />
                     </div>
                     <h3 className="font-bold text-slate-900 mb-2">Late Delivery?</h3>
                     <p className="text-slate-500 text-sm mb-4">Carriers are facing delays. Please allow 1-2 extra business days.</p>
                     <Link to="/contact" className="text-rose-500 text-sm font-bold hover:underline">Track Updates &rarr;</Link>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-primary-200 transition-colors group">
                     <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                        <Package size={24} />
                     </div>
                     <h3 className="font-bold text-slate-900 mb-2">Returns</h3>
                     <p className="text-slate-500 text-sm mb-4">Need to return an item? Start the process easily online.</p>
                     <Link to="/returns" className="text-emerald-600 text-sm font-bold hover:underline">Start Return &rarr;</Link>
                  </div>
               </div>

            </Reveal>

         </div>
      </div>
   );
};

export default OrderStatus;