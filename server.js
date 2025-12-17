import express from 'express';
import compression from 'compression';
import path from 'path';

const app = express();
app.use(compression());
const port = process.env.PORT || 3000;
const dist = path.join(process.cwd(), 'dist');

app.use(express.static(dist, { maxAge: '1d' }));

// All other requests serve index.html (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(dist, 'index.html'));
});

app.listen(port, () => {
  console.log(`Production server running on http://localhost:₹{port}`);
});
