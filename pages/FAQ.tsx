import React from 'react';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';
import { FaqItem } from '../types';
import Reveal from '../components/Reveal';

const faqs: FaqItem[] = [
  { question: "Is WhatNew free to use?", answer: "Yes, the platform is completely free for all users. You can browse streams, bid on items, and make purchases without any subscription fees." },
  { question: "How do live auctions work?", answer: "Live auctions happen in real-time during streams. When a seller showcases an item, you can place bids using the bid button. The highest bidder when the timer ends wins the item. Payment is processed automatically through our secure checkout." },
  { question: "What payment methods are accepted?", answer: "We accept all major credit/debit cards, UPI, net banking, and popular digital wallets like PayTM, PhonePe, and Google Pay. International cards and PayPal are also supported for global users." },
  { question: "How do I become a verified seller?", answer: "To become a verified seller, apply through the 'Start Selling' section. You'll need to provide identity verification, link a bank account, and complete our seller training. Verification typically takes 2-3 business days." },
  { question: "Is there a mobile app available?", answer: "Yes! WhatNew is available on both iOS and Android. Download from the App Store or Google Play to enjoy real-time notifications, faster bidding, and exclusive mobile-only drops." },
  { question: "How do I track my order?", answer: "Go to 'My Orders' in your account dashboard. Each order has a tracking number with real-time updates. You'll also receive email and push notifications for shipping milestones." },
  { question: "Do you collect personal data?", answer: "We only collect information necessary to provide our services - like your name, email, and shipping address. We never sell your data. Read our Privacy Policy for complete details." },
  { question: "Is the content updated regularly?", answer: "Yes! New streams happen 24/7 with thousands of sellers going live daily. Our blog and guides are updated weekly with the latest tech news and selling tips." },
  { question: "Can I suggest a topic?", answer: "Absolutely! We love community input. Use our Contact page or the feedback button in the app to send suggestions for new features, categories, or content topics." },
  { question: "Is registration required?", answer: "You can browse streams without an account, but registration is required to bid, purchase, or interact with sellers. It's free and takes less than a minute!" }
];

const FAQ: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <div className="bg-slate-900 text-white pt-24 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-primary-300 text-sm font-medium mb-6">
              <HelpCircle size={14} fill="currentColor" /> Help Center
            </div>
            <h1 className="text-4xl font-black text-white mb-6">Frequently Asked Questions</h1>

            {/* Search Input */}
            <div className="relative max-w-lg mx-auto">
              <input
                type="text"
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white/20 transition-all backdrop-blur-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20 -mt-12">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Reveal key={index} delay={index * 50}>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                <details className="group">
                  <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-slate-900 hover:bg-slate-50 transition-colors select-none text-lg">
                    <span>{faq.question}</span>
                    <span className="transition-transform duration-300 group-open:rotate-180 bg-primary-50 text-primary-600 p-2 rounded-full">
                      <ChevronDown size={20} />
                    </span>
                  </summary>
                  <div className="text-slate-600 px-6 pb-6 pt-0 leading-relaxed border-t border-slate-50 mt-2 pt-4">
                    {faq.answer}
                  </div>
                </details>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;