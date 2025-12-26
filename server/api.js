import express from 'express';
import { BlogPost, LiveStream, Drop, Testimonial, Enquiry } from './models.js';

const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// Helper for generic CRUD
const setupCrud = (route, model) => {
  // Get all
  router.get(`/${route}`, async (req, res) => {
    try {
      const items = await model.find().sort({ createdAt: -1 });
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

setupCrud('blogs', BlogPost);
setupCrud('streams', LiveStream);
setupCrud('drops', Drop);
setupCrud('testimonials', Testimonial);
setupCrud('enquiries', Enquiry);

export default router;
