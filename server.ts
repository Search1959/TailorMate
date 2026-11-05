import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  getBusinessProfiles,
  getCustomers,
  saveCustomer,
  getMeasurements,
  saveMeasurement,
  getOrders,
  saveOrder,
  getFabrics,
  saveFabric,
  getHaberdashery,
  saveHaberdashery,
  getTailorStaff,
  saveTailorStaff,
  seedInitialDataIfEmpty,
  deleteCustomer,
  deleteOrder,
  deleteMeasurement,
  deleteFabric,
  deleteHaberdashery,
  deleteTailorStaff,
} from './src/db/repository.ts';
import { optionalAuth, requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { db } from './src/db/index.ts';
import { users } from './src/db/schema.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize and seed database if necessary
seedInitialDataIfEmpty().catch((err) => {
  console.warn('Initial seeding notice:', err);
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'StitchMate ERP & Cloud SQL Backend' });
});

// 1. Business Profiles
app.get('/api/businesses', async (req, res) => {
  try {
    const list = await getBusinessProfiles();
    res.json(list);
  } catch (error: any) {
    console.error('Failed to get businesses:', error);
    res.status(500).json({ error: 'Failed to query business profiles' });
  }
});

// 2. Customers
app.get('/api/customers', async (req, res) => {
  try {
    const list = await getCustomers();
    res.json(list);
  } catch (error: any) {
    console.error('Failed to get customers:', error);
    res.status(500).json({ error: 'Failed to query customers' });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const customer = req.body;
    await saveCustomer(customer);
    res.json({ success: true, customer });
  } catch (error: any) {
    console.error('Failed to save customer:', error);
    res.status(500).json({ error: 'Failed to save customer' });
  }
});

// 3. Measurements
app.get('/api/measurements', async (req, res) => {
  try {
    const list = await getMeasurements();
    res.json(list);
  } catch (error: any) {
    console.error('Failed to get measurements:', error);
    res.status(500).json({ error: 'Failed to query measurements' });
  }
});

app.post('/api/measurements', async (req, res) => {
  try {
    const measurement = req.body;
    await saveMeasurement(measurement);
    res.json({ success: true, measurement });
  } catch (error: any) {
    console.error('Failed to save measurement:', error);
    res.status(500).json({ error: 'Failed to save measurement' });
  }
});

// 4. Orders
app.get('/api/orders', async (req, res) => {
  try {
    const list = await getOrders();
    res.json(list);
  } catch (error: any) {
    console.error('Failed to get orders:', error);
    res.status(500).json({ error: 'Failed to query orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body;
    await saveOrder(order);
    res.json({ success: true, order });
  } catch (error: any) {
    console.error('Failed to save order:', error);
    res.status(500).json({ error: 'Failed to save order' });
  }
});

// 5. Fabrics
app.get('/api/fabrics', async (req, res) => {
  try {
    const list = await getFabrics();
    res.json(list);
  } catch (error: any) {
    console.error('Failed to get fabrics:', error);
    res.status(500).json({ error: 'Failed to query fabrics' });
  }
});

app.post('/api/fabrics', async (req, res) => {
  try {
    const fabric = req.body;
    await saveFabric(fabric);
    res.json({ success: true, fabric });
  } catch (error: any) {
    console.error('Failed to save fabric:', error);
    res.status(500).json({ error: 'Failed to save fabric' });
  }
});

// 6. Haberdashery
app.get('/api/haberdashery', async (req, res) => {
  try {
    const list = await getHaberdashery();
    res.json(list);
  } catch (error: any) {
    console.error('Failed to get haberdashery:', error);
    res.status(500).json({ error: 'Failed to query haberdashery' });
  }
});

app.post('/api/haberdashery', async (req, res) => {
  try {
    const item = req.body;
    await saveHaberdashery(item);
    res.json({ success: true, item });
  } catch (error: any) {
    console.error('Failed to save haberdashery:', error);
    res.status(500).json({ error: 'Failed to save haberdashery' });
  }
});

// 7. Tailors
app.get('/api/tailors', async (req, res) => {
  try {
    const list = await getTailorStaff();
    res.json(list);
  } catch (error: any) {
    console.error('Failed to get tailors:', error);
    res.status(500).json({ error: 'Failed to query tailors' });
  }
});

app.post('/api/tailors', async (req, res) => {
  try {
    const tailor = req.body;
    await saveTailorStaff(tailor);
    res.json({ success: true, tailor });
  } catch (error: any) {
    console.error('Failed to save tailor staff:', error);
    res.status(500).json({ error: 'Failed to save tailor staff' });
  }
});

// DELETE Routes
app.delete('/api/customers/:id', async (req, res) => {
  try {
    await deleteCustomer(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error: any) {
    console.error('Failed to delete customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    await deleteOrder(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error: any) {
    console.error('Failed to delete order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

app.delete('/api/measurements/:id', async (req, res) => {
  try {
    await deleteMeasurement(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error: any) {
    console.error('Failed to delete measurement:', error);
    res.status(500).json({ error: 'Failed to delete measurement' });
  }
});

app.delete('/api/fabrics/:id', async (req, res) => {
  try {
    await deleteFabric(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error: any) {
    console.error('Failed to delete fabric:', error);
    res.status(500).json({ error: 'Failed to delete fabric' });
  }
});

app.delete('/api/haberdashery/:id', async (req, res) => {
  try {
    await deleteHaberdashery(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error: any) {
    console.error('Failed to delete haberdashery:', error);
    res.status(500).json({ error: 'Failed to delete haberdashery' });
  }
});

app.delete('/api/tailors/:id', async (req, res) => {
  try {
    await deleteTailorStaff(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error: any) {
    console.error('Failed to delete tailor:', error);
    res.status(500).json({ error: 'Failed to delete tailor' });
  }
});

// 8. Auth Sync
app.post('/api/auth/sync', optionalAuth, async (req: AuthRequest, res) => {
  try {
    if (req.user) {
      await db.insert(users).values({
        uid: req.user.uid,
        email: req.user.email || 'user@example.com',
        name: req.user.name || null,
        avatarUrl: req.user.picture || null,
      }).onConflictDoUpdate({
        target: users.uid,
        set: {
          email: req.user.email || 'user@example.com',
          name: req.user.name || null,
          avatarUrl: req.user.picture || null,
        },
      });
      return res.json({ success: true, uid: req.user.uid });
    }
    res.json({ success: true, anonymous: true });
  } catch (err: any) {
    console.error('Auth sync note:', err);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

// Mount Vite in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        port,
        host: '0.0.0.0',
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`StitchMate ERP full-stack server running on port ${port}`);
  });
}

startServer();
