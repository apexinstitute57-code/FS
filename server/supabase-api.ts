import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface OrderPayload {
  customerName?: string;
  deliveryAddress?: string;
  contactNumber?: string;
  productName?: string;
  productBrand?: string;
  productCategory?: string;
  productPrice?: number;
  quantity?: number;
}

export interface CatalogProductRow {
  id: string;
  kind: 'laptop' | 'accessory';
  category: string;
  sub_type?: string | null;
  brand: string;
  model?: string | null;
  name: string;
  price_pkr: number;
  original_price_pkr?: number | null;
  availability: string;
  image_url?: string | null;
  description: string;
  specs?: Record<string, string> | null;
  highlights?: { label: string; value: string }[] | null;
  collections?: string[] | null;
  is_custom: boolean;
  updated_at?: string;
  created_at?: string;
}

export interface ApiResult {
  status: number;
  body: Record<string, unknown>;
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

function normalizeUrl(raw: string): string {
  return raw.trim().replace(/^["']|["']$/g, '').replace(/\/+$/, '');
}

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function getSupabaseServerConfig() {
  const url = normalizeUrl(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
  );
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '')
    .trim()
    .replace(/^["']|["']$/g, '');
  const anonKey = (
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    ''
  )
    .trim()
    .replace(/^["']|["']$/g, '');

  if (isPlaceholder(url) || !isValidHttpUrl(url)) {
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

function createServerSupabaseClient(): {
  client: SupabaseClient;
  isServiceRole: boolean;
} | null {
  const cfg = getSupabaseServerConfig();
  if (!cfg.configured) return null;
  const client = createClient(cfg.url, cfg.key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return { client, isServiceRole: cfg.isServiceRole };
}

function formatSupabaseDbError(
  table: 'orders' | 'catalog_products',
  message: string,
  code?: string
): string {
  if (
    code === 'PGRST205' ||
    message.includes(`Could not find the table 'public.${table}'`)
  ) {
    return `Connected to Supabase, but the "${table}" table does not exist yet. Open Supabase Dashboard → SQL Editor → New query, paste supabase-setup.sql, and click Run.`;
  }
  if (code === '42501' || message.toLowerCase().includes('row-level security')) {
    return `Supabase Row Level Security (RLS) blocked this write on "${table}". Re-run supabase-setup.sql in Supabase SQL Editor or set SUPABASE_SERVICE_ROLE_KEY on the server.`;
  }
  return `Supabase error (${table}): ${message}`;
}

export function handleHealthRequest(): ApiResult {
  const cfg = getSupabaseServerConfig();
  return {
    status: 200,
    body: {
      status: 'ok',
      store: 'FS SHOP',
      supabaseConfigured: cfg.configured,
    },
  };
}

export async function handleCreateOrder(rawBody: unknown): Promise<ApiResult> {
  const body = (rawBody && typeof rawBody === 'object' ? rawBody : {}) as OrderPayload;

  const customerName = String(body.customerName ?? '').trim();
  const deliveryAddress = String(body.deliveryAddress ?? '').trim();
  const contactNumber = String(body.contactNumber ?? '').trim();
  const productName = String(body.productName ?? '').trim();
  const productBrand = String(body.productBrand ?? '').trim();
  const productCategory = String(body.productCategory ?? '').trim();
  const productPrice = Number(body.productPrice);
  const quantity = Number(body.quantity ?? 1);

  if (customerName.length < 2) {
    return {
      status: 400,
      body: { saved: false, error: 'Please enter your full name (at least 2 characters).' },
    };
  }
  if (deliveryAddress.length < 5) {
    return {
      status: 400,
      body: { saved: false, error: 'Please enter a complete delivery address.' },
    };
  }
  if (contactNumber.length < 7) {
    return {
      status: 400,
      body: {
        saved: false,
        error: 'Please enter a valid contact phone number (e.g. 03086421306).',
      },
    };
  }
  if (!productName || !productBrand || !productCategory) {
    return {
      status: 400,
      body: { saved: false, error: 'Selected product details are missing.' },
    };
  }
  if (!Number.isFinite(productPrice) || productPrice <= 0) {
    return { status: 400, body: { saved: false, error: 'Invalid product price.' } };
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
    return {
      status: 400,
      body: { saved: false, error: 'Quantity must be between 1 and 50.' },
    };
  }

  const conn = createServerSupabaseClient();
  if (!conn) {
    return {
      status: 503,
      body: {
        saved: false,
        error:
          'Supabase database is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) in Vercel/Netlify Environment Variables and redeploy.',
        code: 'SUPABASE_NOT_CONFIGURED',
      },
    };
  }

  const createdAt = new Date().toISOString();
  const roundedPrice = Math.round(productPrice);
  const totalPrice = roundedPrice * quantity;

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

  if (conn.isServiceRole) {
    const { data, error } = await conn.client
      .from('orders')
      .insert([row])
      .select('id, created_at')
      .single();

    if (error) {
      return {
        status: 502,
        body: {
          saved: false,
          error: formatSupabaseDbError('orders', error.message, error.code),
          code: error.code || 'SUPABASE_INSERT_ERROR',
        },
      };
    }

    return {
      status: 201,
      body: {
        saved: true,
        orderId: data.id,
        orderDate: data.created_at,
        totalPkr: totalPrice,
      },
    };
  }

  const { error } = await conn.client.from('orders').insert([row]);
  if (error) {
    return {
      status: 502,
      body: {
        saved: false,
        error: formatSupabaseDbError('orders', error.message, error.code),
        code: error.code || 'SUPABASE_INSERT_ERROR',
      },
    };
  }

  return {
    status: 201,
    body: {
      saved: true,
      orderId: `FS-${Date.now().toString(36).toUpperCase()}`,
      orderDate: createdAt,
      totalPkr: totalPrice,
    },
  };
}

export async function handleGetCatalog(): Promise<ApiResult> {
  const conn = createServerSupabaseClient();
  if (!conn) {
    return {
      status: 200,
      body: {
        ok: true,
        configured: false,
        items: [],
      },
    };
  }

  const { data, error } = await conn.client
    .from('catalog_products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    // Gracefully return empty overrides if catalog_products table hasn't been created yet
    if (
      error.code === 'PGRST205' ||
      error.message.includes("Could not find the table 'public.catalog_products'")
    ) {
      return {
        status: 200,
        body: {
          ok: true,
          configured: true,
          tableMissing: true,
          items: [],
        },
      };
    }

    return {
      status: 502,
      body: {
        ok: false,
        error: formatSupabaseDbError('catalog_products', error.message, error.code),
        code: error.code || 'CATALOG_READ_ERROR',
      },
    };
  }

  return {
    status: 200,
    body: {
      ok: true,
      configured: true,
      items: data || [],
    },
  };
}

function sanitizeCatalogItem(raw: unknown): {
  valid: true;
  row: CatalogProductRow;
} | { valid: false; error: string } {
  const input = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const id = String(input.id ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const kind = input.kind === 'accessory' ? 'accessory' : 'laptop';
  const category = String(input.category ?? (kind === 'laptop' ? 'Laptops' : 'Other Accessories')).trim();
  const subType = input.sub_type ? String(input.sub_type).trim() : null;
  const brand = String(input.brand ?? '').trim();
  const model = input.model ? String(input.model).trim() : null;
  const name = String(input.name ?? '').trim();
  const pricePkr = Math.round(Number(input.price_pkr));
  const rawOrig =
    input.original_price_pkr !== undefined &&
    input.original_price_pkr !== null &&
    String(input.original_price_pkr).trim() !== ''
      ? Math.round(Number(input.original_price_pkr))
      : null;
  const availability = String(
    input.availability ?? 'Available · Confirm Stock on Order'
  ).trim();
  const imageUrl = input.image_url ? String(input.image_url).trim() : null;
  const description = String(input.description ?? '').trim();

  if (id.length < 2) {
    return { valid: false, error: 'Product ID is required.' };
  }
  if (brand.length < 1) {
    return { valid: false, error: 'Brand name is required.' };
  }
  if (name.length < 2) {
    return { valid: false, error: 'Product name must be at least 2 characters.' };
  }
  if (!Number.isFinite(pricePkr) || pricePkr <= 0) {
    return { valid: false, error: 'Selling price (PKR) must be greater than 0.' };
  }
  if (rawOrig !== null && (!Number.isFinite(rawOrig) || rawOrig < 0)) {
    return { valid: false, error: 'Original price must be a valid positive number.' };
  }

  return {
    valid: true,
    row: {
      id,
      kind,
      category,
      sub_type: subType,
      brand,
      model,
      name,
      price_pkr: pricePkr,
      original_price_pkr: rawOrig && rawOrig > 0 ? rawOrig : null,
      availability,
      image_url: imageUrl,
      description,
      specs:
        input.specs && typeof input.specs === 'object' && !Array.isArray(input.specs)
          ? (input.specs as Record<string, string>)
          : null,
      highlights: Array.isArray(input.highlights)
        ? (input.highlights as { label: string; value: string }[])
        : null,
      collections: Array.isArray(input.collections)
        ? (input.collections as string[])
        : null,
      is_custom: Boolean(input.is_custom),
      updated_at: new Date().toISOString(),
    },
  };
}

export async function handleUpsertCatalog(rawBody: unknown): Promise<ApiResult> {
  const conn = createServerSupabaseClient();
  if (!conn) {
    return {
      status: 503,
      body: {
        saved: false,
        error:
          'Supabase database is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) in Environment Variables.',
        code: 'SUPABASE_NOT_CONFIGURED',
      },
    };
  }

  const body = (rawBody && typeof rawBody === 'object' ? rawBody : {}) as Record<string, unknown>;
  const rawItems = Array.isArray(body.items) ? body.items : [body];

  if (rawItems.length === 0) {
    return {
      status: 400,
      body: { saved: false, error: 'No catalog product data provided.' },
    };
  }

  const sanitizedRows: CatalogProductRow[] = [];
  for (const item of rawItems) {
    const check = sanitizeCatalogItem(item);
    if (!check.valid) {
      return {
        status: 400,
        body: { saved: false, error: check.error },
      };
    }
    sanitizedRows.push(check.row);
  }

  const { data, error } = await conn.client
    .from('catalog_products')
    .upsert(sanitizedRows, { onConflict: 'id' })
    .select('*');

  if (error) {
    return {
      status: 502,
      body: {
        saved: false,
        error: formatSupabaseDbError('catalog_products', error.message, error.code),
        code: error.code || 'CATALOG_SAVE_ERROR',
      },
    };
  }

  return {
    status: 200,
    body: {
      saved: true,
      items: data || sanitizedRows,
    },
  };
}

export async function handleDeleteCatalog(rawBody: unknown): Promise<ApiResult> {
  const conn = createServerSupabaseClient();
  if (!conn) {
    return {
      status: 503,
      body: {
        saved: false,
        error: 'Supabase database is not configured yet.',
        code: 'SUPABASE_NOT_CONFIGURED',
      },
    };
  }

  const body = (rawBody && typeof rawBody === 'object' ? rawBody : {}) as Record<string, unknown>;
  const id = String(body.id ?? '').trim();
  const clearAll = Boolean(body.resetAllDefaults);

  if (clearAll) {
    // Delete only non-custom price/detail overrides so default catalog prices reset
    const { error } = await conn.client
      .from('catalog_products')
      .delete()
      .eq('is_custom', false);

    if (error) {
      return {
        status: 502,
        body: {
          saved: false,
          error: formatSupabaseDbError('catalog_products', error.message, error.code),
          code: error.code || 'CATALOG_DELETE_ERROR',
        },
      };
    }

    return { status: 200, body: { saved: true } };
  }

  if (!id) {
    return {
      status: 400,
      body: { saved: false, error: 'Product ID is required to delete.' },
    };
  }

  const { error } = await conn.client
    .from('catalog_products')
    .delete()
    .eq('id', id);

  if (error) {
    return {
      status: 502,
      body: {
        saved: false,
        error: formatSupabaseDbError('catalog_products', error.message, error.code),
        code: error.code || 'CATALOG_DELETE_ERROR',
      },
    };
  }

  return { status: 200, body: { saved: true, id } };
}
