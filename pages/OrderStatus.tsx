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
                <ChevronRight size={14} className="mx-2"/>
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
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
               
               <div className="p-8">
                  {/* TOC */}
                  <div className="bg-slate-50 p-6 rounded-2xl mb-12 border border-slate-100">
                     <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">On this page</h3>
                     <ul className="space-y-3 text-slate-700 font-medium text-sm">
                        <li><a href="#status" className="hover:text-primary-600 flex items-center gap-3 transition-colors"><span className="w-2 h-2 rounded-full bg-primary-400"></span> Check your order status</a></li>
                        <li><a href="#tracking" className="hover:text-primary-600 flex items-center gap-3 transition-colors"><span className="w-2 h-2 rounded-full bg-primary-400"></span> Track via shipping carrier</a></li>
                        <li><a href="#delayed" className="hover:text-primary-600 flex items-center gap-3 transition-colors"><span className="w-2 h-2 rounded-full bg-primary-400"></span> Delayed or missing orders</a></li>
                     </ul>
                  </div>

                  {/* Section 1 */}
                  <section id="status" className="mb-16">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                           <Search size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Check Order Status</h2>
                     </div>
                     <p className="text-slate-600 mb-8 text-lg">
                        Find out if your order is being prepared, shipped, or delivered.
                     </p>
                     
                     <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                           <div className="flex items-center gap-2 mb-4 font-bold text-slate-900">
                              <Smartphone size={20} className="text-primary-500" />
                              In the App
                           </div>
                           <ol className="space-y-2 text-slate-600 text-sm list-decimal list-inside marker:text-primary-500 marker:font-bold">
                              <li>Tap <strong>Activity</strong></li>
                              <li>Go to <strong>Purchases</strong></li>
                              <li>Select purchase</li>
                              <li>View status at top</li>
                           </ol>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                           <div className="flex items-center gap-2 mb-4 font-bold text-slate-900">
                              <Monitor size={20} className="text-primary-500" />
                              On Website
                           </div>
                           <ol className="space-y-2 text-slate-600 text-sm list-decimal list-inside marker:text-primary-500 marker:font-bold">
                              <li>Log in</li>
                              <li>Click <strong>Activity</strong></li>
                              <li>Go to <strong>Purchases</strong></li>
                              <li>View status at top</li>
                           </ol>
                        </div>
                     </div>
                     
                     <div className="flex items-start gap-4 bg-slate-900 p-5 rounded-xl text-slate-300 text-sm shadow-lg">
                        <Clock size={20} className="mt-0.5 flex-shrink-0 text-primary-400" />
                        <p>If your order hasn’t shipped yet, the seller may still be preparing it. We ask sellers to ship within <span className="text-white font-bold">2 business days</span>.</p>
                     </div>
                  </section>

                  {/* Section 2 */}
                  <section id="tracking" className="mb-16">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                           <Package size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Track via Carrier</h2>
                     </div>
                     
                     <div className="bg-blue-50 text-blue-900 p-4 rounded-xl mb-8 text-sm border border-blue-100 flex gap-3">
                        <AlertCircle size={20} className="flex-shrink-0" />
                        <p><strong>Tip:</strong> Tracking can take 24–48 hours to update after a label is created.</p>
                     </div>

                     <div className="grid md:grid-cols-2 gap-6 mb-6">
                         <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                           <div className="flex items-center gap-2 mb-4 font-bold text-slate-900">
                              <Smartphone size={20} className="text-primary-500" />
                              In the App
                           </div>
                           <ol className="space-y-2 text-slate-600 text-sm list-decimal list-inside marker:text-primary-500 marker:font-bold">
                              <li>Go to <strong>Purchases</strong></li>
                              <li>Select purchase</li>
                              <li>Tap <strong>Track your purchase</strong></li>
                           </ol>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                           <div className="flex items-center gap-2 mb-4 font-bold text-slate-900">
                              <Monitor size={20} className="text-primary-500" />
                              On Website
                           </div>
                           <ol className="space-y-2 text-slate-600 text-sm list-decimal list-inside marker:text-primary-500 marker:font-bold">
                              <li>Go to <strong>Purchases</strong></li>
                              <li>Select purchase</li>
                              <li>Click <strong>Track your purchase</strong></li>
                           </ol>
                        </div>
                     </div>
                  </section>

                  {/* Section 3 */}
                  <section id="delayed" className="mb-8">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                           <AlertCircle size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Delayed?</h2>
                     </div>
                     <p className="text-slate-600 mb-6">
                        You may be covered under our Buyer Protection Policy.
                     </p>
                     
                     <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                           <h3 className="font-bold text-slate-900 mb-1">Status: Not Shipped</h3>
                           <p className="text-slate-600 text-sm">Label not created after 1 week? Contact us.</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                           <h3 className="font-bold text-slate-900 mb-1">Status: Tracking Stuck</h3>
                           <p className="text-slate-600 text-sm">Carriers sometimes miss scans. It might still be moving.</p>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                           <h3 className="font-bold text-slate-900 mb-1">Status: Not Delivered</h3>
                           <p className="text-slate-600 text-sm">Contact support if it's been 2 weeks (domestic) or 1 month (international).</p>
                        </div>
                     </div>
                     
                     <div className="mt-8 text-center">
                        <Link to="/contact" className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg shadow-primary-600/20">
                           Contact Support
                        </Link>
                     </div>
                  </section>

               </div>
            </div>
        </Reveal>

      </div>
    </div>
  );
};

export default OrderStatus;