import React, { useState, useEffect } from 'react';
import { Cookie, Bell, X, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import Reveal from './Reveal';

import { contentService } from '../services/contentService';

const ConsentBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [step, setStep] = useState<'cookies' | 'notifications'>('cookies');
    const [isAccepted, setIsAccepted] = useState(false);

    useEffect(() => {
        const hasConsent = localStorage.getItem('user-consent-v1');
        if (!hasConsent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptCookies = () => {
        setStep('notifications');
    };

    const handleAcceptNotifications = async () => {
        // Request browser notification permission
        let status = 'denied';
        if ('Notification' in window) {
            status = await Notification.requestPermission();
        }
        contentService.trackVisitor({
            path: window.location.pathname,
            notificationStatus: status
        });
        completeConsent();
    };

    const completeConsent = () => {
        setIsAccepted(true);
        localStorage.setItem('user-consent-v1', 'true');
        setTimeout(() => setIsVisible(false), 2000);
    };

    const handleDeclineAll = () => {
        localStorage.setItem('user-consent-v1', 'declined');
        contentService.trackVisitor({
            path: window.location.pathname,
            notificationStatus: 'denied'
        });
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 z-[200] flex justify-center pointer-events-none">
            <div className="pointer-events-auto max-w-2xl w-full">
                <Reveal animation="bounce-in">
                    <div className="bg-slate-900/90 backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 lg:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 rounded-full blur-3xl group-hover:bg-primary-600/20 transition-all"></div>

                        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                            {/* Icon Circle */}
                            <div className="flex-shrink-0 w-20 h-20 bg-white/5 rounded-[24px] border border-white/10 flex items-center justify-center relative">
                                {isAccepted ? (
                                    <CheckCircle2 className="text-emerald-400" size={36} />
                                ) : step === 'cookies' ? (
                                    <Cookie className="text-orange-400" size={36} />
                                ) : (
                                    <Bell className="text-primary-400 animate-bounce" size={36} />
                                )}
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                {isAccepted ? (
                                    <Reveal animation="fade-right">
                                        <h3 className="text-xl font-bold text-white mb-1">Preferences Saved!</h3>
                                        <p className="text-slate-400 text-sm font-medium">Thank you for helping us personalize your experience.</p>
                                    </Reveal>
                                ) : step === 'cookies' ? (
                                    <div className="animate-fade-in">
                                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                            <ShieldCheck size={16} className="text-primary-500" />
                                            <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em]">Privacy Shield</span>
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-2 leading-tight">We use cookies to improve your experience</h3>
                                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                            We'd like to collect cookies for analytics and site personalization. No personal data is ever sold.
                                            <button className="text-primary-400 hover:underline ml-1">Learn more</button>
                                        </p>
                                    </div>
                                ) : (
                                    <div className="animate-fade-in">
                                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                            <Bell size={16} className="text-primary-500" />
                                            <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em]">Real-time Updates</span>
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-2 leading-tight">Get Notified on New Drops!</h3>
                                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                            Enable notifications to get instant alerts for upcoming products, exclusive drops, and live streams.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {!isAccepted && (
                                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                    <button
                                        onClick={handleDeclineAll}
                                        className="px-6 py-4 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-bold rounded-2xl transition-all border border-white/5 order-2 sm:order-1"
                                    >
                                        Decline All
                                    </button>
                                    <button
                                        onClick={step === 'cookies' ? handleAcceptCookies : handleAcceptNotifications}
                                        className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-primary-600/20 active:scale-95 flex items-center justify-center gap-3 order-1 sm:order-2"
                                    >
                                        {step === 'cookies' ? (
                                            <>Accept & Continue <ArrowRight size={20} /></>
                                        ) : (
                                            <>Enable Notifications <Bell size={20} /></>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 h-1 bg-primary-600 transition-all duration-700" style={{ width: isAccepted ? '100%' : step === 'cookies' ? '50%' : '90%' }}></div>
                    </div>
                </Reveal>
            </div>
        </div>
    );
};

export default ConsentBanner;
