import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { OrderSubmissionResponse } from '../types/laptop';

function normalizeSupabaseUrl(raw: string): string {
  return raw.trim().replace(/^["']|["']$/g, '').replace(/\/+$/, '');
}

const supabaseUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL || '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '')
  .trim()
  .replace(/^["']|["']$/g, '');

function isPlaceholder(value: string): boolean {
  if (!value) return true;
  const lower = value.toLowerCase();
  return (
    lower.includes('your_supabase') ||
    lower.includes('your-project-id') ||
    lower.includes('your-supabase-') ||
    lower === 'undefined' ||
    lower === 'null'
  );
}

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export const isSupabaseClientConfigured =
  !isPlaceholder(supabaseUrl) &&
  isValidHttpUrl(supabaseUrl) &&
  !isPlaceholder(supabaseAnonKey);

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseClientConfigured) return null;
  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return cachedClient;
}

export const supabase = getSupabaseClient();

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

function formatSupabaseError(message: string, code?: string): string {
  if (code === 'PGRST205' || message.includes("Could not find the table 'public.orders'")) {
    return 'Connected to Supabase, but the "orders" table does not exist yet. Open Supabase Dashboard → SQL Editor → New query, paste supabase-setup.sql, and click Run.';
  }
  if (code === '42501' || message.toLowerCase().includes('row-level security')) {
    return 'Supabase blocked the insert because of Row Level Security (RLS). Re-run supabase-setup.sql in Supabase SQL Editor to create the INSERT policy for "orders".';
  }
  if (message.includes('Failed to fetch')) {
    return 'Network error contacting Supabase from the browser. Verify VITE_SUPABASE_URL is a valid https://...supabase.co URL and check your internet or firewall.';
  }
  return `Could not save your order to Supabase: ${message}`;
}

export async function submitCustomerOrder(
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

  // Path 1: Server-side proxy (/api/orders -> Express server.ts locally/AI Studio, Netlify Function on Netlify)
  // Avoids browser CORS/adblocker/network issues ("TypeError: Failed to fetch") and supports server secrets.
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

      // Only fall back to browser Supabase client if server-side env vars are unconfigured (503)
      if (
        !(response.status === 503 && data.code === 'SUPABASE_NOT_CONFIGURED' && isSupabaseClientConfigured)
      ) {
        return {
          saved: false,
          error:
            data.error ||
            'Could not save order to Supabase. Please check your Supabase configuration.',
          code: data.code || 'ORDER_SAVE_FAILED',
        };
      }
    }
  } catch {
    // Server endpoint unreachable; fall back to direct Supabase browser client if configured
  }

  // Path 2: Direct Supabase JS Client (publishable/anon key + RLS)
  const client = getSupabaseClient();
  if (client) {
    const { error } = await client.from('orders').insert([
      {
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
      },
    ]);

    if (error) {
      return {
        saved: false,
        error: formatSupabaseError(error.message, error.code),
        code: error.code || 'SUPABASE_INSERT_ERROR',
      };
    }

    return {
      saved: true,
      orderId: `FS-${Date.now().toString(36).toUpperCase()}`,
      orderDate: createdAt,
      totalPkr: totalPrice,
    };
  }

  return {
    saved: false,
    error:
      'Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify Environment Variables or AI Studio Secrets (and run supabase-setup.sql in Supabase SQL Editor).',
    code: 'SUPABASE_NOT_CONFIGURED',
  };
}
