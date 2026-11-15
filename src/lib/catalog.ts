import { IMAGES } from '../data/laptops';
import { ACCESSORY_IMAGES } from '../data/accessories';
import {
  AccessoryProduct,
  BrandName,
  CatalogProductRecord,
  Laptop,
  SpecialCollectionKey,
} from '../types/laptop';

const BRAND_DEFAULT_IMAGES: Record<BrandName, string> = {
  HP: IMAGES.hpElitebook,
  Dell: IMAGES.dellXps,
  Lenovo: IMAGES.lenovoThinkpad,
  'Apple MacBook': IMAGES.macbookPro,
  Asus: IMAGES.asusRog,
  Acer: IMAGES.acerNitro,
  MSI: IMAGES.msiStealth,
  'Microsoft Surface': IMAGES.surfaceLaptop,
  Samsung: IMAGES.samsungGalaxyBook,
  Toshiba: IMAGES.toshibaDynabook,
};

export function getDefaultLaptopImage(brand: string): string {
  return BRAND_DEFAULT_IMAGES[brand as BrandName] || IMAGES.hpElitebook;
}

export function getDefaultAccessoryImage(
  category: AccessoryProduct['category'],
  subType?: string
): string {
  const lower = (subType || '').toLowerCase();
  if (category === 'Mouse Collection') {
    if (lower.includes('rgb') || lower.includes('gaming')) return ACCESSORY_IMAGES.mouseRgbGaming;
    if (lower.includes('bluetooth')) return ACCESSORY_IMAGES.mouseBluetoothSlim;
    if (lower.includes('usb')) return ACCESSORY_IMAGES.mouseUsbOptical;
    return ACCESSORY_IMAGES.mouseWirelessErgo;
  }
  if (category === 'Keyboard Collection') {
    if (lower.includes('rgb') || lower.includes('gaming')) return ACCESSORY_IMAGES.kbdRgbGaming;
    if (lower.includes('mechanical')) return ACCESSORY_IMAGES.kbdMechanicalPro;
    if (lower.includes('bluetooth')) return ACCESSORY_IMAGES.kbdBluetoothCompact;
    if (lower.includes('usb')) return ACCESSORY_IMAGES.kbdUsbOffice;
    return ACCESSORY_IMAGES.kbdWirelessSlim;
  }
  if (lower.includes('bag')) return ACCESSORY_IMAGES.accLaptopBag;
  if (lower.includes('charger')) return ACCESSORY_IMAGES.accLaptopCharger;
  if (lower.includes('cool')) return ACCESSORY_IMAGES.accCoolingPad;
  if (lower.includes('headphone')) return ACCESSORY_IMAGES.accHeadphones;
  if (lower.includes('hub') || lower.includes('usb')) return ACCESSORY_IMAGES.accUsbHub;
  if (lower.includes('pad')) return ACCESSORY_IMAGES.accMousePad;
  return ACCESSORY_IMAGES.accLaptopStand;
}

function normalizeLaptopAvailability(
  value?: string
): Laptop['availability'] {
  if (value && value.toLowerCase().includes('pre-order')) {
    return 'Pre-Order · Confirm ETA';
  }
  return 'Available · Confirm Stock on Order';
}

function normalizeAccessoryAvailability(
  value?: string
): AccessoryProduct['availability'] {
  if (value && value.toLowerCase().includes('confirm stock')) {
    return 'Available · Confirm Stock on Order';
  }
  return 'In Stock · Ready to Ship';
}

function isSafeImageSource(value?: string | null): value is string {
  if (!value) return false;
  const trimmed = value.trim();
  return (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('data:image/')
  );
}

