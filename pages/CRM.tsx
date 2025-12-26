import React, { useState, useEffect, useRef } from 'react';
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
    ExternalLink,
    Menu,
    Type,
    Image as ImageIcon,
    User,
    Calendar,
    Clock,
    Tag,
    Award,
    Hash,
    Link as LinkIcon,
    Palette,
    Layers,
    Quote,
    ChevronDown,
    Star,
    Download,
    Inbox,
    Eye
} from 'lucide-react';
import { auth } from '../src/firebase';
import { signOut } from 'firebase/auth';
import Reveal from '../components/Reveal';
import { contentService, BlogPost, LiveStream, Drop, Testimonial } from '../services/contentService';
import { Link } from 'react-router-dom';

type TabType = 'blogs' | 'streams' | 'drops' | 'testimonials' | 'enquiries';

const CRM: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('blogs');
    const [isEditing, setIsEditing] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
    const [tempImageUrl, setTempImageUrl] = useState('');
    const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            if (scrollHeight - scrollTop - clientHeight < 50) {
                setHasScrolledToBottom(true);
            }
        }
    };

    useEffect(() => {
        if (isEditing) {
            setHasScrolledToBottom(false);
            setTempImageUrl(editingItem?.image || '');
            const timer = setTimeout(() => {
                if (scrollRef.current) {
                    const isScrollable = scrollRef.current.scrollHeight > scrollRef.current.clientHeight;
                    if (!isScrollable) setHasScrolledToBottom(true);
                }
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [isEditing, activeTab, editingItem]);

    const tabs = [
        { id: 'blogs', label: 'Blog Posts', icon: <FileText size={20} />, color: 'bg-blue-500' },
        { id: 'streams', label: 'Live Streams', icon: <Video size={20} />, color: 'bg-purple-500' },
        { id: 'drops', label: 'Upcoming Drops', icon: <ShoppingBag size={20} />, color: 'bg-orange-500' },
        { id: 'testimonials', label: 'Testimonials', icon: <MessageSquare size={20} />, color: 'bg-emerald-500' },
        { id: 'enquiries', label: 'Enquiries', icon: <Inbox size={20} />, color: 'bg-rose-500' },
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
                case 'enquiries': data = await contentService.getEnquiries(); break;
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

    const downloadExcel = () => {
        if (items.length === 0) return;

        const headers = ['First Name', 'Last Name', 'Email', 'Topic', 'Message', 'Status', 'Date'];
        const csvContent = [
            headers.join(','),
            ...items.map(item => [
                `"${item.firstName || ''}"`,
                `"${item.lastName || ''}"`,
                `"${item.email || ''}"`,
                `"${item.topic || ''}"`,
                `"${item.message?.replace(/"/g, '""') || ''}"`,
                `"${item.status || ''}"`,
                `"${new Date(item.createdAt).toLocaleDateString()}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `enquiries_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
        <div className="flex min-h-screen bg-slate-950 font-sans selection:bg-primary-500/30 overflow-x-hidden">
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                w-72 bg-slate-900/50 border-r border-white/5 backdrop-blur-2xl flex flex-col fixed lg:sticky top-0 h-screen z-50 transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
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
                                onClick={() => {
                                    setActiveTab(tab.id as TabType);
                                    setIsSidebarOpen(false);
                                }}
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
            <main className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
                {/* Top Header */}
                <header className="h-20 border-b border-white/5 bg-slate-900/20 backdrop-blur-md flex items-center justify-between px-4 lg:px-10 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 lg:hidden text-slate-400 hover:text-white transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="h-8 w-px bg-white/10 mx-2 hidden lg:block"></div>
                        <h2 className="text-base lg:text-lg font-bold text-white flex items-center gap-2">
                            Dashboard <span className="text-slate-500">/</span> <span className="text-primary-400 capitalized">{activeTab}</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Global Search..."
                                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-48 lg:w-64 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="relative text-slate-400 hover:text-white transition-colors md:hidden">
                            <Search size={20} />
                        </button>
                        <button className="relative text-slate-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-600 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-3 lg:pl-6 border-l border-white/10">
                            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center font-bold text-sm text-white flex-shrink-0">A</div>
                            <span className="text-sm font-bold text-white hidden sm:block">Admin</span>
                        </div>
                    </div>
                </header>

                <div className="p-4 lg:p-10 overflow-y-auto w-full overflow-x-hidden">
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
                        <div className="bg-slate-900/50 border border-white/5 rounded-2xl lg:rounded-[32px] overflow-hidden backdrop-blur-3xl shadow-2xl">
                            {/* Table Header */}
                            <div className="p-4 lg:p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02]">
                                <div>
                                    <h4 className="text-lg lg:text-xl font-bold text-white mb-1">Manage {activeTab}</h4>
                                    <p className="text-sm text-slate-500 font-medium">Create, update or remove items live.</p>
                                </div>
                                {activeTab !== 'enquiries' && (
                                    <button
                                        onClick={() => { setEditingItem(null); setIsEditing(true); }}
                                        className="px-4 lg:px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl lg:rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-600/20 active:scale-95"
                                    >
                                        <Plus size={20} /> Add Entry
                                    </button>
                                )}
                                {activeTab === 'enquiries' && (
                                    <button
                                        onClick={downloadExcel}
                                        className="px-4 lg:px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl lg:rounded-2xl font-black flex items-center justify-center gap-2 transition-all border border-white/10 active:scale-95"
                                    >
                                        <Download size={20} /> Export CSV
                                    </button>
                                )}
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
                                    <div className="overflow-x-auto rounded-2xl scrollbar-hide">
                                        <table className="w-full text-left min-w-[600px]">
                                            <thead>
                                                <tr className="border-b border-white/5 uppercase text-[10px] font-black text-slate-500 tracking-[0.2em]">
                                                    <th className="pb-6 px-4">
                                                        {activeTab === 'enquiries' ? 'Sender Details' : 'Content Details'}
                                                    </th>
                                                    <th className="pb-6 px-4">
                                                        {activeTab === 'enquiries' ? 'Topic' : 'Category'}
                                                    </th>
                                                    <th className="pb-6 px-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {items.filter(i =>
                                                    (i.title || i.name || i.firstName || i.lastName || '').toLowerCase().includes(searchQuery.toLowerCase())
                                                ).map((item) => (
                                                    <tr key={item._id} className="group hover:bg-white/[0.02] transition-colors">
                                                        <td className="py-4 lg:py-6 px-4">
                                                            <div className="flex items-center gap-3 lg:gap-4">
                                                                {activeTab !== 'enquiries' ? (
                                                                    <>
                                                                        <div className="relative flex-shrink-0">
                                                                            <img src={item.image} className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl object-cover border border-white/10 group-hover:border-primary-500/50 transition-colors" alt="" />
                                                                            {item.featured && <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center border-2 border-slate-900"><TrendingUp size={10} className="text-white" /></div>}
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <div className="font-bold text-white text-base lg:text-lg group-hover:text-primary-400 transition-colors truncate">{item.title || item.name}</div>
                                                                            <div className="text-slate-500 text-xs lg:text-sm font-medium line-clamp-1 max-w-[200px] lg:max-w-xs">{item.excerpt || item.role || item.streamer}</div>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 font-black text-lg uppercase flex-shrink-0">
                                                                            {item.firstName?.[0]}{item.lastName?.[0]}
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-bold text-white text-base group-hover:text-rose-400 transition-colors">{item.firstName} {item.lastName}</div>
                                                                            <div className="text-slate-500 text-xs font-medium">{item.email}</div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="py-6 px-4">
                                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border tracking-wider ${activeTab === 'enquiries' ? 'bg-rose-500/5 text-rose-400 border-rose-500/10' : 'bg-white/5 text-slate-400 border-white/5'}`}>
                                                                {item.topic || item.category || item.brand || 'Personal'}
                                                            </span>
                                                        </td>
                                                        <td className="py-6 px-4 text-right">
                                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                                {activeTab === 'enquiries' && (
                                                                    <button
                                                                        onClick={() => setSelectedEnquiry(item)}
                                                                        className="w-10 h-10 bg-white/5 hover:bg-rose-600 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all border border-white/10"
                                                                    >
                                                                        <Eye size={18} />
                                                                    </button>
                                                                )}
                                                                {activeTab !== 'enquiries' && (
                                                                    <button
                                                                        onClick={() => { setEditingItem(item); setIsEditing(true); }}
                                                                        className="w-10 h-10 bg-white/5 hover:bg-primary-600 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all border border-white/10"
                                                                    >
                                                                        <Edit3 size={18} />
                                                                    </button>
                                                                )}
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
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsEditing(false)}></div>
                    <Reveal animation="zoom-in" className="relative w-full max-w-2xl bg-slate-900/90 border border-white/10 rounded-[40px] shadow-[0_0_100px_-20px_rgba(37,99,235,0.3)] backdrop-blur-3xl overflow-hidden flex flex-col max-h-[92vh]">
                        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                            <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02] relative">
                                <div
                                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600 transition-all duration-1000 ease-out"
                                    style={{ width: hasScrolledToBottom ? '100%' : '0%' }}
                                />
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

                            <div
                                ref={scrollRef}
                                onScroll={handleScroll}
                                className="p-6 lg:p-10 overflow-y-auto space-y-12 flex-1 custom-scrollbar scroll-smooth bg-gradient-to-b from-transparent via-white/[0.01] to-transparent"
                            >
                                {/* Section 1: Core Identity */}
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center text-primary-500">
                                                <Layers size={18} />
                                            </div>
                                            <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Core Identity</h4>
                                        </div>
                                        <div className="px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Step 01 / View Identity</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                        <div className="lg:col-span-7 space-y-6">
                                            <div className="group relative">
                                                <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em] group-focus-within:text-primary-400 transition-colors">Item Title / Display Name</label>
                                                <div className="relative">
                                                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={20} />
                                                    <input
                                                        name={activeTab === 'blogs' || activeTab === 'streams' || activeTab === 'drops' ? 'title' : 'name'}
                                                        defaultValue={editingItem?.title || editingItem?.name}
                                                        placeholder="Enter a compelling name..."
                                                        className="w-full pl-12 pr-6 py-4 bg-white/[0.04] border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 focus:bg-white/[0.08] outline-none text-white font-bold transition-all hover:bg-white/[0.06]"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="group relative">
                                                <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em] group-focus-within:text-primary-400 transition-colors">Primary Visual Asset (URL)</label>
                                                <div className="relative">
                                                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={20} />
                                                    <input
                                                        name="image"
                                                        defaultValue={editingItem?.image}
                                                        onChange={(e) => setTempImageUrl(e.target.value)}
                                                        placeholder="https://images.unsplash.com/..."
                                                        className="w-full pl-12 pr-6 py-4 bg-white/[0.04] border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 focus:bg-white/[0.08] outline-none text-white font-bold transition-all hover:bg-white/[0.06]"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="lg:col-span-5 h-full">
                                            <div className="aspect-[4/3] lg:aspect-square rounded-3xl bg-white/[0.02] border border-dashed border-white/10 flex flex-col items-center justify-center p-2 relative group overflow-hidden shadow-inner">
                                                {tempImageUrl ? (
                                                    <img src={tempImageUrl} className="w-full h-full object-cover rounded-2xl border border-white/5 transition-transform duration-700 group-hover:scale-110" alt="Preview" />
                                                ) : (
                                                    <div className="text-center p-6">
                                                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-slate-600 mx-auto mb-4 border border-white/5">
                                                            <ImageIcon size={32} />
                                                        </div>
                                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Visual Preview</p>
                                                        <p className="text-[8px] font-medium text-slate-600 mt-1 uppercase tracking-widest">Awaiting valid source</p>
                                                    </div>
                                                )}
                                                <div className="absolute top-2 right-2 flex gap-1">
                                                    <div className="px-2 py-1 bg-slate-900/80 backdrop-blur-md rounded-lg border border-white/10 text-[8px] font-black text-white uppercase tracking-widest">
                                                        {activeTab.slice(0, -1)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Type Specific Metadata */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                        <Award className="text-secondary-500" size={18} />
                                        <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Contextual Details</h4>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                        {activeTab === 'blogs' && (
                                            <>
                                                <div className="md:col-span-2 group">
                                                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Short Summary</label>
                                                    <textarea name="excerpt" defaultValue={editingItem?.excerpt} placeholder="Describe the content in a few words..." className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white font-bold h-32 resize-none hover:bg-white/[0.05] transition-all" required />
                                                </div>
                                                <div className="group">
                                                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Author Name</label>
                                                    <div className="relative">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                        <input name="author.name" defaultValue={editingItem?.author?.name} placeholder="Name" className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white font-bold transition-all" />
                                                    </div>
                                                </div>
                                                <div className="group">
                                                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Author Title</label>
                                                    <div className="relative">
                                                        <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                        <input name="author.role" defaultValue={editingItem?.author?.role} placeholder="e.g. Senior Editor" className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white font-bold transition-all" />
                                                    </div>
                                                </div>
                                                <div className="group">
                                                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Topic Category</label>
                                                    <div className="relative">
                                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                        <input name="category" defaultValue={editingItem?.category} placeholder="Tech, Lifestyle..." className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white font-bold transition-all" />
                                                    </div>
                                                </div>
                                                <div className="group">
                                                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Read Time</label>
                                                    <div className="relative">
                                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                        <input name="readTime" defaultValue={editingItem?.readTime} placeholder="5 min" className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white font-bold transition-all" />
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2 group">
                                                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Metadata Tags</label>
                                                    <div className="relative">
                                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                        <input name="tags" defaultValue={editingItem?.tags?.join(', ')} placeholder="Comma-separated: fashion, design, live" className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white font-bold transition-all" />
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2 p-1 bg-white/[0.02] border border-white/5 rounded-3xl">
                                                    <label className="flex items-center gap-4 p-5 hover:bg-white/5 rounded-2xl cursor-pointer transition-all">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${editingItem?.featured ? 'bg-primary-600 border-primary-600' : 'border-white/10'}`}>
                                                            <Award className="text-white" size={20} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-black text-white">Promote to Featured</p>
                                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pin this to the top of the feed</p>
                                                        </div>
                                                        <input type="checkbox" name="featured" defaultChecked={editingItem?.featured} className="w-6 h-6 accent-primary-600 rounded-lg" />
                                                    </label>
                                                </div>
                                            </>
                                        )}

                                        {activeTab === 'streams' && (
                                            <>
                                                <div className="group">
                                                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Streamer Handle</label>
                                                    <div className="relative">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                        <input name="streamer" defaultValue={editingItem?.streamer} className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white font-bold transition-all" />
                                                    </div>
                                                </div>
                                                <div className="group">
                                                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Live Audience</label>
                                                    <div className="relative">
                                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                        <input name="viewers" defaultValue={editingItem?.viewers} className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white font-bold transition-all" />
                                                    </div>
                                                </div>
                                                <div className="group">
                                                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Genre</label>
                                                    <div className="relative">
                                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                        <input name="category" defaultValue={editingItem?.category} className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white font-bold transition-all" />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {activeTab === 'drops' && (
                                            <>
                                                <div className="group">
                                                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Official Brand</label>
                                                    <div className="relative">
                                                        <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                        <input name="brand" defaultValue={editingItem?.brand} className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white font-bold transition-all" />
                                                    </div>
                                                </div>
                                                <div className="group">
                                                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Drop Price</label>
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                        <input name="price" defaultValue={editingItem?.price} className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white font-bold transition-all" />
                                                    </div>
                                                </div>
                                                <div className="group">
                                                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Launch Date</label>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                        <input name="date" defaultValue={editingItem?.date} className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white font-bold transition-all" />
                                                    </div>
                                                </div>
                                                <div className="group">
                                                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Launch Time</label>
                                                    <div className="relative">
                                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                        <input name="time" defaultValue={editingItem?.time} className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white font-bold transition-all" />
                                                    </div>
                                                </div>
                                                <div className="group">
                                                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Spots Left</label>
                                                    <div className="relative">
                                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                        <input type="number" name="spots" defaultValue={editingItem?.spots} className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white font-bold transition-all" />
                                                    </div>
                                                </div>
                                                <div className="group">
                                                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Total Interest</label>
                                                    <div className="relative">
                                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                        <input type="number" name="interested" defaultValue={editingItem?.interested} className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white font-bold transition-all" />
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2 group">
                                                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Style Profile (Gradient CSS)</label>
                                                    <div className="relative">
                                                        <Palette className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                        <input name="gradient" defaultValue={editingItem?.gradient || 'from-primary-500 to-secondary-500'} className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white font-bold transition-all" />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {activeTab === 'testimonials' && (
                                            <>
                                                <div className="md:col-span-2 group">
                                                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">User Quote</label>
                                                    <div className="relative">
                                                        <Quote className="absolute left-4 top-6 text-slate-500" size={18} />
                                                        <textarea name="quote" defaultValue={editingItem?.quote} placeholder="What did they say?" className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white font-bold h-32 resize-none transition-all" />
                                                    </div>
                                                </div>
                                                <div className="group">
                                                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Role / Badge</label>
                                                    <div className="relative">
                                                        <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                        <input name="role" defaultValue={editingItem?.role} placeholder="Verified Collector" className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white font-bold transition-all" />
                                                    </div>
                                                </div>
                                                <div className="group">
                                                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Success Metric</label>
                                                    <div className="relative">
                                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={18} />
                                                        <input name="stats" defaultValue={editingItem?.stats} placeholder="124 Items Sold" className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary-500/50 outline-none text-white font-bold transition-all" />
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2 p-1 bg-white/[0.02] border border-white/5 rounded-3xl">
                                                    <label className="flex items-center gap-4 p-5 hover:bg-white/5 rounded-2xl cursor-pointer transition-all">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${editingItem?.featured ? 'bg-secondary-500 border-secondary-500' : 'border-white/10'}`}>
                                                            <Star className="text-white" size={20} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-black text-white">Trust Validation</p>
                                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mark as high-impact testimonial</p>
                                                        </div>
                                                        <input type="checkbox" name="featured" defaultChecked={editingItem?.featured} className="w-6 h-6 accent-secondary-500 rounded-lg" />
                                                    </label>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="h-20 lg:h-0"></div> {/* Bottom spacer for better scroll clearance */}
                            </div>

                            <div className="p-6 lg:p-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 backdrop-blur-3xl">
                                <div className="hidden sm:flex flex-1 items-center gap-3">
                                    {!hasScrolledToBottom ? (
                                        <div className="flex items-center gap-2 text-primary-400">
                                            <ChevronDown size={18} className="animate-bounce" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Scroll to unlock submission</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-emerald-400 animate-pulse">
                                            <CheckCircle2 size={18} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Identity Ready</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:bg-white/5 transition-all text-xs border border-white/5">
                                        Discard
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!hasScrolledToBottom}
                                        className={`px-10 py-3.5 rounded-2xl font-black text-white transition-all uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 
                                            ${hasScrolledToBottom
                                                ? 'bg-primary-600 hover:bg-primary-500 shadow-xl shadow-primary-600/20 active:scale-95 cursor-pointer opacity-100'
                                                : 'bg-slate-800/50 text-slate-600 cursor-not-allowed opacity-50'}`}
                                    >
                                        <Save size={16} /> {editingItem ? 'Publish Updates' : 'Publish Entry'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Reveal>
                </div>
            )}

            {/* View Enquiry Modal */}
            {selectedEnquiry && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelectedEnquiry(null)}></div>
                    <Reveal animation="zoom-in" className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[32px] shadow-2xl overflow-hidden p-8">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 text-xl font-black uppercase">
                                    {selectedEnquiry.firstName[0]}{selectedEnquiry.lastName[0]}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{selectedEnquiry.firstName} {selectedEnquiry.lastName}</h3>
                                    <p className="text-slate-500 text-sm">{selectedEnquiry.email}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedEnquiry(null)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Subject / Topic</p>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-white font-bold">
                                    {selectedEnquiry.topic}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Message</p>
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-slate-300 font-medium leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto custom-scrollbar">
                                    {selectedEnquiry.message}
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest pt-4 border-t border-white/5">
                                <span>Received on</span>
                                <span className="text-slate-400">{new Date(selectedEnquiry.createdAt).toLocaleDateString()} at {new Date(selectedEnquiry.createdAt).toLocaleTimeString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedEnquiry(null)}
                            className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl transition-all border border-white/10 uppercase text-xs tracking-widest"
                        >
                            Close Entry
                        </button>
                    </Reveal>
                </div>
            )}
        </div>
    );
};

export default CRM;
