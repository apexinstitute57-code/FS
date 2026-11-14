import { Client, Databases, ID } from 'appwrite';
import { OrderSubmissionResponse } from '../types/laptop';
import { isSupabaseClientConfigured, submitCustomerOrder as submitToSupabase } from './supabase';

const appwriteEndpoint = (
  import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'
).trim();
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
    lower === 'undefined'
  );
}

export const isAppwriteClientConfigured =
  !isPlaceholder(appwriteEndpoint) &&
  !isPlaceholder(appwriteProjectId) &&
  !isPlaceholder(appwriteDatabaseId) &&
  !isPlaceholder(appwriteCollectionId);

let cachedClient: Client | null = null;
let cachedDatabases: Databases | null = null;

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

  // Path 1: Direct Appwrite Web SDK (works in Vite local & static Netlify/Vercel deploys)
  const databases = getAppwriteDatabases();
  if (databases) {
    try {
      const doc = await databases.createDocument({
        databaseId: appwriteDatabaseId,
        collectionId: appwriteCollectionId,
        documentId: ID.unique(),
        data: {
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
        },
      });

      return {
        saved: true,
        orderId: doc.$id,
        orderDate: doc.$createdAt || createdAt,
        totalPkr: totalPrice,
      };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unknown error while saving order to Appwrite.';
      return {
        saved: false,
        error: `Could not save your order to Appwrite: ${message}`,
        code: 'APPWRITE_INSERT_ERROR',
      };
    }
  }

  // Path 2: If Supabase frontend client is explicitly configured, use it
  if (isSupabaseClientConfigured) {
    return submitToSupabase(input);
  }

  // Path 3: Server-side backend (/api/orders) supporting Appwrite API key or Supabase
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

    const data = (await response.json()) as OrderSubmissionResponse;
    if (!response.ok || !data.saved) {
      return {
        saved: false,
        error:
          data.error ||
          'Appwrite is not configured yet. Add your Appwrite Project ID, Database ID, and Collection ID in .env.local (see APPWRITE_SETUP.md) or order via WhatsApp.',
        code: data.code || 'ORDER_SAVE_FAILED',
      };
    }

    return data;
  } catch {
    return {
      saved: false,
      error:
        'Database is not configured or the server could not be reached. Please check APPWRITE_SETUP.md or place your order via WhatsApp at 03086421306.',
      code: 'NETWORK_OR_CONFIG_ERROR',
    };
  }
}
