import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import {
  AccessoryProduct,
  BrandName,
  CatalogProductRecord,
  Laptop,
  ProductCategoryType,
} from '../types/laptop';
import { BRANDS, formatPkr } from '../data/laptops';
import { deleteCatalogUpdate, saveCatalogUpdates } from '../lib/supabase';
import { getDefaultAccessoryImage, getDefaultLaptopImage } from '../lib/catalog';

interface PriceEditorModalProps {
  open: boolean;
  laptops: Laptop[];
  accessories: AccessoryProduct[];
  customRecordIds: Set<string>;
  onClose: () => void;
  onCatalogUpdated: (items: CatalogProductRecord[]) => void;
  onCatalogDeleted: (params: { id?: string; resetAllDefaults?: boolean }) => void;
}

type ModalTab = 'edit' | 'add';
type DeptFilter = 'all' | ProductCategoryType;

interface EditDraft {
  pricePkr: string;
  originalPricePkr: string;
  availability: string;
  description: string;
}

const LAPTOP_AVAILABILITY_OPTIONS = [
  'Available · Confirm Stock on Order',
  'Pre-Order · Confirm ETA',
] as const;

const ACCESSORY_AVAILABILITY_OPTIONS = [
  'In Stock · Ready to Ship',
  'Available · Confirm Stock on Order',
] as const;

const SUBTYPE_SUGGESTIONS: Record<Exclude<ProductCategoryType, 'Laptops'>, string[]> = {
  'Mouse Collection': [
    'Wireless Mouse',
    'Gaming Mouse',
    'Bluetooth Mouse',
    'USB Mouse',
    'RGB Gaming Mouse',
    'HP Mouse',
    'Dell Mouse',
    'Logitech Mouse',
    'Lenovo Mouse',
  ],
  'Keyboard Collection': [
    'Mechanical Keyboard',
    'Wireless Keyboard',
    'RGB Gaming Keyboard',
    'USB Keyboard',
    'Bluetooth Keyboard',
    'HP Keyboard',
    'Dell Keyboard',
    'Logitech Keyboard',
    'Lenovo Keyboard',
  ],
  'Other Accessories': [
    'Laptop Bags',
    'Laptop Chargers',
    'Cooling Pads',
    'Headphones',
    'USB Hubs',
    'Mouse Pads',
    'Laptop Stands',
  ],
};

function slugifyId(text: string): string {
  const base = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  const suffix = Date.now().toString(36).slice(-5);
  return `${base || 'item'}-${suffix}`;
}

