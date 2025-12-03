import React from 'react';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';
import { FaqItem } from '../types';
import Reveal from '../components/Reveal';

const faqs: FaqItem[] = [
  { question: "Is WhatNew free to use?", answer: "Yes, the platform is completely free for all users." },
  { question: "Do you collect personal data?", answer: "We only collect basic information for improvement and analytics. We do not sell your data." },
  { question: "Is the content updated regularly?", answer: "Yes. Updates are posted frequently to ensure you have the latest tech news." },
  { question: "Can I suggest a topic?", answer: "Yes, absolutely! Use our Contact page to send us your suggestions." },
  { question: "Is registration required?", answer: "No signup required to access our content." }
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