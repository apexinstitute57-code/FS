import {
  AppwriteException,
  Client,
  Databases,
  ID,
  TablesDB,
} from 'appwrite';
import { OrderSubmissionResponse } from '../types/laptop';

function normalizeAppwriteEndpoint(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, '');
  if (!trimmed) return 'https://cloud.appwrite.io/v1';
  if (trimmed.endsWith('/v1')) return trimmed;
  return `${trimmed}/v1`;
}

const appwriteEndpoint = normalizeAppwriteEndpoint(
  import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'
);
const appwriteProjectId = (import.meta.env.VITE_APPWRITE_PROJECT_ID || '').trim();
const appwriteDatabaseId = (import.meta.env.VITE_APPWRITE_DATABASE_ID || '').trim();
const appwriteCollectionId = (
  import.meta.env.VITE_APPWRITE_COLLECTION_ID ||
  import.meta.env.VITE_APPWRITE_TABLE_ID ||
  ''
).trim();

function isPlaceholder(value: string): boolean {
  if (!value) return true;
  const lower = value.toLowerCase();
  return (
    lower.includes('your_appwrite') ||
    lower.includes('your-project-id') ||
    lower.includes('your_database') ||
    lower.includes('your_collection') ||
    lower === 'undefined' ||
    lower === 'null'
  );
}

export const isAppwriteClientConfigured =
  !isPlaceholder(appwriteEndpoint) &&
  !isPlaceholder(appwriteProjectId) &&
  !isPlaceholder(appwriteDatabaseId) &&
  !isPlaceholder(appwriteCollectionId);

let cachedClient: Client | null = null;
let cachedDatabases: Databases | null = null;
let cachedTablesDB: TablesDB | null = null;

export function getAppwriteClient(): Client | null {
  if (!isAppwriteClientConfigured) return null;
  if (!cachedClient) {
    cachedClient = new Client()
      .setEndpoint(appwriteEndpoint)
      .setProject(appwriteProjectId);
  }
  return cachedClient;
}

export function getAppwriteDatabases(): Databases | null {
  const client = getAppwriteClient();
  if (!client) return null;
  if (!cachedDatabases) {
    cachedDatabases = new Databases(client);
  }
  return cachedDatabases;
}

export function getAppwriteTablesDB(): TablesDB | null {
  const client = getAppwriteClient();
  if (!client) return null;
  if (!cachedTablesDB) {
    cachedTablesDB = new TablesDB(client);
  }
  return cachedTablesDB;
}

export interface SubmitOrderInput {
  customerName: string;
  deliveryAddress: string;
  contactNumber: string;
  productName: string;
  productBrand: string;
  productCategory: string;
  productPrice: number;
  quantity: number;
}

async function submitViaAppwriteWebSdk(
  orderData: {
    customer_name: string;
    delivery_address: string;
    contact_number: string;
    product_name: string;
    product_brand: string;
    product_category: string;
    product_price: number;
    quantity: number;
    total_price: number;
    order_status: string;
    created_at: string;
  }
): Promise<OrderSubmissionResponse> {
  const databases = getAppwriteDatabases();
  const tablesDB = getAppwriteTablesDB();
  if (!databases || !tablesDB) {
    return {
      saved: false,
      error:
        'Appwrite is not configured yet. Set APPWRITE_PROJECT_ID, APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, and APPWRITE_API_KEY in Netlify Environment Variables (see APPWRITE_SETUP.md).',
      code: 'APPWRITE_NOT_CONFIGURED',
    };
  }

  try {
    try {
      const doc = await databases.createDocument({
        databaseId: appwriteDatabaseId,
        collectionId: appwriteCollectionId,
        documentId: ID.unique(),
        data: orderData,
      });

      return {
        saved: true,
        orderId: doc.$id,
        orderDate: doc.$createdAt || orderData.created_at,
        totalPkr: orderData.total_price,
      };
    } catch (primaryErr) {
      const isNotFound =
        primaryErr instanceof AppwriteException && primaryErr.code === 404;
      if (!isNotFound) {
        throw primaryErr;
      }

      const row = await tablesDB.createRow({
        databaseId: appwriteDatabaseId,
        tableId: appwriteCollectionId,
        rowId: ID.unique(),
        data: orderData,
      });

      return {
        saved: true,
        orderId: row.$id,
        orderDate: row.$createdAt || orderData.created_at,
        totalPkr: orderData.total_price,
      };
    }
  } catch (err) {
    const appwriteErr = err instanceof AppwriteException ? err : null;
    const message =
      appwriteErr?.message ||
      (err instanceof Error
        ? err.message
        : 'Unknown error while saving order to Appwrite.');
    const permissionHint =
      appwriteErr && (appwriteErr.code === 401 || appwriteErr.code === 403)
        ? ' (Enable Role: Any -> Create permission on your Appwrite orders collection or configure APPWRITE_API_KEY on Netlify.)'
        : '';
    return {
      saved: false,
      error: `Could not save your order to Appwrite: ${message}${permissionHint}`,
      code: appwriteErr?.type || 'APPWRITE_INSERT_ERROR',
    };
  }
}