export const PriceEditorModal: React.FC<PriceEditorModalProps> = ({
  open,
  laptops,
  accessories,
  customRecordIds,
  onClose,
  onCatalogUpdated,
  onCatalogDeleted,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('edit');
  const [deptFilter, setDeptFilter] = useState<DeptFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [drafts, setDrafts] = useState<Record<string, EditDraft>>({});
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set());

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Add New Product Form State
  const [newCategory, setNewCategory] = useState<ProductCategoryType>('Laptops');
  const [newBrand, setNewBrand] = useState<string>('HP');
  const [newSubType, setNewSubType] = useState<string>('Wireless Mouse');
  const [newName, setNewName] = useState<string>('');
  const [newPrice, setNewPrice] = useState<string>('');
  const [newOriginalPrice, setNewOriginalPrice] = useState<string>('');
  const [newAvailability, setNewAvailability] = useState<string>(
    'Available · Confirm Stock on Order'
  );
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newProcessor, setNewProcessor] = useState<string>('');
  const [newRam, setNewRam] = useState<string>('');
  const [newStorage, setNewStorage] = useState<string>('');
  const [newDisplay, setNewDisplay] = useState<string>('');
  const [newGraphics, setNewGraphics] = useState<string>('');
  const [newHighlight1, setNewHighlight1] = useState<string>('');
  const [newHighlight2, setNewHighlight2] = useState<string>('');

  // Sync drafts whenever modal opens or catalog items refresh
  useEffect(() => {
    if (!open) return;
    const nextDrafts: Record<string, EditDraft> = {};
    for (const item of laptops) {
      nextDrafts[item.id] = {
        pricePkr: String(item.pricePkr),
        originalPricePkr: item.originalPricePkr ? String(item.originalPricePkr) : '',
        availability: item.availability,
        description: item.description,
      };
    }
    for (const acc of accessories) {
      nextDrafts[acc.id] = {
        pricePkr: String(acc.pricePkr),
        originalPricePkr: acc.originalPricePkr ? String(acc.originalPricePkr) : '',
        availability: acc.availability,
        description: acc.description,
      };
    }
    setDrafts(nextDrafts);
    setDirtyIds(new Set());
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [open, laptops, accessories]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !saving) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, saving, onClose]);

  const combinedProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const list = [
      ...laptops.map((l) => ({
        kind: 'laptop' as const,
        id: l.id,
        category: 'Laptops' as const,
        subType: undefined as string | undefined,
        brand: l.brand,
        model: l.model,
        name: l.name,
        pricePkr: l.pricePkr,
        originalPricePkr: l.originalPricePkr,
        availability: l.availability,
        image: l.image,
        description: l.description,
        specs: l.specs as unknown as Record<string, string>,
        collections: l.collections as string[],
        highlights: undefined,
      })),
      ...accessories.map((a) => ({
        kind: 'accessory' as const,
        id: a.id,
        category: a.category,
        subType: a.subType as string | undefined,
        brand: a.brand,
        model: undefined as string | undefined,
        name: a.name,
        pricePkr: a.pricePkr,
        originalPricePkr: a.originalPricePkr,
        availability: a.availability,
        image: a.image,
        description: a.description,
        specs: undefined,
        collections: undefined,
        highlights: a.highlights,
      })),
    ];

    return list.filter((item) => {
      if (deptFilter !== 'all' && item.category !== deptFilter) return false;
      if (!query) return true;
      return `${item.brand} ${item.name} ${item.category} ${item.subType || ''}`
        .toLowerCase()
        .includes(query);
    });
  }, [laptops, accessories, deptFilter, searchTerm]);

  if (!open) return null;

  const updateDraftField = (id: string, patch: Partial<EditDraft>) => {
    setDrafts((prev) => {
      const current = prev[id] || {
        pricePkr: '',
        originalPricePkr: '',
        availability: 'Available · Confirm Stock on Order',
        description: '',
      };
      return { ...prev, [id]: { ...current, ...patch } };
    });
    setDirtyIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSaveEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    if (dirtyIds.size === 0) {
      setErrorMsg('Change at least one product price, stock status, or description first.');
      return;
    }

    const recordsToSave: CatalogProductRecord[] = [];
    for (const item of combinedProducts) {
      if (!dirtyIds.has(item.id)) continue;
      const draft = drafts[item.id];
      if (!draft) continue;

      const parsedPrice = Math.round(Number(draft.pricePkr));
      if (!Number.isFinite(parsedPrice) || parsedPrice < 1) {
        setErrorMsg(`Please enter a valid PKR price for "${item.name}".`);
        return;
      }

      const trimmedOrig = draft.originalPricePkr.trim();
      const parsedOrig = trimmedOrig !== '' ? Math.round(Number(trimmedOrig)) : null;
      if (parsedOrig !== null && (!Number.isFinite(parsedOrig) || parsedOrig < 0)) {
        setErrorMsg(`Please enter a valid original price for "${item.name}".`);
        return;
      }

      recordsToSave.push({
        id: item.id,
        kind: item.kind,
        category: item.category,
        sub_type: item.subType ?? null,
        brand: item.brand,
        model: item.model ?? item.name,
        name: item.name,
        price_pkr: parsedPrice,
        original_price_pkr: parsedOrig && parsedOrig > 0 ? parsedOrig : null,
        availability: draft.availability,
        image_url: customRecordIds.has(item.id) ? item.image : null,
        description: draft.description.trim() || item.description,
        specs: item.specs ?? null,
        highlights: item.highlights ?? null,
        collections: item.collections ?? null,
        is_custom: customRecordIds.has(item.id),
      });
    }

    if (recordsToSave.length === 0) {
      setErrorMsg('No matching modified items in view. Clear search/filter or edit a product.');
      return;
    }

    setSaving(true);
    try {
      const result = await saveCatalogUpdates(recordsToSave);
      if (!result.saved) {
        setErrorMsg(
          result.error || 'Could not save updates to Supabase. Please check your configuration.'
        );
        return;
      }
      onCatalogUpdated(result.items || recordsToSave);
      setDirtyIds(new Set());
      setSuccessMsg(
        `Saved ${recordsToSave.length} product update${recordsToSave.length > 1 ? 's' : ''} to Supabase. All visitors will now see the updated catalog.`
      );
    } catch {
      setErrorMsg('Unexpected network error while saving updates to Supabase.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCustomProduct = async (id: string, name: string) => {
    if (saving || deletingId) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setDeletingId(id);

    try {
      const result = await deleteCatalogUpdate({ id });
      if (!result.saved) {
        setErrorMsg(result.error || `Could not delete "${name}" from Supabase.`);
        return;
      }
      onCatalogDeleted({ id });
      setSuccessMsg(`Deleted "${name}" from Supabase.`);
    } catch {
      setErrorMsg('Unexpected error while deleting product from Supabase.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleResetDefaults = async () => {
    if (saving) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setSaving(true);
    try {
      const result = await deleteCatalogUpdate({ resetAllDefaults: true });
      if (!result.saved) {
        setErrorMsg(
          result.error || 'Could not reset default prices in Supabase.'
        );
        return;
      }
      onCatalogDeleted({ resetAllDefaults: true });
      setDirtyIds(new Set());
      setSuccessMsg('Reset all default catalog prices and descriptions in Supabase.');
    } catch {
      setErrorMsg('Unexpected error while resetting catalog prices.');
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryChange = (nextCat: ProductCategoryType) => {
    setNewCategory(nextCat);
    if (nextCat === 'Laptops') {
      setNewBrand('HP');
      setNewAvailability('Available · Confirm Stock on Order');
    } else {
      setNewBrand('Logitech');
      setNewSubType(SUBTYPE_SUGGESTIONS[nextCat][0]);
      setNewAvailability('In Stock · Ready to Ship');
    }
  };

  const handleAddNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedName = newName.trim();
    const trimmedBrand = newBrand.trim();
    const parsedPrice = Math.round(Number(newPrice));
    const trimmedOrig = newOriginalPrice.trim();
    const parsedOrig = trimmedOrig !== '' ? Math.round(Number(trimmedOrig)) : null;

    if (trimmedBrand.length < 1) {
      setErrorMsg('Please enter a brand name.');
      return;
    }
    if (trimmedName.length < 2) {
      setErrorMsg('Please enter a product name or model (at least 2 characters).');
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice < 1) {
      setErrorMsg('Please enter a valid selling price in PKR.');
      return;
    }
    if (parsedOrig !== null && (!Number.isFinite(parsedOrig) || parsedOrig < 0)) {
      setErrorMsg('Original price must be a valid positive number.');
      return;
    }

    const trimmedImg = newImageUrl.trim();
    if (trimmedImg && !/^https?:\/\//i.test(trimmedImg)) {
      setErrorMsg('Optional Image URL must start with https:// or http:// (or leave blank for studio default).');
      return;
    }

    const isLaptop = newCategory === 'Laptops';
    const recordId = slugifyId(`${trimmedBrand}-${trimmedName}`);
    const fallbackImg = isLaptop
      ? getDefaultLaptopImage(trimmedBrand)
      : getDefaultAccessoryImage(newCategory, newSubType);

    const newRecord: CatalogProductRecord = isLaptop
      ? {
          id: recordId,
          kind: 'laptop',
          category: 'Laptops',
          sub_type: null,
          brand: trimmedBrand as BrandName,
          model: trimmedName,
          name: trimmedName.toLowerCase().startsWith(trimmedBrand.toLowerCase())
            ? trimmedName
            : `${trimmedBrand} ${trimmedName}`,
          price_pkr: parsedPrice,
          original_price_pkr: parsedOrig && parsedOrig > 0 ? parsedOrig : null,
          availability: newAvailability,
          image_url: trimmedImg || fallbackImg,
          description:
            newDescription.trim() ||
            `${trimmedBrand} ${trimmedName} available at FS SHOP Pakistan with verified stock and nationwide delivery.`,
          specs: {
            processor: newProcessor.trim() || 'Intel Core / Apple Silicon',
            ram: newRam.trim() || '16 GB RAM',
            storage: newStorage.trim() || '512 GB NVMe SSD',
            display: newDisplay.trim() || '14" – 15.6" Full HD IPS',
            graphics: newGraphics.trim() || 'Integrated / Dedicated GPU',
            battery: 'Up to 10 Hours',
            weight: '1.4 kg',
            os: trimmedBrand === 'Apple MacBook' ? 'macOS' : 'Windows 11 Pro',
          },
          highlights: null,
          collections: ['latest-arrivals'],
          is_custom: true,
        }
      : {
          id: recordId,
          kind: 'accessory',
          category: newCategory,
          sub_type: newSubType.trim() || newCategory,
          brand: trimmedBrand,
          model: trimmedName,
          name: trimmedName,
          price_pkr: parsedPrice,
          original_price_pkr: parsedOrig && parsedOrig > 0 ? parsedOrig : null,
          availability: newAvailability,
          image_url: trimmedImg || fallbackImg,
          description:
            newDescription.trim() ||
            `${trimmedBrand} ${trimmedName} available at FS SHOP Pakistan with nationwide cash on delivery.`,
          specs: null,
          highlights: [
            { label: 'Category', value: newSubType.trim() || newCategory },
            { label: 'Brand', value: trimmedBrand },
            ...(newHighlight1.trim()
              ? [{ label: 'Feature', value: newHighlight1.trim() }]
              : []),
            ...(newHighlight2.trim()
              ? [{ label: 'Compatibility', value: newHighlight2.trim() }]
              : [{ label: 'Delivery', value: 'Nationwide Pakistan' }]),
          ],
          collections: null,
          is_custom: true,
        };

    setSaving(true);
    try {
      const result = await saveCatalogUpdates([newRecord]);
      if (!result.saved) {
        setErrorMsg(
          result.error || 'Could not add product to Supabase. Check your database setup.'
        );
        return;
      }
      onCatalogUpdated(result.items || [newRecord]);
      setSuccessMsg(
        `"${newRecord.name}" was saved to Supabase and added to the live storefront!`
      );
      setNewName('');
      setNewPrice('');
      setNewOriginalPrice('');
      setNewImageUrl('');
      setNewDescription('');
      setNewProcessor('');
      setNewRam('');
      setNewStorage('');
      setNewDisplay('');
      setNewGraphics('');
      setNewHighlight1('');
      setNewHighlight2('');
    } catch {
      setErrorMsg('Unexpected network error while adding product to Supabase.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Manage Catalog and Prices"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#040812]/80 backdrop-blur-sm"
      onClick={() => {
        if (!saving) onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[92dvh] overscroll-contain flex flex-col bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-slate-100 bg-white">
          <div className="min-w-0">
            <h2 className="font-display font-bold text-base sm:text-lg text-[#090D16]">
              FS SHOP Store Manager (Supabase Live)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Add new products or edit PKR prices, stock &amp; descriptions for all visitors.
            </p>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            aria-label="Close store manager"
            className="w-10 h-10 sm:w-9 sm:h-9 shrink-0 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div className="px-4 sm:px-6 py-3 bg-[#F8FAFC] border-b border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('edit');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`min-h-[42px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-[#0A1328] text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-[#2563EB]/40'
            }`}
          >
            Edit Existing ({combinedProducts.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('add');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`min-h-[42px] px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'add'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-[#2563EB]/40'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Feedback Banners */}
        {(errorMsg || successMsg) && (
          <div className="px-4 sm:px-6 pt-3">
            {errorMsg && (
              <div
                role="alert"
                className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-900"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div
                role="status"
                className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 1: Edit Existing Products */}
        {activeTab === 'edit' && (
          <form onSubmit={handleSaveEdits} className="flex-1 flex flex-col min-h-0">
            <div className="px-4 sm:px-6 pt-4 pb-3 space-y-3 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search product name, brand, or category..."
                  className="w-full h-11 sm:h-10 pl-9 pr-3 rounded-lg border border-slate-300 bg-white text-base sm:text-sm text-[#090D16] focus:outline-none focus:border-[#2563EB]"
                />
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { key: 'all', label: 'All' },
                    { key: 'Laptops', label: 'Laptops' },
                    { key: 'Mouse Collection', label: 'Mouse' },
                    { key: 'Keyboard Collection', label: 'Keyboards' },
                    { key: 'Other Accessories', label: 'Accessories' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setDeptFilter(tab.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      deptFilter === tab.key
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-[#F8FAFC] text-slate-700 border border-slate-200 hover:border-[#2563EB]/40'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {combinedProducts.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-500">
                  No products match &ldquo;{searchTerm}&rdquo;.
                </div>
              ) : (
                combinedProducts.map((item) => {
                  const draft = drafts[item.id] || {
                    pricePkr: String(item.pricePkr),
                    originalPricePkr: item.originalPricePkr ? String(item.originalPricePkr) : '',
                    availability: item.availability,
                    description: item.description,
                  };
                  const isDirty = dirtyIds.has(item.id);
                  const isCustom = customRecordIds.has(item.id);
                  const availOptions =
                    item.kind === 'laptop'
                      ? LAPTOP_AVAILABILITY_OPTIONS
                      : ACCESSORY_AVAILABILITY_OPTIONS;

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 sm:p-4 rounded-xl border space-y-3 ${
                        isDirty
                          ? 'bg-blue-50/40 border-[#2563EB]/50'
                          : 'bg-[#F8FAFC] border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                            <span className="text-[#2563EB]">
                              {item.brand} · {item.subType || item.category}
                            </span>
                            {isCustom && (
                              <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                Added Item
                              </span>
                            )}
                            {isDirty && (
                              <span className="text-[#2563EB] bg-blue-100 px-1.5 py-0.5 rounded">
                                Modified
                              </span>
                            )}
                          </div>
                          <div className="text-sm font-semibold text-[#090D16] mt-0.5">
                            {item.name}
                          </div>
                          <div className="text-xs text-slate-500 font-mono tabular-nums">
                            Live Price: {formatPkr(item.pricePkr)}
                          </div>
                        </div>

                        {isCustom && (
                          <button
                            type="button"
                            disabled={saving || deletingId === item.id}
                            onClick={() => handleDeleteCustomProduct(item.id, item.name)}
                            className="min-h-[38px] px-2.5 py-1.5 rounded-lg border border-red-200 bg-white text-red-700 hover:bg-red-50 text-xs font-semibold inline-flex items-center gap-1 shrink-0 cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{deletingId === item.id ? 'Deleting...' : 'Delete'}</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Selling Price (PKR)
                          </label>
                          <input
                            type="number"
                            inputMode="numeric"
                            min={1}
                            step={1}
                            value={draft.pricePkr}
                            onChange={(e) =>
                              updateDraftField(item.id, { pricePkr: e.target.value })
                            }
                            className="w-full h-11 sm:h-9 px-3 rounded-lg border border-slate-300 bg-white text-base sm:text-xs font-mono tabular-nums text-[#090D16] focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Original Price (Optional)
                          </label>
                          <input
                            type="number"
                            inputMode="numeric"
                            min={0}
                            step={1}
                            value={draft.originalPricePkr}
                            onChange={(e) =>
                              updateDraftField(item.id, { originalPricePkr: e.target.value })
                            }
                            placeholder="None"
                            className="w-full h-11 sm:h-9 px-3 rounded-lg border border-slate-300 bg-white text-base sm:text-xs font-mono tabular-nums text-[#090D16] focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Stock Status
                          </label>
                          <select
                            value={draft.availability}
                            onChange={(e) =>
                              updateDraftField(item.id, { availability: e.target.value })
                            }
                            className="w-full h-11 sm:h-9 px-2.5 rounded-lg border border-slate-300 bg-white text-base sm:text-xs text-[#090D16] focus:outline-none focus:border-[#2563EB]"
                          >
                            {availOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Product Description
                        </label>
                        <textarea
                          rows={2}
                          value={draft.description}
                          onChange={(e) =>
                            updateDraftField(item.id, { description: e.target.value })
                          }
                          className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-base sm:text-xs text-[#090D16] focus:outline-none focus:border-[#2563EB] resize-y"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-4 sm:px-6 py-3.5 bg-white border-t border-slate-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <button
                type="button"
                disabled={saving}
                onClick={handleResetDefaults}
                className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default Prices</span>
              </button>

              <button
                type="submit"
                disabled={saving}
                className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>
                  {saving
                    ? 'SAVING TO SUPABASE...'
                    : `Save ${dirtyIds.size > 0 ? `${dirtyIds.size} ` : ''}Updates to Supabase`}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Add New Product */}
        {activeTab === 'add' && (
          <form onSubmit={handleAddNewProduct} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    1. Product Department
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) =>
                      handleCategoryChange(e.target.value as ProductCategoryType)
                    }
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-base sm:text-sm text-[#090D16] focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="Laptops">Laptops</option>
                    <option value="Mouse Collection">Mouse Collection</option>
                    <option value="Keyboard Collection">Keyboard Collection</option>
                    <option value="Other Accessories">Other Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    2. Brand
                  </label>
                  {newCategory === 'Laptops' ? (
                    <select
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-base sm:text-sm text-[#090D16] focus:outline-none focus:border-[#2563EB]"
                    >
                      {BRANDS.map((b) => (
                        <option key={b.name} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      placeholder="e.g. Logitech, HP, Dell, Anker"
                      className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-base sm:text-sm text-[#090D16] focus:outline-none focus:border-[#2563EB]"
                    />
                  )}
                </div>
              </div>

              {newCategory !== 'Laptops' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Accessory Sub-Type
                  </label>
                  <select
                    value={newSubType}
                    onChange={(e) => setNewSubType(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-base sm:text-sm text-[#090D16] focus:outline-none focus:border-[#2563EB]"
                  >
                    {SUBTYPE_SUGGESTIONS[newCategory].map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  3. Product Model / Title
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={
                    newCategory === 'Laptops'
                      ? 'e.g. HP Spectre x360 14 OLED'
                      : 'e.g. Logitech G Pro X Wireless Mouse'
                  }
                  className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-base sm:text-sm text-[#090D16] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    4. Selling Price (PKR)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    required
                    min={1}
                    step={1}
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="e.g. 125000"
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-base sm:text-sm font-mono tabular-nums text-[#090D16] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(e.target.value)}
                    placeholder="Optional cut price"
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-base sm:text-sm font-mono tabular-nums text-[#090D16] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Stock Status
                  </label>
                  <select
                    value={newAvailability}
                    onChange={(e) => setNewAvailability(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-base sm:text-sm text-[#090D16] focus:outline-none focus:border-[#2563EB]"
                  >
                    {(newCategory === 'Laptops'
                      ? LAPTOP_AVAILABILITY_OPTIONS
                      : ACCESSORY_AVAILABILITY_OPTIONS
                    ).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Image URL (Optional — uses studio photo automatically if left blank)
                </label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://... (optional)"
                  className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-base sm:text-sm text-[#090D16] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Write key product details, condition, warranty, and highlights..."
                  className="w-full p-3 rounded-lg border border-slate-300 bg-white text-base sm:text-sm text-[#090D16] focus:outline-none focus:border-[#2563EB] resize-y"
                />
              </div>

              {newCategory === 'Laptops' ? (
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3">
                  <div className="text-xs font-semibold text-slate-700">
                    Laptop Specifications (Optional)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newProcessor}
                      onChange={(e) => setNewProcessor(e.target.value)}
                      placeholder="Processor (e.g. Intel Core i7 13th Gen)"
                      className="w-full h-11 sm:h-10 px-3 rounded-lg border border-slate-300 bg-white text-base sm:text-xs text-[#090D16]"
                    />
                    <input
                      type="text"
                      value={newRam}
                      onChange={(e) => setNewRam(e.target.value)}
                      placeholder="RAM (e.g. 16 GB DDR5)"
                      className="w-full h-11 sm:h-10 px-3 rounded-lg border border-slate-300 bg-white text-base sm:text-xs text-[#090D16]"
                    />
                    <input
                      type="text"
                      value={newStorage}
                      onChange={(e) => setNewStorage(e.target.value)}
                      placeholder="Storage (e.g. 512 GB NVMe SSD)"
                      className="w-full h-11 sm:h-10 px-3 rounded-lg border border-slate-300 bg-white text-base sm:text-xs text-[#090D16]"
                    />
                    <input
                      type="text"
                      value={newDisplay}
                      onChange={(e) => setNewDisplay(e.target.value)}
                      placeholder="Display (e.g. 14&quot; FHD IPS)"
                      className="w-full h-11 sm:h-10 px-3 rounded-lg border border-slate-300 bg-white text-base sm:text-xs text-[#090D16]"
                    />
                    <input
                      type="text"
                      value={newGraphics}
                      onChange={(e) => setNewGraphics(e.target.value)}
                      placeholder="Graphics (e.g. Intel Iris Xe / RTX 4060)"
                      className="sm:col-span-2 w-full h-11 sm:h-10 px-3 rounded-lg border border-slate-300 bg-white text-base sm:text-xs text-[#090D16]"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-3">
                  <div className="text-xs font-semibold text-slate-700">
                    Accessory Highlights (Optional)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newHighlight1}
                      onChange={(e) => setNewHighlight1(e.target.value)}
                      placeholder="Feature (e.g. Bluetooth + 2.4GHz Wireless)"
                      className="w-full h-11 sm:h-10 px-3 rounded-lg border border-slate-300 bg-white text-base sm:text-xs text-[#090D16]"
                    />
                    <input
                      type="text"
                      value={newHighlight2}
                      onChange={(e) => setNewHighlight2(e.target.value)}
                      placeholder="Compatibility (e.g. Windows, macOS, Laptop)"
                      className="w-full h-11 sm:h-10 px-3 rounded-lg border border-slate-300 bg-white text-base sm:text-xs text-[#090D16]"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 sm:px-6 py-3.5 bg-white border-t border-slate-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={saving}
                onClick={onClose}
                className="min-h-[44px] px-4 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={saving}
                className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{saving ? 'ADDING TO SUPABASE...' : 'Add Product to Supabase'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
