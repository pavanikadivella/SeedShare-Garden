const express = require('express');
const { getDb } = require('./db/database');
const gardenersRouter = require('./routes/gardeners');
const plotsRouter = require('./routes/plots');
const leasesRouter = require('./routes/leases');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Root status route
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'SeedShare Garden API',
    group: 'JP-GAI2A-G02',
    endpoints: ['/gardeners', '/plots', '/leases'],
  });
});

// Mount routes
app.use('/gardeners', gardenersRouter);
app.use('/plots', plotsRouter);
app.use('/leases', leasesRouter);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

getDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SeedShare Garden server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });