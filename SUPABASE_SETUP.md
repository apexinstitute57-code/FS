# FS SHOP – Step-by-Step Supabase & Vercel / Netlify Setup Guide

Follow these steps to connect your **FS SHOP** website to Supabase so every **customer order**, **added product**, and **edited price / description** is saved securely and displayed to all website visitors across mobile phones, tablets, and desktops.

---

## Step 1: Create Both Tables in Supabase (`orders` + `catalog_products`)

1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard) and open your project.
2. In the left sidebar, click **SQL Editor**.
3. Click **New query**.
4. Open the file `supabase-setup.sql` from this project, copy its entire contents, and paste it into the SQL Editor.
5. Click **Run**.
6. Go to **Table Editor** in the left sidebar and confirm that both **`orders`** and **`catalog_products`** tables appear with Row Level Security (RLS) enabled.

> **Upgrading from an older setup?** Simply re-run the updated `supabase-setup.sql` in SQL Editor—it uses `CREATE TABLE IF NOT EXISTS` and `DROP POLICY IF EXISTS` so your existing orders stay untouched.

---

## Step 2: Find Your Supabase URL and API Keys

1. In your Supabase Dashboard, click **Project Settings** (the gear icon at the bottom left).
2. Click **API Keys** (or **API**).
3. Copy:
   - **Project URL** (looks like `https://abcdefghijklmno.supabase.co`)
   - **Publishable Key** (or legacy **anon / public** key)
   - *(Optional for Vercel/Netlify server functions)* **service_role** secret key (keep this server-only; never put it in `VITE_*` variables).

---

## Step 3: Deploying on Vercel (Recommended)

1. Push your updated project to GitHub.
2. Open your project in the **Vercel Dashboard** → **Settings** → **Build and Deployment**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Go to **Settings** → **Environment Variables** and add:
   - `VITE_SUPABASE_URL` = your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase Publishable / anon Key
   - *(Recommended for `/api/orders` and `/api/catalog`)* `SUPABASE_URL` = your Supabase Project URL
   - *(Recommended for `/api/catalog` & `/api/orders`)* `SUPABASE_ANON_KEY` = your Supabase Publishable Key (or `SUPABASE_SERVICE_ROLE_KEY` for server-only bypass of RLS)
4. Click **Deployments** → **Redeploy** (with build cache cleared if updating variables) so the production build and `/api/*` serverless functions pick up the new variables.

---

## Step 4: Deploying on Netlify

If you deploy FS SHOP on Netlify:

1. Open your site in the **Netlify Dashboard**.
2. Go to **Site configuration** → **Environment variables**.
3. Click **Add a variable** and add:
   - Key: `VITE_SUPABASE_URL` → Value: your Supabase Project URL
   - Key: `VITE_SUPABASE_ANON_KEY` → Value: your Supabase Publishable (anon) Key
4. Trigger a **redeploy** (**Deploys** → **Trigger deploy** → **Clear cache and deploy site**).

---

## Step 5: Add Credentials Locally (Vite `.env.local`)

1. In the **project root** (the same folder as `package.json`), create a file named `.env.local`:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

2. Replace the placeholders with your actual credentials from Step 2.
3. Restart your dev server (`npm run dev`).

---

## Step 6: Test Orders & Live Product Editing on Mobile

1. **Test Adding / Editing Products**:
   - Open the mobile menu (`☰`) → tap **Manage Products & Prices** (or click **Manage Prices & Products** in the footer).
   - Edit any product price, stock status, or description and tap **Save Updates to Supabase**, or switch to **Add New Product** to publish a new laptop or accessory.
   - Refresh the page or open the site from another phone—the changes load from Supabase for every visitor.
2. **Test Customer Order Submission**:
   - Click **SHOP NOW** on any product → **ORDER NOW** → fill in **Customer Name**, **Complete Delivery Address**, and **Contact Number** → **SUBMIT ORDER**.
   - Verify in **Supabase Dashboard → Table Editor → `orders`** that the new order row appears with `order_status = 'Pending'`.
