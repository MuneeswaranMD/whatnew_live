import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { BlogPost, LiveStream, Drop, Testimonial, Visitor } from './server/models.js';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

async function seed() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to DB for seeding');

        const blogCount = await BlogPost.countDocuments();
        if (blogCount === 0) {
            await BlogPost.create({
                title: 'Welcome to WhatNew',
                excerpt: 'The future of live commerce is here.',
                content: 'Welcome to our platform! Enjoy the latest streams and drops.',
                author: { name: 'Admin', role: 'Editor' },
                image: '/blog-bg.png',
                category: 'News',
                featured: true
            });
            console.log('Seed: Created initial blog post');
        }

        const streamCount = await LiveStream.countDocuments();
        if (streamCount === 0) {
            await LiveStream.create({
                title: 'Tech Talk Live',
                streamer: 'Ella',
                views: 1200,
                image: '/stream-bg.png',
                featured: true
            });
            console.log('Seed: Created initial live stream');
        }

        console.log('Seeding complete');
        process.exit(0);
    } catch (err) {
        console.error('Seed Error:', err);
        process.exit(1);
    }
}

seed();
