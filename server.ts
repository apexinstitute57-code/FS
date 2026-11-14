import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { Client as AppwriteClient, Databases as AppwriteDatabases, ID as AppwriteID } from 'node-appwrite';

dotenv.config({ path: '.env.local' });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

interface OrderPayload {
  customerName?: string;
  deliveryAddress?: string;
  contactNumber?: string;
  productName?: string;
  productBrand?: string;
  productCategory?: string;
  productPrice?: number;
  quantity?: number;
}

function isPlaceholder(val: string): boolean {
  if (!val) return true;
  const lower = val.toLowerCase();
  return (
    lower.includes('your_appwrite') ||
    lower.includes('your_supabase') ||
    lower.includes('your-project-id') ||
    lower.includes('your-supabase-') ||
    lower.includes('your_database') ||
    lower.includes('your_collection') ||
    lower === 'undefined'
  );
}

function getAppwriteServerConfig() {
  const endpoint =
    process.env.APPWRITE_ENDPOINT ||
    process.env.VITE_APPWRITE_ENDPOINT ||
    'https://cloud.appwrite.io/v1';
  const projectId =
    process.env.APPWRITE_PROJECT_ID || process.env.VITE_APPWRITE_PROJECT_ID || '';
  const databaseId =
    process.env.APPWRITE_DATABASE_ID || process.env.VITE_APPWRITE_DATABASE_ID || '';
  const collectionId =
    process.env.APPWRITE_COLLECTION_ID ||
    process.env.VITE_APPWRITE_COLLECTION_ID ||
    process.env.VITE_APPWRITE_TABLE_ID ||
    '';
  const apiKey = process.env.APPWRITE_API_KEY || '';

  if (
    isPlaceholder(endpoint) ||
    isPlaceholder(projectId) ||
    isPlaceholder(databaseId) ||
    isPlaceholder(collectionId)
  ) {
    return { configured: false as const };
  }

  return {
    configured: true as const,
    endpoint,
    projectId,
    databaseId,
    collectionId,
    apiKey: isPlaceholder(apiKey) ? '' : apiKey,
  };
}

