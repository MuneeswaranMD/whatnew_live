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
                            <ChevronRight size={14} className="mx-2" />
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
                        <div className="space-y-8">

                            {/* Contact Form Card */}
                            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden relative group">
                                <div className="p-8 md:p-12">
                                    <div className="flex items-center gap-2 text-primary-600 font-bold text-sm uppercase tracking-wider mb-6">
                                        <Mail size={16} /> Send us a message
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-2">Get in Touch</h2>
                                    <p className="text-slate-500 mb-8 max-w-xl">
                                        Fill out the form below and our support team will get back to you within 24 hours.
                                    </p>

                                    <form className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700">First Name</label>
                                                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium" placeholder="Jane" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700">Last Name</label>
                                                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium" placeholder="Doe" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Email Address</label>
                                            <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium" placeholder="jane@example.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Topic</label>
                                            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium text-slate-600">
                                                <option>Order Status</option>
                                                <option>Returns & Refunds</option>
                                                <option>Account Issues</option>
                                                <option>Selling Support</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Message</label>
                                            <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-32 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium resize-none" placeholder="How can we help you?"></textarea>
                                        </div>
                                        <button type="button" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-600/20 transform active:scale-[0.98] transition-all">
                                            Send Message
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Quick Channels */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-3xl border border-indigo-100 shadow-sm hover:shadow-md transition-all group">
                                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-indigo-50 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <Monitor size={32} className="text-indigo-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Live Chat</h3>
                                    <p className="text-slate-500 text-sm mb-6">Connect with a support agent instantly. Available 24/7.</p>
                                    <button className="text-indigo-600 font-bold text-sm bg-white border border-indigo-100 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors">Start Chat</button>
                                </div>

                                <div className="bg-gradient-to-br from-rose-50 to-white p-8 rounded-3xl border border-rose-100 shadow-sm hover:shadow-md transition-all group">
                                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-rose-50 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <Smartphone size={32} className="text-rose-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Phone Support</h3>
                                    <p className="text-slate-500 text-sm mb-6">Speak directly with our team. Mon-Fri, 9am - 6pm EST.</p>
                                    <button className="text-rose-500 font-bold text-sm bg-white border border-rose-100 px-4 py-2 rounded-lg hover:bg-rose-50 transition-colors">+1 (888) 555-0123</button>
                                </div>
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