import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: String,
  author: {
    name: String,
    role: String,
    image: String,
  },
  category: String,
  tags: [String],
  date: { type: String, default: () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
  readTime: String,
  image: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const liveStreamSchema = new mongoose.Schema({
  category: String,
  title: String,
  streamer: String,
  viewers: String,
  image: String,
}, { timestamps: true });

const dropSchema = new mongoose.Schema({
  title: String,
  brand: String,
  price: String,
  originalPrice: String,
  date: String,
  time: String,
  spots: Number,
  interested: Number,
  image: String,
  gradient: String,
}, { timestamps: true });

const testimonialSchema = new mongoose.Schema({
  name: String,
  role: String,
  image: String,
  quote: String,
  stats: String,
  gradient: String,
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export const LiveStream = mongoose.model('LiveStream', liveStreamSchema);
export const Drop = mongoose.model('Drop', dropSchema);
export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
