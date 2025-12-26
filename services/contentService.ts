
export interface BlogPost {
    _id?: string;
    id?: number;
    title: string;
    excerpt: string;
    content?: string;
    author: {
        name: string;
        role: string;
        image: string;
    };
    category: string;
    tags: string[];
    date: string;
    readTime: string;
    image: string;
    views: number;
    likes: number;
    featured?: boolean;
}

export interface LiveStream {
    _id?: string;
    category: string;
    title: string;
    streamer: string;
    viewers: string;
    image: string;
}

export interface Drop {
    _id?: string;
    title: string;
    brand: string;
    price: string;
    originalPrice: string;
    date: string;
    time: string;
    spots: number;
    interested: number;
    image: string;
    gradient: string;
}

export interface Testimonial {
    _id?: string;
    name: string;
    role: string;
    image: string;
    quote: string;
    stats: string;
    gradient: string;
    featured?: boolean;
}

const API_BASE = '/api';

export const contentService = {
    getBlogPosts: async (): Promise<BlogPost[]> => {
        try {
            const res = await fetch(`${API_BASE}/blogs`);
            if (!res.ok) throw new Error('Fetch failed');
            return await res.json();
        } catch (error) {
            console.error('API Error:', error);
            return []; // Fallback to empty
        }
    },

    getTrendingStreams: async (): Promise<LiveStream[]> => {
        try {
            const res = await fetch(`${API_BASE}/streams`);
            if (!res.ok) throw new Error('Fetch failed');
            return await res.json();
        } catch (error) {
            console.error('API Error:', error);
            return [];
        }
    },

    getUpcomingDrops: async (): Promise<Drop[]> => {
        try {
            const res = await fetch(`${API_BASE}/drops`);
            if (!res.ok) throw new Error('Fetch failed');
            return await res.json();
        } catch (error) {
            console.error('API Error:', error);
            return [];
        }
    },

    getTestimonials: async (): Promise<Testimonial[]> => {
        try {
            const res = await fetch(`${API_BASE}/testimonials`);
            if (!res.ok) throw new Error('Fetch failed');
            return await res.json();
        } catch (error) {
            console.error('API Error:', error);
            return [];
        }
    },

    getEnquiries: async (): Promise<any[]> => {
        try {
            const res = await fetch(`${API_BASE}/enquiries`);
            if (!res.ok) throw new Error('Fetch failed');
            return await res.json();
        } catch (error) {
            console.error('API Error:', error);
            return [];
        }
    },

    // CRUD Operations for CRM
    create: async (type: string, data: any) => {
        const res = await fetch(`${API_BASE}/${type}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    update: async (type: string, id: string, data: any) => {
        const res = await fetch(`${API_BASE}/${type}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    delete: async (type: string, id: string) => {
        const res = await fetch(`${API_BASE}/${type}/${id}`, {
            method: 'DELETE'
        });
        return res.json();
    },

    getStats: async (): Promise<any> => {
        try {
            const res = await fetch(`${API_BASE}/stats`);
            if (!res.ok) throw new Error('Fetch failed');
            return await res.json();
        } catch (error) {
            console.error('API Error:', error);
            return null;
        }
    },

    getSubscribers: async (): Promise<any[]> => {
        try {
            const res = await fetch(`${API_BASE}/subscribers`);
            if (!res.ok) throw new Error('Fetch failed');
            return await res.json();
        } catch (error) {
            console.error('API Error:', error);
            return [];
        }
    },

    subscribeToNewsletter: async (email: string, type: 'newsletter' | 'vip' = 'newsletter') => {
        return contentService.create('subscribers', { email, type });
    },

    trackVisitor: async (data: { path: string; notificationStatus?: string }) => {
        let sessionId = sessionStorage.getItem('whatnew_session_id');
        if (!sessionId) {
            sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
            sessionStorage.setItem('whatnew_session_id', sessionId);
        }

        try {
            const res = await fetch(`${API_BASE}/visitors/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, sessionId })
            });
            return await res.json();
        } catch (error) {
            console.error('Tracking Error:', error);
        }
    },

    getVisitors: async (): Promise<any[]> => {
        try {
            const res = await fetch(`${API_BASE}/visitors`);
            if (!res.ok) throw new Error('Fetch failed');
            return await res.json();
        } catch (error) {
            console.error('API Error:', error);
            return [];
        }
    }
};
