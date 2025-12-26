import express from 'express';
import { BlogPost, LiveStream, Drop, Testimonial, Enquiry, Subscriber, Visitor } from './models.js';

const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// Visitor Tracking
router.post('/visitors/track', async (req, res) => {
  const { sessionId, path, notificationStatus } = req.body;
  try {
    let visitor = await Visitor.findOne({ sessionId });
    if (!visitor) {
      visitor = new Visitor({ sessionId, notificationStatus, pagePath: path });
    } else {
      if (notificationStatus) visitor.notificationStatus = notificationStatus;
      visitor.pagePath = path;
      visitor.lastSeen = new Date();
    }
    
    // Add to history only if path changed
    const lastHistory = visitor.history[visitor.history.length - 1];
    if (!lastHistory || lastHistory.path !== path) {
      visitor.history.push({ path });
      // Limit history to last 20
      if (visitor.history.length > 20) visitor.history.shift();
    }
    
    await visitor.save();
    res.json(visitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper for generic CRUD
const setupCrud = (route, model) => {
  // Get all
  router.get(`/${route}`, async (req, res) => {
    try {
      const items = await model.find().sort({ updatedAt: -1 });
      res.json(items);
    } catch (err) {
      console.error(`❌ Error fetching ${route}:`, err);
      res.status(500).json({ error: err.message });
    }
  });

  // Get one
  router.get(`/${route}/:id`, async (req, res) => {
    try {
      const item = await model.findById(req.params.id);
      res.json(item);
    } catch (err) {
      res.status(404).json({ error: 'Not found' });
    }
  });

  // Create
  router.post(`/${route}`, async (req, res) => {
    try {
      const item = new model(req.body);
      await item.save();
      res.status(201).json(item);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // Update
  router.put(`/${route}/:id`, async (req, res) => {
    try {
      const item = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(item);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // Delete
  router.delete(`/${route}/:id`, async (req, res) => {
    try {
      await model.findByIdAndDelete(req.params.id);
      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

// Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    const [blogs, streams, drops, testimonials, totalEnquiries, newEnquiries, subscribers, visitors] = await Promise.all([
      BlogPost.countDocuments(),
      LiveStream.countDocuments(),
      Drop.countDocuments(),
      Testimonial.countDocuments(),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'new' }),
      Subscriber.countDocuments(),
      Visitor.countDocuments(),
    ]);
    const stats = { blogs, streams, drops, testimonials, totalEnquiries, newEnquiries, subscribers, visitors };
    console.log('📊 Cloud Stats:', stats);
    res.json(stats);
  } catch (err) {
    console.error('❌ Stats Error:', err);
    res.status(500).json({ error: err.message });
  }
});

setupCrud('blogs', BlogPost);
setupCrud('streams', LiveStream);
setupCrud('drops', Drop);
setupCrud('testimonials', Testimonial);
setupCrud('enquiries', Enquiry);
setupCrud('subscribers', Subscriber);
setupCrud('visitors', Visitor);

export default router;
