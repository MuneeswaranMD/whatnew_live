
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
    }
};
