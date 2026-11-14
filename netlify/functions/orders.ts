import { createClient } from '@supabase/supabase-js';

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

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
};

function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: JSON_HEADERS,
  });
}

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

function getSupabaseServerConfig() {
  const url = (
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    ''
  ).trim();
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const anonKey = (
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    ''
  ).trim();

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

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  if (request.method === 'GET') {
    const cfg = getSupabaseServerConfig();
    return jsonResponse(
      {
        status: 'ok',
        store: 'FS SHOP',
        supabaseConfigured: cfg.configured,
      },
      200
    );
  }

  if (request.method !== 'POST') {
    return jsonResponse(
      {
        saved: false,
        error: 'Method not allowed. Use POST to submit an order.',
        code: 'METHOD_NOT_ALLOWED',
      },
      405
    );
  }

  let body: OrderPayload;
  try {
    body = (await request.json()) as OrderPayload;
  } catch {
    return jsonResponse(
      {
        saved: false,
        error: 'Invalid JSON request body.',
        code: 'INVALID_JSON',
      },
      400
    );
  }

  const customerName = String(body.customerName ?? '').trim();
  const deliveryAddress = String(body.deliveryAddress ?? '').trim();
  const contactNumber = String(body.contactNumber ?? '').trim();
  const productName = String(body.productName ?? '').trim();
  const productBrand = String(body.productBrand ?? '').trim();
  const productCategory = String(body.productCategory ?? '').trim();
  const productPrice = Number(body.productPrice);
  const quantity = Number(body.quantity ?? 1);

  if (customerName.length < 2) {
    return jsonResponse(
      { saved: false, error: 'Please enter your full name (at least 2 characters).' },
      400
    );
  }
  if (deliveryAddress.length < 5) {
    return jsonResponse(
      { saved: false, error: 'Please enter a complete delivery address.' },
      400
    );
  }
  if (contactNumber.length < 7) {
    return jsonResponse(
      { saved: false, error: 'Please enter a valid contact phone number (e.g. 03086421306).' },
      400
    );
  }
  if (!productName || !productBrand || !productCategory) {
    return jsonResponse(
      { saved: false, error: 'Selected product details are missing.' },
      400
    );
  }
  if (!Number.isFinite(productPrice) || productPrice <= 0) {
    return jsonResponse({ saved: false, error: 'Invalid product price.' }, 400);
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
    return jsonResponse(
      { saved: false, error: 'Quantity must be between 1 and 50.' },
      400
    );
  }

  const cfg = getSupabaseServerConfig();
  if (!cfg.configured) {
    return jsonResponse(
      {
        saved: false,
        error:
          'Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) in Netlify Environment Variables and redeploy.',
        code: 'SUPABASE_NOT_CONFIGURED',
      },
      503
    );
  }

  const createdAt = new Date().toISOString();
  const roundedPrice = Math.round(productPrice);
  const totalPrice = roundedPrice * quantity;

  const supabase = createClient(cfg.url, cfg.key, {
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

  if (cfg.isServiceRole) {
    const { data, error } = await supabase
      .from('orders')
      .insert([row])
      .select('id, created_at')
      .single();

    if (error) {
      const friendlyError =
        error.code === 'PGRST205' ||
        error.message.includes("Could not find the table 'public.orders'")
          ? 'Connected to Supabase, but the "orders" table does not exist yet. Open Supabase Dashboard → SQL Editor → New query, paste supabase-setup.sql, and click Run.'
          : `Could not save order to Supabase: ${error.message}`;
      return jsonResponse(
        {
          saved: false,
          error: friendlyError,
          code: error.code || 'SUPABASE_INSERT_ERROR',
        },
        502
      );
    }

    return jsonResponse(
      {
        saved: true,
        orderId: data.id,
        orderDate: data.created_at,
        totalPkr: totalPrice,
      },
      201
    );
  }

  const { error } = await supabase.from('orders').insert([row]);
  if (error) {
    const friendlyError =
      error.code === 'PGRST205' ||
      error.message.includes("Could not find the table 'public.orders'")
        ? 'Connected to Supabase, but the "orders" table does not exist yet. Open Supabase Dashboard → SQL Editor → New query, paste supabase-setup.sql, and click Run.'
        : error.code === '42501' || error.message.toLowerCase().includes('row-level security')
          ? 'Supabase RLS blocked the insert. Re-run supabase-setup.sql in Supabase SQL Editor to enable the INSERT policy on "orders".'
          : `Could not save order to Supabase: ${error.message}`;
    return jsonResponse(
      {
        saved: false,
        error: friendlyError,
        code: error.code || 'SUPABASE_INSERT_ERROR',
      },
      502
    );
  }

  return jsonResponse(
    {
      saved: true,
      orderId: `FS-${Date.now().toString(36).toUpperCase()}`,
      orderDate: createdAt,
      totalPkr: totalPrice,
    },
    201
  );
}
