import React from 'react';
import { Users, Plus, Settings, Trash2, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

const MultipleAccounts: React.FC = () => {
    const accounts = [
        { name: 'Primary Account', email: 'user@example.com', type: 'Personal', isPrimary: true },
        { name: 'Business Store', email: 'business@example.com', type: 'Seller', isPrimary: false },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-green-900 text-white pt-24 pb-16 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/20 rounded-full blur-[100px]"></div>
                </div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Reveal>
                        <Link to="/contact" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors">
                            <ArrowLeft size={18} /> Back to Help Center
                        </Link>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-4 bg-green-500/20 rounded-2xl">
                                <Users size={32} className="text-green-400" />
                            </div>
                            <h1 className="text-4xl font-black">Multiple Accounts</h1>
                        </div>
                        <p className="text-xl text-slate-300">Manage and switch between your different WhatNew accounts.</p>
                    </Reveal>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Current Accounts */}
                <Reveal>
                    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">Your Accounts</h2>
                            <span className="text-sm text-slate-500">{accounts.length} of 3 accounts used</span>
                        </div>

                        <div className="space-y-4">
                            {accounts.map((account, idx) => (
                                <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${account.isPrimary ? 'bg-primary-600' : 'bg-slate-400'}`}>
                                            {account.name[0]}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-900">{account.name}</h3>
                                                {account.isPrimary && (
                                                    <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-medium">Primary</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500">{account.email}</p>
                                            <span className="text-xs text-slate-400">{account.type} Account</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors">
                                            <Settings size={18} />
                                        </button>
                                        {!account.isPrimary && (
                                            <button className="p-2 text-red-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add Account Button */}
                        <button className="mt-6 w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-medium hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all flex items-center justify-center gap-2">
                            <Plus size={20} /> Add Another Account
                        </button>
                    </div>
                </Reveal>

                {/* How It Works */}
                <Reveal delay={100}>
                    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">How Multiple Accounts Work</h2>

                        <div className="space-y-6">
                            {[
                                { title: 'Separate Profiles', desc: 'Each account has its own profile, purchase history, and saved items.' },
                                { title: 'Easy Switching', desc: 'Switch between accounts instantly from the profile menu.' },
                                { title: 'Unified Notifications', desc: 'Receive notifications for all linked accounts in one place.' },
                                { title: 'Account Types', desc: 'Personal accounts for buying, Seller accounts for running your store.' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <CheckCircle size={16} className="text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{item.title}</h3>
                                        <p className="text-slate-600">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Reveal>

                {/* Important Note */}
                <Reveal delay={200}>
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                        <div className="flex gap-4">
                            <AlertTriangle size={24} className="text-amber-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-amber-900 mb-2">Important Note</h3>
                                <p className="text-amber-800">
                                    You can have up to 3 accounts linked to the same email. Each account requires a unique username.
                                    Seller accounts may require additional verification.
                                </p>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </div>
    );
};

export default MultipleAccounts;
