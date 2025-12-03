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
                <ChevronRight size={14} className="mx-2"/>
                <span>Payments</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">Buy Now, Pay Later</h1>
            <p className="text-slate-300">Flexible payment options for your purchases.</p>
          </Reveal>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20 -mt-10">
        
        <Reveal>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
               
               <div className="p-8">
                  
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-12 flex items-start gap-4 shadow-lg">
                    <div className="bg-primary-600 p-2 rounded-lg text-white mt-1"><HelpCircle size={20} /></div>
                    <div>
                        <p className="text-white font-bold text-lg">Need help with payment options?</p>
                        <p className="text-slate-400 mt-1">Try managing payment methods or fixing a payment error in your account settings.</p>
                    </div>
                  </div>

                  {/* Section 1: Availability */}
                  <section id="available" className="mb-16">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                           <CheckCircle size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Availability</h2>
                     </div>
                     
                     <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
                        <div className="flex gap-4 items-start">
                            <Smartphone className="text-primary-500 mt-1" size={20} />
                            <div>
                                <p className="text-slate-900 font-bold">WhatNew App</p>
                                <p className="text-slate-600 text-sm">Available on iOS or Android.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <CreditCard className="text-primary-500 mt-1" size={20} />
                            <div className="w-full">
                                <p className="text-slate-900 font-bold">Minimum Purchase</p>
                                <div className="grid sm:grid-cols-2 gap-4 mt-3">
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <span className="block font-black text-slate-900 text-lg">Klarna</span>
                                        <span className="text-sm text-slate-600">₹10 or more</span>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <span className="block font-black text-slate-900 text-lg">Affirm</span>
                                        <span className="text-sm text-slate-600">₹50 or more (US only)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                             <div className="w-5 h-5 flex items-center justify-center mt-1">
                                <span className="text-primary-500 font-black text-xs">IN</span>
                             </div>
                            <div className="w-full">
                                <p className="text-slate-900 font-bold">Supported Regions</p>
                                 <ul className="mt-2 text-sm text-slate-600 space-y-1">
                                    <li><strong className="text-slate-800">Klarna:</strong> US, UK, Canada, Europe</li>
                                    <li><strong className="text-slate-800">Affirm:</strong> US only</li>
                                 </ul>
                            </div>
                        </div>
                     </div>
                  </section>

                  {/* Section 2: How to use */}
                  <section id="how-to" className="mb-16">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                           <Smartphone size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">How to Use</h2>
                     </div>
                     
                     <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pl-8 py-2">
                        {[
                            "Tap Buy Now in App",
                            "Expand Payment section",
                            "Choose Klarna or Affirm",
                            "Tap Continue",
                            "Complete provider checkout",
                            "Confirm purchase"
                        ].map((step, idx) => (
                            <div key={idx} className="relative group">
                                <span className="absolute -left-[41px] top-0 flex items-center justify-center w-6 h-6 rounded-full bg-white border-2 border-slate-300 group-hover:border-primary-500 group-hover:bg-primary-50 group-hover:text-primary-600 text-xs font-bold text-slate-500 transition-colors">
                                    {idx + 1}
                                </span>
                                <p className="text-slate-800 font-medium">{step}</p>
                            </div>
                        ))}
                     </div>
                  </section>

                  {/* Section 3: Refunds */}
                  <section id="refunds" className="mb-16">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                           <DollarSign size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Refunds</h2>
                     </div>
                     <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-slate-600 leading-relaxed">
                            If your order qualifies under our <Link to="/returns" className="text-primary-600 font-bold hover:underline">Buyer Protection Policy</Link>, the provider will update your payment schedule or refund you automatically.
                        </p>
                     </div>
                  </section>
                  
                   {/* Section 4: FAQs */}
                  <section id="faqs" className="mb-8">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                           <HelpCircle size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Common Questions</h2>
                     </div>

                     <div className="grid gap-4">
                        {[
                            { q: "Why don’t I see BNPL options?", a: "Your purchase might be too small or in a restricted category." },
                            { q: "Will this affect my credit score?", a: "It depends on the plan. Check with Klarna or Affirm directly." },
                            { q: "Can I switch payment methods later?", a: "No, payment methods are locked once the order is placed." },
                        ].map((faq, idx) => (
                            <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                                <p className="text-slate-600 text-sm">{faq.a}</p>
                            </div>
                        ))}
                     </div>
                  </section>

               </div>
            </div>
        </Reveal>

      </div>
    </div>
  );
};

export default Payment;