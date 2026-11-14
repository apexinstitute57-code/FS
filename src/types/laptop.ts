export type BrandName =
  | 'HP'
  | 'Dell'
  | 'Lenovo'
  | 'Apple MacBook'
  | 'Asus'
  | 'Acer'
  | 'MSI'
  | 'Microsoft Surface'
  | 'Samsung'
  | 'Toshiba';

export type ProductCategoryType =
  | 'Laptops'
  | 'Mouse Collection'
  | 'Keyboard Collection'
  | 'Other Accessories';

export type PriceTierKey =
  | 'all'
  | 'budget'
  | 'affordable'
  | 'mid-range'
  | 'premium'
  | 'high-end';

export type SpecialCollectionKey =
  | 'all'
  | 'best-selling'
  | 'latest-arrivals'
  | 'budget-friendly'
  | 'gaming'
  | 'business'
  | 'student'
  | 'premium-macbooks'
  | 'special-discounts';

export interface LaptopSpecs {
  processor: string;
  ram: string;
  storage: string;
  display: string;
  graphics: string;
  battery: string;
  weight: string;
  os: string;
}

export interface Laptop {
  id: string;
  category: 'Laptops';
  brand: BrandName;
  model: string;
  name: string;
  pricePkr: number;
  originalPricePkr?: number;
  availability: 'Available · Confirm Stock on Order' | 'Pre-Order · Confirm ETA';
  image: string;
  gallery: string[];
  description: string;
  specs: LaptopSpecs;
  collections: Exclude<SpecialCollectionKey, 'all'>[];
}

export interface AccessorySpec {
  label: string;
  value: string;
}

export interface AccessoryProduct {
  id: string;
  category: 'Mouse Collection' | 'Keyboard Collection' | 'Other Accessories';
  subType: string;
  brand: string;
  name: string;
  pricePkr: number;
  originalPricePkr?: number;
  availability: 'In Stock · Ready to Ship' | 'Available · Confirm Stock on Order';
  image: string;
  gallery: string[];
  description: string;
  highlights: AccessorySpec[];
}

export type OrderableProduct =
  | { kind: 'laptop'; item: Laptop }
  | { kind: 'accessory'; item: AccessoryProduct };

export interface BrandMeta {
  name: BrandName;
  tagline: string;
  featuredImage: string;
  origin: string;
}

export interface PriceCategoryMeta {
  key: Exclude<PriceTierKey, 'all'>;
  label: string;
  rangeLabel: string;
  minPkr: number;
  maxPkr: number | null;
  summary: string;
}

export interface OrderSubmissionResponse {
  saved: boolean;
  orderId?: string;
  orderDate?: string;
  totalPkr?: number;
  error?: string;
  code?: string;
}
