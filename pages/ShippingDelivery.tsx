import React from 'react';
import { Truck, Scale, Box, MapPin, ChevronRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

const ShippingDelivery: React.FC = () => {
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
                <span>Shipping</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">US Shipping Guide</h1>
            <p className="text-slate-300">Everything you need to know about rates and delivery.</p>
          </Reveal>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20 -mt-10">

        <Reveal>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">

               <div className="p-8">
                  <p className="text-slate-600 mb-12 leading-relaxed text-lg font-medium border-l-4 border-primary-500 pl-6">
                    We understand shipping can be complicated. Here is a clear breakdown of how you will be charged for shipping on your WhatNew orders.
                  </p>

                  {/* Shipping Rates Overview */}
                  <section className="mb-16">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                           <Scale size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Shipping Rates</h2>
                     </div>

                     <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                           <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                              <Box size={20} className="text-slate-400"/> Under 1 lb
                           </h3>
                           <p className="text-slate-600 text-sm">USPS Ground Advantage Package Service rates.</p>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                           <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                              <Box size={20} className="text-slate-400"/> 1–5 lbs
                           </h3>
                           <p className="text-slate-600 text-sm">
                             <span className="font-bold text-slate-900">₹9.21</span> flat rate via USPS Priority Mail (continental US).
                           </p>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 md:col-span-2">
                           <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                              <Truck size={20} className="text-slate-400"/> Over 5 lbs
                           </h3>
                           <p className="text-slate-600 text-sm">
                             Shipped via USPS Priority Mail or Ground Advantage. Pricing starts at <span className="font-bold text-slate-900">₹8.91</span> based on weight/distance.
                           </p>
                        </div>
                     </div>
                  </section>

                  {/* Example */}
                  <section className="mb-16">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                           <MapPin size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Cost Example</h2>
                     </div>

                     <div className="bg-slate-900 text-slate-300 border border-slate-800 rounded-3xl p-8 shadow-xl">
                        <p className="text-white font-bold mb-6 text-lg border-b border-slate-700 pb-4">
                           Scenario: Buyer in LA buys from Boston (Zone 8)
                        </p>
                        <ul className="space-y-4 mb-6">
                           <li className="flex justify-between text-sm">
                              <span>1st Item (4 oz pack)</span>
                              <span className="text-white font-bold">₹4.13</span>
                           </li>
                           <li className="flex justify-between text-sm">
                              <span>2nd Item (4 oz pack)</span>
                              <span className="text-white font-bold">+ ₹0.31</span>
                           </li>
                           <li className="flex justify-between text-sm">
                              <span>3rd Item (Sneakers, 2 lbs)</span>
                              <span className="text-white font-bold">+ ₹3.91</span>
                           </li>
                           <li className="flex justify-between text-lg font-bold border-t border-slate-700 pt-4 text-white">
                              <span>Total Shipping</span>
                              <span className="text-primary-400">₹9.21</span>
                           </li>
                        </ul>
                        <div className="bg-white/10 p-4 rounded-xl text-xs text-slate-400 italic">
                           *WhatNew Smart Bundling™ automatically combines shipments to save you money until the label is printed.
                        </div>
                     </div>
                  </section>

                  {/* Nuances */}
                  <section>
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                           <Info size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Livestream Tips</h2>
                     </div>

                     <ul className="space-y-4">
                        <li className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                           <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                           <p className="text-slate-700 font-medium">Sellers can offer Free or Reduced Shipping.</p>
                        </li>
                        <li className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                           <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                           <p className="text-slate-700 font-medium">Smart Bundling™ works automatically.</p>
                        </li>
                        <li className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                           <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                           <p className="text-slate-700 font-medium">Oversized items charged by dimensional weight.</p>
                        </li>
                     </ul>
                  </section>

               </div>
            </div>
        </Reveal>

      </div>
    </div>
  );
};

export default ShippingDelivery;