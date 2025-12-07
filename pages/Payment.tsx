import React from 'react';
import { CreditCard, CheckCircle, HelpCircle, Smartphone, AlertCircle, ChevronRight, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

const Payment: React.FC = () => {
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
                     <span>Payments</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-2">Buy Now, Pay Later</h1>
                  <p className="text-slate-300">Flexible payment options for your purchases.</p>
               </Reveal>
            </div>
         </div>

         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20 -mt-10">

            <Reveal>
               <div className="space-y-12">

                  {/* Hero Cards Section */}
                  <div className="grid md:grid-cols-2 gap-8">
                     {/* Credit Card Visual */}
                     <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10 flex flex-col h-full justify-between min-h-[220px]">
                           <div className="flex justify-between items-start">
                              <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-mono">Secure Payment</div>
                              <CreditCard size={32} className="text-primary-400" />
                           </div>
                           <div>
                              <div className="flex gap-4 mb-6">
                                 <div className="w-12 h-8 bg-white/10 rounded-md"></div>
                                 <div className="w-12 h-8 bg-white/10 rounded-md"></div>
                                 <div className="w-12 h-8 bg-white/10 rounded-md"></div>
                              </div>
                              <div className="font-mono text-xl tracking-widest text-slate-400">**** **** **** 4242</div>
                           </div>
                        </div>
                     </div>

                     {/* Payment Methods Grid */}
                     <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                           <CheckCircle size={20} className="text-green-500" /> Accepted Methods
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-center font-bold text-slate-700 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700 transition-all cursor-pointer">
                              Credit Card
                           </div>
                           <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-center font-bold text-slate-700 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700 transition-all cursor-pointer">
                              PayPal
                           </div>
                           <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-center font-bold text-slate-700 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700 transition-all cursor-pointer">
                              Apple Pay
                           </div>
                           <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-center font-bold text-slate-700 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700 transition-all cursor-pointer">
                              Google Pay
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* BNPL Section */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 overflow-hidden relative">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2"></div>
                     <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                           <span className="bg-primary-100 text-primary-600 p-3 rounded-2xl"><DollarSign size={24} /></span>
                           <h2 className="text-3xl font-black text-slate-900">Buy Now, Pay Later.</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                           <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                              <h3 className="font-bold text-slate-900 text-lg mb-2">Klarna.</h3>
                              <p className="text-slate-500 text-sm mb-4">Split into 4 interest-free payments.</p>
                              <ul className="space-y-2 text-sm font-medium text-slate-700">
                                 <li className="flex items-center gap-2"><CheckCircle size={14} className="text-primary-500" /> No impact on credit score</li>
                                 <li className="flex items-center gap-2"><CheckCircle size={14} className="text-primary-500" /> Instant approval</li>
                              </ul>
                           </div>
                           <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                              <h3 className="font-bold text-slate-900 text-lg mb-2">Affirm.</h3>
                              <p className="text-slate-500 text-sm mb-4">Pay over time, on your terms.</p>
                              <ul className="space-y-2 text-sm font-medium text-slate-700">
                                 <li className="flex items-center gap-2"><CheckCircle size={14} className="text-primary-500" /> 3, 6, or 12 month plans</li>
                                 <li className="flex items-center gap-2"><CheckCircle size={14} className="text-primary-500" /> No hidden fees</li>
                              </ul>
                           </div>
                           <div className="flex flex-col justify-center">
                              <p className="text-slate-600 mb-6 text-lg">
                                 Select <span className="font-bold text-slate-900">Klarna</span> or <span className="font-bold text-slate-900">Affirm</span> at checkout to view your custom payment plan options.
                              </p>
                              <Link to="/home" className="text-primary-600 font-bold hover:underline flex items-center gap-2">Start Shopping <ChevronRight size={16} /></Link>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* FAQ */}
                  <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white">
                     <h2 className="text-2xl font-bold mb-8">Common Questions</h2>
                     <div className="grid md:grid-cols-2 gap-8">
                        <div>
                           <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><AlertCircle size={18} className="text-primary-400" /> Is my payment secure?</h4>
                           <p className="text-slate-400 leading-relaxed">Yes. We use industry-standard encryption and partner with Stripe for payment processing. We never store your full card details.</p>
                        </div>
                        <div>
                           <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><AlertCircle size={18} className="text-primary-400" /> Can I change payment methods?</h4>
                           <p className="text-slate-400 leading-relaxed">Once an order is placed, the payment method is locked. If you need to change it, you must cancel and re-order.</p>
                        </div>
                     </div>
                  </div>

               </div>
            </Reveal>

         </div>
      </div>
   );
};

export default Payment;