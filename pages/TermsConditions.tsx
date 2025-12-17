import React from 'react';
import { FileText, ArrowLeft, Shield, Users, CreditCard, AlertTriangle, Scale, Globe, Mail, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

const TermsConditions: React.FC = () => {
    const sections = [
        {
            id: 'acceptance',
            icon: <CheckCircle size={24} />,
            title: 'Acceptance of Terms',
            content: `By accessing or using the WhatNew platform, website, and mobile applications (collectively, the "Service"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our Service.

These Terms apply to all visitors, users, and others who access or use the Service. By using the Service, you represent that you are at least 18 years of age or have parental/guardian consent if you are a minor.`
        },
        {
            id: 'accounts',
            icon: <Users size={24} />,
            title: 'User Accounts',
            content: `When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.

You are responsible for safeguarding the password you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.

You may not use as a username the name of another person or entity that is not lawfully available for use, or a name or trademark that is subject to any rights of another person or entity without appropriate authorization.`
        },
        {
            id: 'purchases',
            icon: <CreditCard size={24} />,
            title: 'Purchases & Payments',
            content: `All purchases through our Service are subject to product availability. We reserve the right to limit the quantities of any products or services that we offer.

Prices for our products are subject to change without notice. We reserve the right to modify or discontinue the Service (or any part or content thereof) without notice at any time.

We accept various payment methods including credit cards, debit cards, UPI, and other digital payment options. All payments are processed securely through our payment partners. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Service.`
        },
        {
            id: 'sellers',
            icon: <Shield size={24} />,
            title: 'Seller Terms',
            content: `If you register as a seller on WhatNew, you agree to:

• Provide accurate product descriptions and images
• Fulfill orders in a timely manner
• Maintain adequate inventory for listed products
• Respond to customer inquiries within 24 hours
• Comply with all applicable laws and regulations
• Not sell counterfeit, illegal, or prohibited items

We reserve the right to suspend or terminate seller accounts that violate these terms or receive excessive negative feedback.`
        },
        {
            id: 'conduct',
            icon: <AlertTriangle size={24} />,
            title: 'Prohibited Conduct',
            content: `You agree not to use the Service:

• For any unlawful purpose or to solicit others to perform unlawful acts
• To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances
• To infringe upon or violate our intellectual property rights or the intellectual property rights of others
• To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate
• To submit false or misleading information
• To upload or transmit viruses or any other type of malicious code
• To interfere with or circumvent the security features of the Service
• To spam, phish, pharm, pretext, spider, crawl, or scrape`
        },
        {
            id: 'intellectual',
            icon: <Scale size={24} />,
            title: 'Intellectual Property',
            content: `The Service and its original content, features, and functionality are and will remain the exclusive property of WhatNew and its licensors. The Service is protected by copyright, trademark, and other laws of both India and foreign countries.

Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of WhatNew. Nothing in these Terms constitutes a transfer of any intellectual property rights from us to you.

You retain ownership of any content you submit, post, or display on or through the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute such content.`
        },
        {
            id: 'liability',
            icon: <FileText size={24} />,
            title: 'Limitation of Liability',
            content: `In no event shall WhatNew, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:

• Your access to or use of or inability to access or use the Service
• Any conduct or content of any third party on the Service
• Any content obtained from the Service
• Unauthorized access, use, or alteration of your transmissions or content

The limitations of this section shall apply to any theory of liability, whether based on warranty, contract, statute, tort, or otherwise.`
        },
        {
            id: 'governing',
            icon: <Globe size={24} />,
            title: 'Governing Law',
            content: `These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.

Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.

These Terms constitute the entire agreement between us regarding our Service and supersede and replace any prior agreements we might have had between us regarding the Service.`
        },
        {
            id: 'changes',
            icon: <Mail size={24} />,
            title: 'Changes to Terms',
            content: `We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.

By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.`
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white pt-24 pb-16 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px]"></div>
                </div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Reveal>
                        <Link to="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors">
                            <ArrowLeft size={18} /> Back to Home
                        </Link>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-4 bg-indigo-500/20 rounded-2xl">
                                <FileText size={32} className="text-indigo-400" />
                            </div>
                            <h1 className="text-4xl font-black">Terms & Conditions</h1>
                        </div>
                        <p className="text-xl text-slate-300">Please read these terms carefully before using our services.</p>
                        <p className="text-sm text-slate-400 mt-4">Last updated: December 17, 2025</p>
                    </Reveal>
                </div>
            </div>

            {/* Quick Navigation */}
            <div className="bg-white border-b border-slate-200 sticky top-16 z-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
                        <span className="text-sm text-slate-500 whitespace-nowrap">Jump to:</span>
                        {sections.slice(0, 5).map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors whitespace-nowrap"
                            >
                                {section.title}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Introduction */}
                <Reveal>
                    <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Welcome to WhatNew</h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            These Terms and Conditions ("Terms") govern your use of the WhatNew platform and services operated by WhatNew Technologies Pvt. Ltd. ("Company", "we", "us", or "our").
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            By accessing our website, mobile application, or any other linked pages, features, content, or application services offered by us, you acknowledge that you have read, understood, and agree to be bound by these Terms.
                        </p>
                    </div>
                </Reveal>

                {/* Sections */}
                <div className="space-y-8">
                    {sections.map((section, idx) => (
                        <Reveal key={section.id} delay={idx * 50}>
                            <div id={section.id} className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 scroll-mt-32">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
                                        {section.icon}
                                    </div>
                                    <div>
                                        <span className="text-sm font-bold text-primary-600 uppercase tracking-wide">Section {idx + 1}</span>
                                        <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
                                    </div>
                                </div>
                                <div className="text-slate-600 leading-relaxed whitespace-pre-line">
                                    {section.content}
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>

                {/* Contact Section */}
                <Reveal delay={500}>
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 mt-12 text-white">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Have Questions?</h3>
                                <p className="text-slate-300">
                                    If you have any questions about these Terms, please contact our legal team.
                                </p>
                            </div>
                            <Link
                                to="/contact"
                                className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition-colors flex items-center gap-2 whitespace-nowrap"
                            >
                                <Mail size={20} />
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </Reveal>

                {/* Agreement Notice */}
                <Reveal delay={600}>
                    <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6 mt-8 text-center">
                        <CheckCircle size={32} className="text-primary-600 mx-auto mb-4" />
                        <p className="text-primary-900 font-medium">
                            By using WhatNew, you acknowledge that you have read and understood these Terms and Conditions and agree to be bound by them.
                        </p>
                    </div>
                </Reveal>
            </div>
        </div>
    );
};

export default TermsConditions;
