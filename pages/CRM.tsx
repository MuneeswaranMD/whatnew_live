import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    LayoutDashboard,
    FileText,
    Video,
    ShoppingBag,
    MessageSquare,
    Plus,
    Search,
    Edit3,
    Trash2,
    Save,
    X,
    CheckCircle2,
    AlertCircle,
    RefreshCcw,
    Database,
    LogOut,
    TrendingUp,
    Users,
    DollarSign,
    Settings,
    Bell,
    ExternalLink
} from 'lucide-react';
import { auth } from '../src/firebase';
import { signOut } from 'firebase/auth';
import Reveal from '../components/Reveal';
import { contentService, BlogPost, LiveStream, Drop, Testimonial } from '../services/contentService';
import { Link } from 'react-router-dom';

type TabType = 'blogs' | 'streams' | 'drops' | 'testimonials';

const CRM: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('blogs');
    const [isEditing, setIsEditing] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const tabs = [
        { id: 'blogs', label: 'Blog Posts', icon: <FileText size={20} />, color: 'bg-blue-500' },
        { id: 'streams', label: 'Live Streams', icon: <Video size={20} />, color: 'bg-purple-500' },
        { id: 'drops', label: 'Upcoming Drops', icon: <ShoppingBag size={20} />, color: 'bg-orange-500' },
        { id: 'testimonials', label: 'Testimonials', icon: <MessageSquare size={20} />, color: 'bg-emerald-500' },
    ];

    const stats = [
        { label: 'Total Views', value: '124.5k', icon: <TrendingUp size={20} />, trend: '+12%', color: 'from-blue-500 to-cyan-500' },
        { label: 'Active Streams', value: '18', icon: <Video size={20} />, trend: '+3', color: 'from-purple-500 to-pink-500' },
        { label: 'Total Sales', value: '₹4.2M', icon: <DollarSign size={20} />, trend: '+8%', color: 'from-orange-500 to-red-500' },
        { label: 'Cloud DB', value: 'Synced', icon: <Database size={20} />, trend: 'Stable', color: 'from-emerald-500 to-teal-500' },
    ];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            let data: any[] = [];
            switch (activeTab) {
                case 'blogs': data = await contentService.getBlogPosts(); break;
                case 'streams': data = await contentService.getTrendingStreams(); break;
                case 'drops': data = await contentService.getUpcomingDrops(); break;
                case 'testimonials': data = await contentService.getTestimonials(); break;
            }
            setItems(data);
        } catch (err) {
            console.error(err);
            setMessage({ text: 'Failed to load data', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const showMessage = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await contentService.delete(activeTab, id);
            showMessage('Deleted successfully', 'success');
            fetchData();
        } catch (err) {
            showMessage('Delete failed', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data: any = {};

        formData.forEach((value, key) => {
            if (key.includes('.')) {
                const [parent, child] = key.split('.');
                if (!data[parent]) data[parent] = {};
                data[parent][child] = value;
            } else {
                if (key === 'tags') {
                    data[key] = (value as string).split(',').map(t => t.trim());
                } else if (['views', 'likes', 'spots', 'interested'].includes(key)) {
                    data[key] = Number(value);
                } else if (key === 'featured') {
                    data[key] = value === 'on' || value === 'true';
                } else {
                    data[key] = value;
                }
            }
        });

        if (['blogs', 'testimonials'].includes(activeTab) && !data.featured) {
            data.featured = false;
        }

        try {
            if (editingItem) {
                await contentService.update(activeTab, editingItem._id, data);
                showMessage('Updated successfully', 'success');
            } else {
                await contentService.create(activeTab, data);
                showMessage('Created successfully', 'success');
            }
            setIsEditing(false);
            setEditingItem(null);
            fetchData();
        } catch (err) {
            showMessage('Operation failed', 'error');
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-950 font-sans selection:bg-primary-500/30">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-900/50 border-r border-white/5 backdrop-blur-2xl flex flex-col sticky top-0 h-screen z-40">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20">
                            <LayoutDashboard className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white leading-none">WhatNew</h1>
                            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.2em]">Command Center</span>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">Content Management</p>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all group ${activeTab === tab.id
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <span className={`transition-transform group-hover:scale-110`}>
                                    {tab.icon}
                                </span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-10 pt-10 border-t border-white/5 space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">System</p>
                        <Link to="/" className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                            <ExternalLink size={20} />
                            View Site
                        </Link>
                        <button
                            onClick={() => signOut(auth)}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-red-400 hover:bg-red-500/10 transition-all text-left"
                        >
                            <LogOut size={20} />
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="mt-auto p-6">
                    <div className="bg-gradient-to-br from-primary-600/20 to-secondary-600/20 rounded-2xl p-4 border border-white/10">
                        <p className="text-xs font-bold text-slate-300 mb-1">Status: Online</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <p className="text-[10px] text-slate-500 truncate">Connected to MongoDB Atlas</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="h-20 border-b border-white/5 bg-slate-900/20 backdrop-blur-md flex items-center justify-between px-10 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-px bg-white/10 mx-2"></div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            Dashboard <span className="text-slate-500">/</span> <span className="text-primary-400 capitalized">{activeTab}</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Global Search..."
                                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-64 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="relative text-slate-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-600 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center font-bold text-sm text-white">A</div>
                            <span className="text-sm font-bold text-white">Admin</span>
                        </div>
                    </div>
                </header>

                <div className="p-10 overflow-y-auto">
                    {/* Welcome Section */}
                    <Reveal animation="fade-right">
                        <div className="mb-10">
                            <h3 className="text-3xl font-black text-white mb-2">Welcome Back, Admin</h3>
                            <p className="text-slate-400">Here's what's happening with WhatNew today.</p>
                        </div>
                    </Reveal>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {stats.map((stat, i) => (
                            <Reveal key={i} delay={i * 100} animation="fade-up">
                                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all group overflow-hidden relative">
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity`}></div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-white/5 rounded-2xl text-primary-400 group-hover:text-white group-hover:bg-primary-600 transition-all">
                                            {stat.icon}
                                        </div>
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                            {stat.trend}
                                        </span>
                                    </div>
                                    <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    {/* Content Section */}
                    <Reveal animation="fade-up" delay={400}>
                        <div className="bg-slate-900/50 border border-white/5 rounded-[32px] overflow-hidden backdrop-blur-3xl shadow-2xl">
                            {/* Table Header */}
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-1">Manage {activeTab}</h4>
                                    <p className="text-sm text-slate-500 font-medium">Create, update or remove items from your platform live.</p>
                                </div>
                                <button
                                    onClick={() => { setEditingItem(null); setIsEditing(true); }}
                                    className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black flex items-center gap-2 transition-all shadow-lg shadow-primary-600/20 active:scale-95"
                                >
                                    <Plus size={20} /> Add New Entry
                                </button>
                            </div>

                            {/* Alert Messages */}
                            {message && (
                                <div className="mx-8 mt-6">
                                    <div className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                        <span className="font-bold text-sm tracking-wide">{message.text}</span>
                                    </div>
                                </div>
                            )}

                            {/* Body */}
                            <div className="p-8">
                                {isLoading ? (
                                    <div className="py-20 text-center">
                                        <RefreshCcw className="animate-spin text-primary-500 mx-auto mb-4" size={40} />
                                        <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Fetching Records...</p>
                                    </div>
                                ) : items.length === 0 ? (
                                    <div className="py-20 text-center">
                                        <div className="w-20 h-20 bg-primary-500/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary-500/10">
                                            <Database size={40} className="text-primary-500/50" />
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Empty Database</h3>
                                        <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">No records found in this category. Start adding content to see them here.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto rounded-2xi">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-white/5 uppercase text-[10px] font-black text-slate-500 tracking-[0.2em]">
                                                    <th className="pb-6 px-4">Item Identity</th>
                                                    <th className="pb-6 px-4">Classification</th>
                                                    <th className="pb-6 px-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {items.filter(i =>
                                                    (i.title || i.name || '').toLowerCase().includes(searchQuery.toLowerCase())
                                                ).map((item) => (
                                                    <tr key={item._id} className="group hover:bg-white/[0.02] transition-colors">
                                                        <td className="py-6 px-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="relative">
                                                                    <img src={item.image} className="w-14 h-14 rounded-2xl object-cover border border-white/10 group-hover:border-primary-500/50 transition-colors" alt="" />
                                                                    {item.featured && <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center border-2 border-slate-900"><TrendingUp size={10} className="text-white" /></div>}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-white text-lg group-hover:text-primary-400 transition-colors">{item.title || item.name}</div>
                                                                    <div className="text-slate-500 text-sm font-medium line-clamp-1 max-w-xs">{item.excerpt || item.role || item.streamer}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-6 px-4">
                                                            <span className="px-3 py-1.5 bg-white/5 rounded-xl text-[10px] font-black uppercase text-slate-400 border border-white/5 tracking-wider">
                                                                {item.category || item.brand || 'Personal'}
                                                            </span>
                                                        </td>
                                                        <td className="py-6 px-4 text-right">
                                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                                <button
                                                                    onClick={() => { setEditingItem(item); setIsEditing(true); }}
                                                                    className="w-10 h-10 bg-white/5 hover:bg-primary-600 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all border border-white/10"
                                                                >
                                                                    <Edit3 size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(item._id)}
                                                                    className="w-10 h-10 bg-white/5 hover:bg-red-600 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all border border-white/10"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </main>

            {/* Editor Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setIsEditing(false)}></div>
                    <Reveal animation="zoom-in" className="relative w-full max-w-3xl bg-slate-900 border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <form onSubmit={handleSubmit} className="flex flex-col h-full">
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary-600/10 rounded-2xl flex items-center justify-center text-primary-500">
                                        <Edit3 size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white">{editingItem ? 'Update' : 'Register New'} {activeTab.slice(0, -1)}</h3>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Live Database Interaction</p>
                                    </div>
                                </div>
                                <button type="button" onClick={() => setIsEditing(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-10 overflow-y-auto space-y-8 flex-1">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Item Title / User Name</label>
                                        <input
                                            name="title"
                                            defaultValue={editingItem?.title || editingItem?.name}
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold transition-all hover:bg-white/[0.07]"
                                            required
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Primary Image Asset URL</label>
                                        <input
                                            name="image"
                                            defaultValue={editingItem?.image}
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold transition-all hover:bg-white/[0.07]"
                                            required
                                        />
                                    </div>

                                    {activeTab === 'blogs' && (
                                        <>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Content Short Excerpt</label>
                                                <textarea name="excerpt" defaultValue={editingItem?.excerpt} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold h-32 resize-none" required />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Author Full Name</label>
                                                <input name="author.name" defaultValue={editingItem?.author?.name} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Author Image Asset</label>
                                                <input name="author.image" defaultValue={editingItem?.author?.image} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Author Professional Role</label>
                                                <input name="author.role" defaultValue={editingItem?.author?.role} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Primary Category</label>
                                                <input name="category" defaultValue={editingItem?.category} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Estimated Read Time</label>
                                                <input name="readTime" defaultValue={editingItem?.readTime} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold" />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Keywords (comma separated)</label>
                                                <input name="tags" defaultValue={editingItem?.tags?.join(', ')} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold" placeholder="E-commerce, Live, Tech" />
                                            </div>
                                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                                <input type="checkbox" name="featured" id="feat" defaultChecked={editingItem?.featured} className="w-6 h-6 accent-primary-600 rounded-lg" />
                                                <label htmlFor="feat" className="text-sm font-black text-slate-300 uppercase tracking-widest cursor-pointer">Promote as Featured Content</label>
                                            </div>
                                        </>
                                    )}

                                    {activeTab === 'streams' && (
                                        <>
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Streamer Handle</label>
                                                <input name="streamer" defaultValue={editingItem?.streamer} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Active Viewer Count</label>
                                                <input name="viewers" defaultValue={editingItem?.viewers} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Streaming Category</label>
                                                <input name="category" defaultValue={editingItem?.category} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold" />
                                            </div>
                                        </>
                                    )}

                                    {activeTab === 'drops' && (
                                        <>
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Brand Identity</label>
                                                <input name="brand" defaultValue={editingItem?.brand} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Promotional Price</label>
                                                <input name="price" defaultValue={editingItem?.price} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Original List Price</label>
                                                <input name="originalPrice" defaultValue={editingItem?.originalPrice} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Event Launch Date</label>
                                                <input name="date" defaultValue={editingItem?.date} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Scheduled Start Time</label>
                                                <input name="time" defaultValue={editingItem?.time} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Limited Availability (Spots)</label>
                                                <input type="number" name="spots" defaultValue={editingItem?.spots} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Wishlist / Interested Users</label>
                                                <input type="number" name="interested" defaultValue={editingItem?.interested} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Accent Color Gradient</label>
                                                <input name="gradient" defaultValue={editingItem?.gradient || 'from-primary-500 to-secondary-500'} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold" />
                                            </div>
                                        </>
                                    )}

                                    {activeTab === 'testimonials' && (
                                        <>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Public Testimonial / Quote</label>
                                                <textarea name="quote" defaultValue={editingItem?.quote} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold h-32 resize-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Professional Designation</label>
                                                <input name="role" defaultValue={editingItem?.role} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Metric / Success Stat</label>
                                                <input name="stats" defaultValue={editingItem?.stats} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Background Decoration</label>
                                                <input name="gradient" defaultValue={editingItem?.gradient || 'from-primary-500 to-secondary-500'} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none text-white font-bold" />
                                            </div>
                                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                                <input type="checkbox" name="featured" id="feat-test" defaultChecked={editingItem?.featured} className="w-6 h-6 accent-primary-600 rounded-lg" />
                                                <label htmlFor="feat-test" className="text-sm font-black text-slate-300 uppercase tracking-widest cursor-pointer">Promote as Key Testimonial</label>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="p-8 border-t border-white/5 flex justify-end gap-3 bg-white/[0.02]">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3.5 rounded-2xl font-black text-slate-400 hover:bg-white/5 transition-all transition-all uppercase text-[10px] tracking-widest border border-white/10">
                                    Discard Changes
                                </button>
                                <button type="submit" className="px-10 py-3.5 bg-primary-600 hover:bg-primary-500 rounded-2xl font-black text-white transition-all shadow-xl shadow-primary-600/20 active:scale-95 uppercase text-[10px] tracking-widest flex items-center gap-2">
                                    <Save size={16} /> {editingItem ? 'Publish Updates' : 'Publish to MongoDB'}
                                </button>
                            </div>
                        </form>
                    </Reveal>
                </div>
            )}
        </div>
    );
};

export default CRM;
