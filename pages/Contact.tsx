import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Smartphone, Monitor, User, Mail, FileText, HelpCircle } from 'lucide-react';
import Reveal from '../components/Reveal';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
       {/* Hero Header */}
       <div className="bg-slate-900 text-white pt-24 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal>
             <div className="flex items-center text-sm text-primary-200 mb-4">
                <Link to="/" className="hover:text-white transition-colors">WhatNew</Link>
                <ChevronRight size={14} className="mx-2"/>
                <span>Help Center</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Contact Support</h1>
            <p className="text-xl text-slate-300">
              We're here to help with your orders, account, and more.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12 relative z-20 -mt-10">

        {/* Main Content */}
        <div className="lg:w-3/4">
            <Reveal>
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                    <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-2 text-primary-600 font-bold text-sm uppercase tracking-wider mb-2">
                           <HelpCircle size={16} /> Help Article
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">How to Contact WhatNew</h2>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span>Last updated: July 17, 2025</span>
                        </div>
                    </div>

                    <div className="p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Need More Help?</h2>
                        <p className="text-slate-600 mb-6 text-lg">If you didn’t find what you need in the Help Center, here’s how to get support from our team.</p>

                        <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">On this page</h3>
                            <ul className="space-y-3 text-slate-700 font-medium">
                                <li><a href="#buyers" className="hover:text-primary-600 flex items-center gap-3 transition-colors"><span className="w-2 h-2 rounded-full bg-primary-400"></span> Buyers: Get help with an order</a></li>
                                <li><a href="#sellers" className="hover:text-primary-600 flex items-center gap-3 transition-colors"><span className="w-2 h-2 rounded-full bg-primary-400"></span> Sellers: Get quick help or support</a></li>
                                <li><a href="#account" className="hover:text-primary-600 flex items-center gap-3 transition-colors"><span className="w-2 h-2 rounded-full bg-primary-400"></span> Account issues</a></li>
                            </ul>
                        </div>

                        {/* Buyers Section */}
                        <section id="buyers" className="mb-12">
                             <div className="flex items-center gap-3 mb-6">
                                <span className="bg-primary-100 text-primary-600 p-2 rounded-lg"><Smartphone size={24}/></span>
                                <h2 className="text-2xl font-bold text-slate-900">Buyers: Get help with an order</h2>
                             </div>
                             
                             <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Smartphone size={18} className="text-primary-500" /> In the App
                                    </h4>
                                    <ol className="space-y-3 text-slate-600 text-sm list-decimal list-inside marker:text-primary-500 marker:font-bold">
                                        <li>Tap <strong>Activity</strong> at the bottom.</li>
                                        <li>Go to <strong>Purchases</strong>.</li>
                                        <li>Tap the order.</li>
                                        <li>Choose <strong>Get help</strong>.</li>
                                    </ol>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Monitor size={18} className="text-primary-500" /> On Website
                                    </h4>
                                    <ol className="space-y-3 text-slate-600 text-sm list-decimal list-inside marker:text-primary-500 marker:font-bold">
                                        <li>Sign in to WhatNew.com.</li>
                                        <li>Click <strong>Activity</strong>  <strong>Purchases</strong>.</li>
                                        <li>Select order.</li>
                                        <li>Click <strong>Get help</strong>.</li>
                                    </ol>
                                </div>
                            </div>
                            <div className="bg-slate-900 text-slate-300 p-4 rounded-xl text-sm border border-slate-800">
                                <strong className="text-white">Tip:</strong> Sharing clear evidence helps resolve things more quickly.
                            </div>
                        </section>

                        {/* Sellers Section */}
                        <section id="sellers" className="mb-12">
                             <div className="flex items-center gap-3 mb-6">
                                <span className="bg-primary-100 text-primary-600 p-2 rounded-lg"><Monitor size={24}/></span>
                                <h2 className="text-2xl font-bold text-slate-900">Sellers: Get Support</h2>
                             </div>

                            <div className="space-y-6">
                                <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Option 1: Chat with WhatNew</h3>
                                    <p className="text-slate-600 mb-4 text-sm">24/7 messaging assistant.</p>
                                    <button className="text-primary-600 font-bold text-sm hover:underline">Launch Seller Hub &rarr;</button>
                                </div>

                                 <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Option 2: Order Help</h3>
                                    <p className="text-slate-600 text-sm">Via Seller Hub Orders menu.</p>
                                </div>
                            </div>
                        </section>

                        {/* Account Issues */}
                        <section id="account" className="mb-12">
                             <div className="flex items-center gap-3 mb-6">
                                <span className="bg-primary-100 text-primary-600 p-2 rounded-lg"><User size={24}/></span>
                                <h2 className="text-2xl font-bold text-slate-900">Account Issues</h2>
                             </div>
                             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <ol className="list-decimal list-inside space-y-2 text-slate-700 font-medium marker:text-primary-500">
                                    <li>Open the WhatNew app.</li>
                                    <li>Tap the <strong>Account</strong> icon.</li>
                                    <li>Scroll down and tap <strong>Contact Us</strong>.</li>
                                </ol>
                             </div>
                        </section>

                        {/* After Contact */}
                        <section id="after">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">What happens next?</h2>
                            <ul className="space-y-4">
                                 <li className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                                    <div className="bg-primary-50 p-2 rounded-lg text-primary-600"><Mail size={20}/></div>
                                    <div>
                                        <span className="block font-bold text-slate-900">Email Response</span>
                                        <span className="text-slate-600 text-sm">We usually reply within 48 hours.</span>
                                    </div>
                                 </li>
                                 <li className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                                    <div className="bg-primary-50 p-2 rounded-lg text-primary-600"><FileText size={20}/></div>
                                    <div>
                                        <span className="block font-bold text-slate-900">Ticket Number</span>
                                        <span className="text-slate-600 text-sm">Check your inbox for "WhatNew Support".</span>
                                    </div>
                                 </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </Reveal>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/4">
            <Reveal delay={200}>
                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 sticky top-24">
                    <h3 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider text-primary-600">Related Articles</h3>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><Link to="#" className="text-slate-600 hover:text-primary-600 transition-colors block py-1">Notification Settings</Link></li>
                        <li><Link to="#" className="text-slate-600 hover:text-primary-600 transition-colors block py-1">Update Email/Password</Link></li>
                        <li><Link to="#" className="text-slate-600 hover:text-primary-600 transition-colors block py-1">Multiple Accounts</Link></li>
                        <li><Link to="#" className="text-slate-600 hover:text-primary-600 transition-colors block py-1">Deleting Account</Link></li>
                        <li><span className="text-primary-600 block py-1 bg-primary-50 px-3 rounded-lg -mx-3">Contact Support</span></li>
                    </ul>
                </div>
            </Reveal>
        </div>

      </div>
    </div>
  );
};

export default Contact;