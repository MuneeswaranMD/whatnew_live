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

const enquirySchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  topic: String,
  message: String,
  status: { type: String, default: 'new' }
}, { timestamps: true });

const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  type: { type: String, default: 'newsletter' }, // newsletter, vip
  status: { type: String, default: 'active' }
}, { timestamps: true });

const visitorSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  notificationStatus: { type: String, default: 'default' }, // granted, denied, default
  pagePath: String,
  history: [{
    path: String,
    timestamp: { type: Date, default: Date.now }
  }],
  lastSeen: { type: Date, default: Date.now }
}, { timestamps: true });

export const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export const LiveStream = mongoose.model('LiveStream', liveStreamSchema);
export const Drop = mongoose.model('Drop', dropSchema);
export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export const Enquiry = mongoose.model('Enquiry', enquirySchema);
export const Subscriber = mongoose.model('Subscriber', subscriberSchema);
export const Visitor = mongoose.model('Visitor', visitorSchema);