export async function submitOrder(
  input: SubmitOrderInput
): Promise<OrderSubmissionResponse> {
  const customerName = input.customerName.trim();
  const deliveryAddress = input.deliveryAddress.trim();
  const contactNumber = input.contactNumber.trim();
  const productName = input.productName.trim();
  const productBrand = input.productBrand.trim();
  const productCategory = input.productCategory.trim();
  const productPrice = Math.round(Number(input.productPrice));
  const quantity = Math.round(Number(input.quantity));

  if (customerName.length < 2) {
    return { saved: false, error: 'Please enter your full name (at least 2 characters).' };
  }
  if (deliveryAddress.length < 5) {
    return { saved: false, error: 'Please enter a complete delivery address.' };
  }
  if (contactNumber.length < 7) {
    return {
      saved: false,
      error: 'Please enter a valid contact phone number (e.g. 03086421306).',
    };
  }
  if (!productName || !productBrand || !productCategory || productPrice <= 0 || quantity < 1) {
    return { saved: false, error: 'Selected product information is incomplete.' };
  }

  const totalPrice = productPrice * quantity;
  const createdAt = new Date().toISOString();

  // Path 1: Secure server-side endpoint (/api/orders -> Netlify Function in production, Express server.ts locally)
  // Keeps APPWRITE_API_KEY strictly on the server and avoids browser CORS/guest permission issues.
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName,
        deliveryAddress,
        contactNumber,
        productName,
        productBrand,
        productCategory,
        productPrice,
        quantity,
      }),
    });

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = (await response.json()) as OrderSubmissionResponse;

      if (response.ok && data.saved) {
        return data;
      }

      // If server-side Appwrite env vars are not configured yet, try client-side Appwrite Web SDK if VITE_APPWRITE_* is set
      if (response.status === 503 && data.code === 'APPWRITE_NOT_CONFIGURED' && isAppwriteClientConfigured) {
        return submitViaAppwriteWebSdk({
          customer_name: customerName,
          delivery_address: deliveryAddress,
          contact_number: contactNumber,
          product_name: productName,
          product_brand: productBrand,
          product_category: productCategory,
          product_price: productPrice,
          quantity,
          total_price: totalPrice,
          order_status: 'Pending',
          created_at: createdAt,
        });
      }

      return {
        saved: false,
        error:
          data.error ||
          'Could not save order to Appwrite. Check your Appwrite environment variables and collection schema.',
        code: data.code || 'ORDER_SAVE_FAILED',
      };
    }
  } catch {
    // Server endpoint unreachable; fall back to direct Appwrite Web SDK if configured
  }

  // Path 2: Direct Appwrite Web SDK (uses VITE_APPWRITE_* env vars + Role: Any Create permission)
  if (isAppwriteClientConfigured) {
    return submitViaAppwriteWebSdk({
      customer_name: customerName,
      delivery_address: deliveryAddress,
      contact_number: contactNumber,
      product_name: productName,
      product_brand: productBrand,
      product_category: productCategory,
      product_price: productPrice,
      quantity,
      total_price: totalPrice,
      order_status: 'Pending',
      created_at: createdAt,
    });
  }

  return {
    saved: false,
    error:
      'Appwrite database is not configured or the server function could not be reached. Please verify APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID, and APPWRITE_API_KEY in Netlify Environment Variables (see APPWRITE_SETUP.md).',
    code: 'APPWRITE_NOT_CONFIGURED',
  };
}
