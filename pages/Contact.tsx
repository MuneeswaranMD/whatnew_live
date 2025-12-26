import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Smartphone, Monitor, User, Mail, FileText, HelpCircle, MoreVertical, Globe, Shield, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { contentService } from '../services/contentService';
import Reveal from '../components/Reveal';

const Contact: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [status, setStatus] = React.useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            topic: formData.get('topic'),
            message: formData.get('message'),
        };

        try {
            await contentService.create('enquiries', data);
            setStatus({ text: 'Message sent successfully! We will get back to you soon.', type: 'success' });
            (e.target as HTMLFormElement).reset();
        } catch (err) {
            setStatus({ text: 'Failed to send message. Please try again.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Header */}
            <div className="bg-slate-900 text-white pt-24 pb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center text-sm text-primary-200 mb-4">
                                <Link to="/" className="hover:text-white transition-colors">WhatNew</Link>
                                <ChevronRight size={14} className="mx-2" />
                                <span>Help Center</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Contact Support</h1>
                            <p className="text-xl text-slate-300">
                                We're here to help with your orders, account, and more.
                            </p>
                        </div>

                        {/* More Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 group"
                            >
                                <MoreVertical size={24} className="text-white group-hover:rotate-90 transition-transform duration-300" />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 mt-3 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden backdrop-blur-xl">
                                    <div className="p-2 space-y-1">
                                        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all text-left">
                                            <Globe size={18} />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">International Support</span>
                                                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Global regions</span>
                                            </div>
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all text-left">
                                            <Shield size={18} />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">Privacy Policy</span>
                                                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Data protection</span>
                                            </div>
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all text-left">
                                            <Info size={18} />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">System Status</span>
                                                <span className="text-[10px] text-slate-500 uppercase tracking-widest">Live updates</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
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

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {status && (
                                            <div className={`p-4 rounded-2xl flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                                {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                                <span className="font-bold text-sm">{status.text}</span>
                                            </div>
                                        )}
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700">First Name</label>
                                                <input type="text" name="firstName" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium" placeholder="Jane" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700">Last Name</label>
                                                <input type="text" name="lastName" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium" placeholder="Doe" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Email Address</label>
                                            <input type="email" name="email" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium" placeholder="jane@example.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Topic</label>
                                            <select name="topic" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium text-slate-600">
                                                <option>Order Status</option>
                                                <option>Returns & Refunds</option>
                                                <option>Account Issues</option>
                                                <option>Selling Support</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Message</label>
                                            <textarea name="message" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-32 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all font-medium resize-none" placeholder="How can we help you?"></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-600/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? 'Sending...' : (
                                                <>
                                                    <Mail size={18} />
                                                    Send Message
                                                </>
                                            )}
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
                        <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-lg border border-blue-100 p-6 sticky top-24">
                            <div className="flex items-center gap-3 mb-6">
                                <FileText size={24} className="text-blue-600" />
                                <h3 className="font-bold text-slate-900 uppercase text-sm tracking-wider">Helpful Resources</h3>
                            </div>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/notification-settings" className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-blue-50 hover:border-blue-200 transition-all group">
                                        <span className="text-slate-700 group-hover:text-blue-600 font-medium text-sm">Notification Settings</span>
                                        <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/update-credentials" className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-blue-50 hover:border-blue-200 transition-all group">
                                        <span className="text-slate-700 group-hover:text-blue-600 font-medium text-sm">Update Email/Password</span>
                                        <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/multiple-accounts" className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-blue-50 hover:border-blue-200 transition-all group">
                                        <span className="text-slate-700 group-hover:text-blue-600 font-medium text-sm">Multiple Accounts</span>
                                        <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/delete-account" className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-blue-50 hover:border-blue-200 transition-all group">
                                        <span className="text-slate-700 group-hover:text-blue-600 font-medium text-sm">Deleting Account</span>
                                        <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="flex items-center justify-between p-3 bg-primary-50 rounded-xl shadow-sm border border-primary-100">
                                        <span className="text-primary-600 font-bold text-sm">Contact Support</span>
                                        <ChevronRight size={16} className="text-primary-600" />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </Reveal>
                </div>

            </div>
        </div>
    );
};

export default Contact;