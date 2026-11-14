# FS SHOP – Appwrite, GitHub & Netlify Deployment Guide

This guide covers the exact setup for **Appwrite Database persistence**, **Netlify Functions (`/api/orders`)**, and **SPA routing (`_redirects`)** so every route and every order works reliably in production.

---

## 1. Appwrite Database & Collection Setup

1. Log in to [Appwrite Console](https://cloud.appwrite.io).
2. Create or open your **FS SHOP** project and copy:
   - **API Endpoint** (e.g. `https://cloud.appwrite.io/v1` or your region endpoint such as `https://fra.cloud.appwrite.io/v1`)
   - **Project ID**
3. Go to **Databases** → create database `fs_shop_db` (copy the **Database ID**).
4. Inside `fs_shop_db`, create collection (or table) `orders` (copy the **Collection ID** / **Table ID**).
5. Open **Attributes** (or **Columns**) on `orders` and create these exact fields:

| Attribute Key      | Type     | Size / Limits             | Required |
| ------------------ | -------- | ------------------------- | -------- |
| `customer_name`    | String   | 255                       | Yes      |
| `delivery_address` | String   | 1000                      | Yes      |
| `contact_number`   | String   | 50                        | Yes      |
| `product_name`     | String   | 255                       | Yes      |
| `product_brand`    | String   | 100                       | Yes      |
| `product_category` | String   | 100                       | Yes      |
| `product_price`    | Integer  | min `1`                   | Yes      |
| `quantity`         | Integer  | min `1`, max `50`         | Yes      |
| `total_price`      | Integer  | min `1`                   | Yes      |
| `order_status`     | String   | 50 (Default: `Pending`)   | No       |
| `created_at`       | String   | 64                        | Yes      |

6. Wait until every attribute status shows **Available** (green) in Appwrite.

---

## 2. Create a Secure Appwrite Server API Key (Recommended)

Using a server-side API key via **Netlify Functions** (`netlify/functions/orders.ts`) keeps customer orders private and prevents exposing secrets in browser code:

1. In Appwrite Console → **Overview → Integrations → API Keys → Create API Key**.
2. Name it `Netlify Orders Function`.
3. Under **Scopes**, check **Databases**:
   - `documents.write` (and `rows.write` if using TablesDB)
4. Copy the generated **API Key Secret**.
5. *(Optional for client fallback)*: Under **Overview → Platforms**, add your Netlify domain (e.g. `your-site.netlify.app`), and in `orders` → **Settings → Permissions**, optionally grant `Role: Any` → `Create` ONLY (leave `Read`, `Update`, `Delete` unchecked).

---

## 3. Push Changes to GitHub

From your project root:

```bash
git add .
git commit -m "Fix SPA redirects, React Router routes, and Netlify Function Appwrite orders"
git push origin main
```

---

## 4. Configure Netlify & Environment Variables

1. Open your site in **Netlify Dashboard** → **Site configuration → Build & deploy → Build settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions` (auto-detected from `netlify.toml`)
2. Go to **Site configuration → Environment variables → Add a variable** and add:

   | Key                      | Value                                            |
   | ------------------------ | ------------------------------------------------ |
   | `APPWRITE_ENDPOINT`      | `https://cloud.appwrite.io/v1` (or your region)  |
   | `APPWRITE_PROJECT_ID`    | Your Appwrite Project ID                         |
   | `APPWRITE_DATABASE_ID`   | Your Appwrite Database ID                        |
   | `APPWRITE_COLLECTION_ID` | Your `orders` Collection / Table ID              |
   | `APPWRITE_API_KEY`       | Your Appwrite Server API Key (secret)            |

   *(Do NOT prefix `APPWRITE_API_KEY` with `VITE_`. Only server-side Netlify Functions read `APPWRITE_API_KEY`.)*
3. Go to **Deploys → Trigger deploy → Clear cache and deploy site**.
4. After deployment finishes:
   - Visit `/laptops`, `/mouse-collection`, `/brands/apple-macbook`, or `/product/apple-macbook-pro-14-m3-pro` and refresh the browser — every route loads cleanly without Page Not Found.
   - Submit a test order — `POST /api/orders` runs `netlify/functions/orders.ts`, verifies the write in Appwrite, and shows confirmation only after Appwrite returns the saved document ID.
