# FS SHOP – Step-by-Step Supabase Setup Guide

Follow these steps to connect your **FS SHOP** website to a real Supabase database so every laptop, mouse, keyboard, and accessory order is saved securely.

---

## Step 1: Create the `orders` Table in Supabase

1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard) and open your project.
2. In the left sidebar, click **SQL Editor**.
3. Click **New query**.
4. Open the file `supabase-setup.sql` from this project, copy its entire contents, and paste it into the SQL Editor.
5. Click **Run**.
6. Go to **Table Editor** in the left sidebar and confirm that the `orders` table appears with Row Level Security (RLS) enabled.

---

## Step 2: Find Your Supabase URL and Publishable (Anon) Key

1. In your Supabase Dashboard, click **Project Settings** (the gear icon at the bottom left).
2. Click **API Keys** (or **API**).
3. Copy these two values:
   - **Project URL** (looks like `https://abcdefghijklmno.supabase.co`)
   - **Publishable Key** (or legacy **anon / public** key)

> **Security Note:** Never paste your `service_role` secret key into frontend files or `VITE_` variables. Only use the **Publishable / anon** key on the frontend.

---

## Step 3: Add Credentials Locally (Vite `.env.local`)

1. In the **project root** (the same folder as `package.json`), create a new file named `.env.local`.
2. Paste the following lines into `.env.local`:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

3. **Replace the placeholder values** (`YOUR_SUPABASE_PROJECT_URL` and `YOUR_SUPABASE_PUBLISHABLE_KEY`) with your actual values from Step 2.
4. Note: `.env.local` is listed in `.gitignore`, so your keys will not be committed to Git.
5. **Restart your development server** (`npm run dev`) after saving `.env.local` so Vite loads the new variables.

---

## Step 4: Deploying on Netlify

If you deploy FS SHOP on Netlify:

1. Open your site in the **Netlify Dashboard**.
2. Go to **Site configuration** → **Environment variables**.
3. Click **Add a variable** and add both:
   - Key: `VITE_SUPABASE_URL` → Value: your Supabase Project URL
   - Key: `VITE_SUPABASE_ANON_KEY` → Value: your Supabase Publishable (anon) Key
4. Trigger a **redeploy** (**Deploys** → **Trigger deploy** → **Clear cache and deploy site**) so the production build includes your environment variables.

---

## Step 5: Test Order Submission

1. Open your FS SHOP website.
2. Click **SHOP NOW** on any laptop, mouse, keyboard, or accessory.
3. Click **ORDER NOW**, fill in **Customer Name**, **Complete Delivery Address**, and **Contact Number**, and click **SUBMIT ORDER**.
4. Verify in **Supabase Dashboard → Table Editor → `orders`** that the new order row appears with `order_status = 'Pending'`.