export function mergeLaptopCatalog(
  baseLaptops: Laptop[],
  records: CatalogProductRecord[]
): Laptop[] {
  const byId = new Map<string, CatalogProductRecord>();
  for (const r of records) {
    if (r.kind === 'laptop') {
      byId.set(r.id, r);
    }
  }

  const mergedBase = baseLaptops.map((base) => {
    const rec = byId.get(base.id);
    if (!rec) return base;
    byId.delete(base.id);
    const nextImage = isSafeImageSource(rec.image_url) ? rec.image_url : base.image;
    return {
      ...base,
      brand: (rec.brand as BrandName) || base.brand,
      model: rec.model || base.model,
      name: rec.name || base.name,
      pricePkr: Number(rec.price_pkr) > 0 ? Math.round(Number(rec.price_pkr)) : base.pricePkr,
      originalPricePkr:
        rec.original_price_pkr && Number(rec.original_price_pkr) > 0
          ? Math.round(Number(rec.original_price_pkr))
          : rec.original_price_pkr === null
            ? undefined
            : base.originalPricePkr,
      availability: normalizeLaptopAvailability(rec.availability || base.availability),
      image: nextImage,
      gallery: [nextImage, ...base.gallery.slice(1)],
      description: rec.description || base.description,
      specs: rec.specs
        ? {
            processor: rec.specs.processor || base.specs.processor,
            ram: rec.specs.ram || base.specs.ram,
            storage: rec.specs.storage || base.specs.storage,
            display: rec.specs.display || base.specs.display,
            graphics: rec.specs.graphics || base.specs.graphics,
            battery: rec.specs.battery || base.specs.battery,
            weight: rec.specs.weight || base.specs.weight,
            os: rec.specs.os || base.specs.os,
          }
        : base.specs,
    };
  });

  const customLaptops: Laptop[] = [];
  for (const rec of byId.values()) {
    const fallbackImg = getDefaultLaptopImage(rec.brand);
    const img = isSafeImageSource(rec.image_url) ? rec.image_url : fallbackImg;
    const validCollections = (rec.collections || []).filter(
      (c): c is Exclude<SpecialCollectionKey, 'all'> =>
        c !== 'all' &&
        [
          'best-selling',
          'latest-arrivals',
          'budget-friendly',
          'gaming',
          'business',
          'student',
          'premium-macbooks',
          'special-discounts',
        ].includes(c)
    );

    customLaptops.push({
      id: rec.id,
      category: 'Laptops',
      brand: (rec.brand as BrandName) || 'HP',
      model: rec.model || rec.name,
      name: rec.name,
      pricePkr: Math.round(Number(rec.price_pkr)),
      originalPricePkr:
        rec.original_price_pkr && Number(rec.original_price_pkr) > 0
          ? Math.round(Number(rec.original_price_pkr))
          : undefined,
      availability: normalizeLaptopAvailability(rec.availability),
      image: img,
      gallery: [img],
      description:
        rec.description ||
        `${rec.brand} ${rec.model || rec.name} available at FS SHOP Pakistan with direct warranty support.`,
      specs: {
        processor: rec.specs?.processor || 'Intel / Apple Silicon Processor',
        ram: rec.specs?.ram || '16 GB RAM',
        storage: rec.specs?.storage || '512 GB NVMe SSD',
        display: rec.specs?.display || '14" – 15.6" Full HD IPS',
        graphics: rec.specs?.graphics || 'Integrated / Dedicated Graphics',
        battery: rec.specs?.battery || 'Up to 10 Hours',
        weight: rec.specs?.weight || '1.4 kg',
        os: rec.specs?.os || 'Windows 11 Pro',
      },
      collections:
        validCollections.length > 0 ? validCollections : ['latest-arrivals'],
    });
  }

  return [...customLaptops, ...mergedBase];
}

export function mergeAccessoryCatalog(
  baseAccessories: AccessoryProduct[],
  records: CatalogProductRecord[],
  targetCategory: AccessoryProduct['category']
): AccessoryProduct[] {
  const byId = new Map<string, CatalogProductRecord>();
  for (const r of records) {
    if (r.kind === 'accessory' && r.category === targetCategory) {
      byId.set(r.id, r);
    }
  }

  const mergedBase = baseAccessories.map((base) => {
    const rec = byId.get(base.id);
    if (!rec) return base;
    byId.delete(base.id);
    const nextImage = isSafeImageSource(rec.image_url) ? rec.image_url : base.image;
    return {
      ...base,
      subType: rec.sub_type || base.subType,
      brand: rec.brand || base.brand,
      name: rec.name || base.name,
      pricePkr: Number(rec.price_pkr) > 0 ? Math.round(Number(rec.price_pkr)) : base.pricePkr,
      originalPricePkr:
        rec.original_price_pkr && Number(rec.original_price_pkr) > 0
          ? Math.round(Number(rec.original_price_pkr))
          : rec.original_price_pkr === null
            ? undefined
            : base.originalPricePkr,
      availability: normalizeAccessoryAvailability(rec.availability || base.availability),
      image: nextImage,
      gallery: [nextImage, ...base.gallery.slice(1)],
      description: rec.description || base.description,
      highlights:
        rec.highlights && rec.highlights.length > 0
          ? rec.highlights
          : base.highlights,
    };
  });

  const customItems: AccessoryProduct[] = [];
  for (const rec of byId.values()) {
    const subType = rec.sub_type || targetCategory;
    const fallbackImg = getDefaultAccessoryImage(targetCategory, subType);
    const img = isSafeImageSource(rec.image_url) ? rec.image_url : fallbackImg;
    customItems.push({
      id: rec.id,
      category: targetCategory,
      subType,
      brand: rec.brand,
      name: rec.name,
      pricePkr: Math.round(Number(rec.price_pkr)),
      originalPricePkr:
        rec.original_price_pkr && Number(rec.original_price_pkr) > 0
          ? Math.round(Number(rec.original_price_pkr))
          : undefined,
      availability: normalizeAccessoryAvailability(rec.availability),
      image: img,
      gallery: [img],
      description:
        rec.description ||
        `${rec.brand} ${rec.name} available at FS SHOP Pakistan with nationwide cash on delivery.`,
      highlights:
        rec.highlights && rec.highlights.length > 0
          ? rec.highlights
          : [
              { label: 'Brand', value: rec.brand },
              { label: 'Category', value: subType },
              { label: 'Warranty', value: 'FS SHOP Verified' },
              { label: 'Delivery', value: 'Nationwide Pakistan' },
            ],
    });
  }

  return [...customItems, ...mergedBase];
}
