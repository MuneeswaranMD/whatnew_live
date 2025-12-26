import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/firebase';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import Reveal from '../components/Reveal';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/crm');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex relative overflow-hidden">
            {/* Left Side: Realistic Shopping Image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img
                    src="/login-bg.png"
                    alt="Luxury Shopping"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 to-slate-950/80"></div>
                <div className="relative z-10 flex flex-col justify-end p-20 w-full">
                    <Reveal animation="fade-right">
                        <div className="p-8 bg-white/5 backdrop-blur-md rounded-[40px] border border-white/10 max-w-lg shadow-2xl">
                            <h1 className="text-5xl font-black text-white mb-4 leading-tight">
                                Elevate <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">What's New</span>
                            </h1>
                            <p className="text-slate-300 text-lg font-medium">
                                Manage your global trends, live streams, and exclusive drops with precision and elegance.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 relative z-20">
                {/* Background Glows for Mobile */}
                <div className="lg:hidden absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary-500/10 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-md w-full mx-auto">
                    <Reveal animation="zoom-in">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-14 h-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
                                <Lock className="text-primary-500" size={28} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white tracking-tight leading-none">
                                    Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Portal</span>
                                </h2>
                                <p className="mt-2 text-sm text-slate-500 font-bold uppercase tracking-widest opacity-80">
                                    Secured Access Only
                                </p>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal animation="fade-up" delay={200}>
                        <div className="bg-white/5 backdrop-blur-3xl p-8 lg:p-10 shadow-2xl border border-white/10 rounded-[40px]">
                            <form className="space-y-8" onSubmit={handleLogin}>
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                        Corporate Email
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-primary-500 transition-colors">
                                            <Mail className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-13 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:bg-white/[0.08] transition-all"
                                            placeholder="admin@averqon.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                                        Access Key
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-primary-500 transition-colors">
                                            <Lock className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-13 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:bg-white/[0.08] transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <Reveal animation="bounce-in">
                                        <div className="text-rose-400 text-xs font-bold bg-rose-400/10 border border-rose-400/20 p-4 rounded-2xl text-center">
                                            {error}
                                        </div>
                                    </Reveal>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-5 px-6 border border-transparent rounded-2xl shadow-xl text-lg font-black text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin h-6 w-6" />
                                    ) : (
                                        <span className="flex items-center gap-3">
                                            Authorize Access <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </Reveal>

                    <div className="mt-12 text-center">
                        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
                            Proprietary System / Authorized Personnel Only
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
