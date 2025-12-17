import React from 'react';
import { Trash2, AlertTriangle, Download, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

const DeleteAccount: React.FC = () => {
    const [confirmText, setConfirmText] = React.useState('');

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-red-900 text-white pt-24 pb-16 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/20 rounded-full blur-[100px]"></div>
                </div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Reveal>
                        <Link to="/contact" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors">
                            <ArrowLeft size={18} /> Back to Help Center
                        </Link>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-4 bg-red-500/20 rounded-2xl">
                                <Trash2 size={32} className="text-red-400" />
                            </div>
                            <h1 className="text-4xl font-black">Delete Account</h1>
                        </div>
                        <p className="text-xl text-slate-300">Permanently remove your WhatNew account and all associated data.</p>
                    </Reveal>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Warning Banner */}
                <Reveal>
                    <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 mb-8">
                        <div className="flex gap-4">
                            <AlertTriangle size={32} className="text-red-600 flex-shrink-0" />
                            <div>
                                <h2 className="text-2xl font-bold text-red-900 mb-3">This action is permanent</h2>
                                <p className="text-red-800 mb-4">
                                    Once you delete your account, there is no going back. Please be certain before proceeding.
                                </p>
                                <ul className="space-y-2 text-red-700">
                                    <li className="flex items-center gap-2"><XCircle size={16} /> All your data will be permanently deleted</li>
                                    <li className="flex items-center gap-2"><XCircle size={16} /> You will lose access to all purchase history</li>
                                    <li className="flex items-center gap-2"><XCircle size={16} /> Any pending orders will be cancelled</li>
                                    <li className="flex items-center gap-2"><XCircle size={16} /> Your username will become unavailable</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* Before You Go */}
                <Reveal delay={100}>
                    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Before You Go</h2>

                        <div className="space-y-6">
                            {/* Download Data */}
                            <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <Download size={24} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Download Your Data</h3>
                                        <p className="text-sm text-slate-500">Get a copy of all your account data before deletion</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
                                    Download
                                </button>
                            </div>

                            {/* Alternatives */}
                            <div>
                                <h3 className="font-bold text-slate-900 mb-4">Have you considered?</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Link to="/notification-settings" className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                        <h4 className="font-bold text-slate-900 mb-1">Turn off notifications</h4>
                                        <p className="text-sm text-slate-500">Stop receiving emails without deleting your account</p>
                                    </Link>
                                    <Link to="/contact" className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                        <h4 className="font-bold text-slate-900 mb-1">Contact Support</h4>
                                        <p className="text-sm text-slate-500">Let us know if there's an issue we can help with</p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* Confirm Deletion */}
                <Reveal delay={200}>
                    <div className="bg-white rounded-3xl shadow-lg border border-red-100 p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Confirm Account Deletion</h2>

                        <form className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-2">
                                    Type <span className="font-bold text-red-600">DELETE</span> to confirm
                                </label>
                                <input
                                    type="text"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    placeholder="Type DELETE here"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-2">Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-2">Reason for leaving (optional)</label>
                                <textarea
                                    rows={3}
                                    placeholder="Help us improve by telling us why you're leaving..."
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                                />
                            </div>

                            <div className="flex gap-4">
                                <Link to="/contact" className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors text-center">
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={confirmText !== 'DELETE'}
                                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Delete My Account
                                </button>
                            </div>
                        </form>
                    </div>
                </Reveal>
            </div>
        </div>
    );
};

export default DeleteAccount;
