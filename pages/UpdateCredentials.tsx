import React from 'react';
import { Mail, Lock, Eye, EyeOff, Shield, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

const UpdateCredentials: React.FC = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 text-white pt-24 pb-16 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"></div>
                </div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Reveal>
                        <Link to="/contact" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors">
                            <ArrowLeft size={18} /> Back to Help Center
                        </Link>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-4 bg-purple-500/20 rounded-2xl">
                                <Lock size={32} className="text-purple-400" />
                            </div>
                            <h1 className="text-4xl font-black">Update Email & Password</h1>
                        </div>
                        <p className="text-xl text-slate-300">Manage your account credentials and security settings.</p>
                    </Reveal>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-2 gap-8">

                    {/* Update Email */}
                    <Reveal>
                        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Mail size={24} className="text-primary-600" />
                                <h2 className="text-2xl font-bold text-slate-900">Change Email</h2>
                            </div>

                            <form className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-2">Current Email</label>
                                    <input
                                        type="email"
                                        value="user@example.com"
                                        disabled
                                        className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-2">New Email</label>
                                    <input
                                        type="email"
                                        placeholder="Enter new email address"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-2">Confirm Password</label>
                                    <input
                                        type="password"
                                        placeholder="Enter your password to confirm"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                <button className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors">
                                    Update Email
                                </button>
                            </form>
                        </div>
                    </Reveal>

                    {/* Update Password */}
                    <Reveal delay={100}>
                        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Lock size={24} className="text-primary-600" />
                                <h2 className="text-2xl font-bold text-slate-900">Change Password</h2>
                            </div>

                            <form className="space-y-6">
                                <div className="relative">
                                    <label className="text-sm font-medium text-slate-700 block mb-2">Current Password</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter current password"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-10 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                <div className="relative">
                                    <label className="text-sm font-medium text-slate-700 block mb-2">New Password</label>
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-4 top-10 text-slate-400 hover:text-slate-600"
                                    >
                                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        placeholder="Confirm new password"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                {/* Password Requirements */}
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-sm font-medium text-slate-700 mb-3">Password must contain:</p>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        {['At least 8 characters', 'One uppercase letter', 'One lowercase letter', 'One number', 'One special character'].map((req, idx) => (
                                            <li key={idx} className="flex items-center gap-2">
                                                <CheckCircle size={14} className="text-green-500" /> {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors">
                                    Update Password
                                </button>
                            </form>
                        </div>
                    </Reveal>
                </div>

                {/* Security Tips */}
                <Reveal delay={200}>
                    <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield size={24} className="text-blue-600" />
                            <h3 className="text-xl font-bold text-slate-900">Security Tips</h3>
                        </div>
                        <ul className="space-y-3 text-slate-600">
                            <li>• Use a unique password that you don't use for other accounts</li>
                            <li>• Enable two-factor authentication for extra security</li>
                            <li>• Never share your password with anyone, including WhatNew support</li>
                            <li>• Check your login activity regularly for suspicious access</li>
                        </ul>
                    </div>
                </Reveal>
            </div>
        </div>
    );
};

export default UpdateCredentials;
