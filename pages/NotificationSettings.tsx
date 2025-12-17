import React from 'react';
import { Bell, Mail, Smartphone, Moon, Volume2, Shield, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

const NotificationSettings: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white pt-24 pb-16 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"></div>
                </div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Reveal>
                        <Link to="/contact" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors">
                            <ArrowLeft size={18} /> Back to Help Center
                        </Link>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-4 bg-blue-500/20 rounded-2xl">
                                <Bell size={32} className="text-blue-400" />
                            </div>
                            <h1 className="text-4xl font-black">Notification Settings</h1>
                        </div>
                        <p className="text-xl text-slate-300">Customize how and when you receive updates from WhatNew.</p>
                    </Reveal>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 md:p-12">

                    {/* Email Notifications */}
                    <Reveal>
                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <Mail size={24} className="text-primary-600" />
                                <h2 className="text-2xl font-bold text-slate-900">Email Notifications</h2>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { title: 'Order Updates', desc: 'Get notified when your orders are shipped or delivered' },
                                    { title: 'Auction Alerts', desc: 'Receive alerts when you\'re outbid or win an auction' },
                                    { title: 'New Drops', desc: 'Be the first to know about exclusive drops from sellers you follow' },
                                    { title: 'Weekly Digest', desc: 'A summary of trending items and deals every week' },
                                    { title: 'Marketing Emails', desc: 'Special offers, promotions, and personalized recommendations' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                        <div>
                                            <h3 className="font-bold text-slate-900">{item.title}</h3>
                                            <p className="text-sm text-slate-500">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </Reveal>

                    {/* Push Notifications */}
                    <Reveal delay={100}>
                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <Smartphone size={24} className="text-primary-600" />
                                <h2 className="text-2xl font-bold text-slate-900">Push Notifications</h2>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { title: 'Live Stream Alerts', desc: 'Get notified when your favorite sellers go live' },
                                    { title: 'Chat Messages', desc: 'Receive push notifications for new messages' },
                                    { title: 'Price Drops', desc: 'Alerts when items in your wishlist drop in price' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                        <div>
                                            <h3 className="font-bold text-slate-900">{item.title}</h3>
                                            <p className="text-sm text-slate-500">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </Reveal>

                    {/* Quiet Hours */}
                    <Reveal delay={200}>
                        <section className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <Moon size={24} className="text-primary-600" />
                                <h2 className="text-2xl font-bold text-slate-900">Quiet Hours</h2>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-xl">
                                <p className="text-slate-600 mb-4">Set a time period when you don't want to receive push notifications.</p>
                                <div className="flex flex-wrap gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 block mb-2">From</label>
                                        <input type="time" defaultValue="22:00" className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 block mb-2">To</label>
                                        <input type="time" defaultValue="08:00" className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </Reveal>

                    {/* Save Button */}
                    <Reveal delay={300}>
                        <div className="flex justify-end gap-4">
                            <button className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                                Cancel
                            </button>
                            <button className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors">
                                Save Changes
                            </button>
                        </div>
                    </Reveal>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;
