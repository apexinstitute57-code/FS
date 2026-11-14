import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { OrderSubmissionResponse } from '../types/laptop';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

function isPlaceholder(value: string): boolean {
  if (!value) return true;
  const lower = value.toLowerCase();
  return (
    lower.includes('your_supabase') ||
    lower.includes('your-project-id') ||
    lower.includes('your-supabase-') ||
    lower === 'undefined'
  );
}

export const isSupabaseClientConfigured =
  !isPlaceholder(supabaseUrl) && !isPlaceholder(supabaseAnonKey);

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

  // Path 1: Direct Supabase JS Client (works on Vite local & Netlify static deploys)
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
        error: `Could not save your order to Supabase: ${error.message}`,
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

  // Path 2: Fallback to Express backend (/api/orders) if server-side Supabase secrets are configured
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
          'Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local (see SUPABASE_SETUP.md) or order via WhatsApp.',
        code: data.code || 'ORDER_SAVE_FAILED',
      };
    }

    return data;
  } catch {
    return {
      saved: false,
      error:
        'Supabase is not configured or the server could not be reached. Please check SUPABASE_SETUP.md or place your order via WhatsApp at 03086421306.',
      code: 'NETWORK_OR_CONFIG_ERROR',
    };
  }
}