function getSupabaseServerConfig() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  if (isPlaceholder(url)) {
    return { configured: false as const, url: '', key: '', isServiceRole: false };
  }

  if (!isPlaceholder(serviceRoleKey)) {
    return { configured: true as const, url, key: serviceRoleKey, isServiceRole: true };
  }

  if (!isPlaceholder(anonKey)) {
    return { configured: true as const, url, key: anonKey, isServiceRole: false };
  }

  return { configured: false as const, url: '', key: '', isServiceRole: false };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/health', (_req, res) => {
    const appwriteCfg = getAppwriteServerConfig();
    const supabaseCfg = getSupabaseServerConfig();
    res.json({
      status: 'ok',
      store: 'FS SHOP',
      appwriteConfigured: appwriteCfg.configured,
      supabaseConfigured: supabaseCfg.configured,
    });
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const body = (req.body || {}) as OrderPayload;

      const customerName = String(body.customerName ?? '').trim();
      const deliveryAddress = String(body.deliveryAddress ?? '').trim();
      const contactNumber = String(body.contactNumber ?? '').trim();
      const productName = String(body.productName ?? '').trim();
      const productBrand = String(body.productBrand ?? '').trim();
      const productCategory = String(body.productCategory ?? '').trim();
      const productPrice = Number(body.productPrice);
      const quantity = Number(body.quantity ?? 1);

      if (customerName.length < 2) {
        return res.status(400).json({
          saved: false,
          error: 'Please enter your full name (at least 2 characters).',
        });
      }
      if (deliveryAddress.length < 5) {
        return res.status(400).json({
          saved: false,
          error: 'Please enter a complete delivery address.',
        });
      }
      if (contactNumber.length < 7) {
        return res.status(400).json({
          saved: false,
          error: 'Please enter a valid contact phone number.',
        });
      }
      if (!productName || !productBrand || !productCategory) {
        return res.status(400).json({
          saved: false,
          error: 'Selected product details are missing.',
        });
      }
      if (!Number.isFinite(productPrice) || productPrice <= 0) {
        return res.status(400).json({
          saved: false,
          error: 'Invalid product price.',
        });
      }
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
        return res.status(400).json({
          saved: false,
          error: 'Quantity must be between 1 and 50.',
        });
      }

      const createdAt = new Date().toISOString();
      const roundedPrice = Math.round(productPrice);
      const totalPrice = roundedPrice * quantity;

      // 1. Prefer Appwrite if configured on server
      const appwriteCfg = getAppwriteServerConfig();
      if (appwriteCfg.configured) {
        const client = new AppwriteClient()
          .setEndpoint(appwriteCfg.endpoint)
          .setProject(appwriteCfg.projectId);

        if (appwriteCfg.apiKey) {
          client.setKey(appwriteCfg.apiKey);
        }

        const databases = new AppwriteDatabases(client);
        try {
          const doc = await databases.createDocument({
            databaseId: appwriteCfg.databaseId,
            collectionId: appwriteCfg.collectionId,
            documentId: AppwriteID.unique(),
            data: {
              customer_name: customerName,
              delivery_address: deliveryAddress,
              contact_number: contactNumber,
              product_name: productName,
              product_brand: productBrand,
              product_category: productCategory,
              product_price: roundedPrice,
              quantity,
              total_price: totalPrice,
              order_status: 'Pending',
              created_at: createdAt,
            },
          });

          return res.status(201).json({
            saved: true,
            orderId: doc.$id,
            orderDate: doc.$createdAt || createdAt,
            totalPkr: totalPrice,
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Appwrite insert failed';
          return res.status(502).json({
            saved: false,
            error: `Could not save order to Appwrite: ${msg}`,
            code: 'APPWRITE_INSERT_ERROR',
          });
        }
      }

      // 2. Fallback to Supabase if configured on server
      const supabaseCfg = getSupabaseServerConfig();
      if (supabaseCfg.configured) {
        const supabase = createClient(supabaseCfg.url, supabaseCfg.key, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        });

        const row = {
          customer_name: customerName,
          delivery_address: deliveryAddress,
          contact_number: contactNumber,
          product_name: productName,
          product_brand: productBrand,
          product_category: productCategory,
          product_price: roundedPrice,
          quantity,
          total_price: totalPrice,
          order_status: 'Pending',
        };

        if (supabaseCfg.isServiceRole) {
          const { data, error } = await supabase
            .from('orders')
            .insert([row])
            .select('id, created_at')
            .single();

          if (error) {
            return res.status(502).json({
              saved: false,
              error: `Could not save order to database: ${error.message}`,
              code: error.code || 'SUPABASE_INSERT_ERROR',
            });
          }

          return res.status(201).json({
            saved: true,
            orderId: data.id,
            orderDate: data.created_at,
            totalPkr: totalPrice,
          });
        }

        const { error } = await supabase.from('orders').insert([row]);
        if (error) {
          return res.status(502).json({
            saved: false,
            error: `Could not save order to database: ${error.message}`,
            code: error.code || 'SUPABASE_INSERT_ERROR',
          });
        }

        return res.status(201).json({
          saved: true,
          orderId: `FS-${Date.now().toString(36).toUpperCase()}`,
          orderDate: createdAt,
          totalPkr: totalPrice,
        });
      }

      // 3. Neither database configured yet
      return res.status(503).json({
        saved: false,
        error:
          'Appwrite database is not configured yet. Follow APPWRITE_SETUP.md to add VITE_APPWRITE_PROJECT_ID, VITE_APPWRITE_DATABASE_ID, and VITE_APPWRITE_COLLECTION_ID in .env.local, or send your order via WhatsApp.',
        code: 'APPWRITE_NOT_CONFIGURED',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected server error';
      return res.status(500).json({
        saved: false,
        error: `Order submission failed: ${message}`,
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
