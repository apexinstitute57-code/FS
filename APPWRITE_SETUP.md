# FS SHOP – Appwrite Connection Guide (Step-by-Step)

Follow these simple steps to connect **FS SHOP** to your **Appwrite** database so every laptop, mouse, keyboard, and accessory order is saved directly in Appwrite.

---

## Step 1: Create an Appwrite Project & Register Your Web Platform

1. Log in to [Appwrite Cloud](https://cloud.appwrite.io) (or your self-hosted Appwrite Console).
2. Click **Create project** and name it **FS SHOP**.
3. Copy your **Project ID** and **API Endpoint** (for Appwrite Cloud, usually `https://cloud.appwrite.io/v1` or region-specific e.g. `https://fra.cloud.appwrite.io/v1`).
4. On the project **Overview** page, click **Add a platform** → **Web**:
   - Add `localhost` for local testing.
   - Add your live domain (for example, your AI Studio or Netlify URL) so browser requests are allowed by CORS.

---

## Step 2: Create the `orders` Database & Collection

1. In the left sidebar, open **Databases** → click **Create database** → name it `fs_shop_db` (copy the **Database ID**).
2. Inside `fs_shop_db`, click **Create collection** (or **Create table**) → name it `orders` (copy the **Collection ID**).
3. Open the **Attributes** (or **Columns**) tab of `orders` and create these exact attributes:

| Attribute Key      | Type     | Size / Options            | Required |
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

---

## Step 3: Set Secure Permissions on `orders`

1. Go to the **Settings** tab of your `orders` collection → **Permissions**.
2. Add the **Any** role (`Role: Any`) and check **ONLY** `Create`!
3. Leave `Read`, `Update`, and `Delete` **UNCHECKED** for `Any` so anonymous shoppers can submit new orders without logging in, while customer names, phone numbers, and delivery addresses remain private to you in the Appwrite Console.

*(Optional server-side alternative: If you prefer keeping permissions completely private and saving via `server.ts`, create an Appwrite API Key with `documents.write` scope and set `APPWRITE_API_KEY` on the server—never put `APPWRITE_API_KEY` in `VITE_*` variables.)*

---

## Step 4: Add Environment Variables to `.env.local`

Create a file named `.env.local` in the project root (next to `package.json`) and paste:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=YOUR_APPWRITE_PROJECT_ID
VITE_APPWRITE_DATABASE_ID=YOUR_APPWRITE_DATABASE_ID
VITE_APPWRITE_COLLECTION_ID=YOUR_APPWRITE_COLLECTION_ID
```

Replace the placeholder values with your real Appwrite IDs, then **restart your development server** (`npm run dev`).

### Deploying on Netlify / Vercel
Add the same four `VITE_APPWRITE_*` variables in **Site Configuration → Environment Variables**, then trigger a redeploy.
