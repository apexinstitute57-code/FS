import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  handleCreateOrder,
  handleDeleteCatalog,
  handleGetCatalog,
  handleHealthRequest,
  handleUpsertCatalog,
} from './server/supabase-api';

dotenv.config({ path: '.env.local' });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  app.get('/api/health', (_req, res) => {
    const result = handleHealthRequest();
    res.status(result.status).json(result.body);
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const result = await handleCreateOrder(req.body);
      return res.status(result.status).json(result.body);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected server error';
      return res.status(500).json({
        saved: false,
        error: `Order submission failed: ${message}`,
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  });

  app.get('/api/catalog', async (_req, res) => {
    try {
      const result = await handleGetCatalog();
      return res.status(result.status).json(result.body);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected server error';
      return res.status(500).json({
        ok: false,
        error: `Failed to load catalog updates: ${message}`,
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  });

  const handleCatalogWrite = async (req: express.Request, res: express.Response) => {
    try {
      const result = await handleUpsertCatalog(req.body);
      return res.status(result.status).json(result.body);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected server error';
      return res.status(500).json({
        saved: false,
        error: `Catalog update failed: ${message}`,
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  };

  app.post('/api/catalog', handleCatalogWrite);
  app.put('/api/catalog', handleCatalogWrite);
  app.patch('/api/catalog', handleCatalogWrite);

  app.delete('/api/catalog', async (req, res) => {
    try {
      const result = await handleDeleteCatalog(req.body);
      return res.status(result.status).json(result.body);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected server error';
      return res.status(500).json({
        saved: false,
        error: `Catalog delete failed: ${message}`,
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FS SHOP server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
