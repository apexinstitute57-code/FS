import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Laptop as LaptopIcon,
  MessageCircle,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  X,
  ZoomIn,
} from 'lucide-react';
import { OrderableProduct } from '../types/laptop';
import {
  buildWhatsAppOrderUrl,
  formatPkr,
  getDiscountPercent,
} from '../data/laptops';
import { submitCustomerOrder } from '../lib/supabase';
import { BrandLogo } from './BrandLogo';

interface ProductModalProps {
  product: OrderableProduct | null;
  onClose: () => void;
}

type ModalStage = 'details' | 'order-form' | 'order-success';

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [stage, setStage] = useState<ModalStage>('details');
  const [activeImage, setActiveImage] = useState<string>('');
  const [zoomed, setZoomed] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // ONLY THREE CUSTOMER FIELDS
  const [customerName, setCustomerName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderId: string;
    orderDate: string;
    totalPkr: number;
  } | null>(null);

  useEffect(() => {
    if (product) {
      setStage('details');
      setActiveImage(product.item.image);
      setZoomed(false);
      setImgError(false);
      setQuantity(1);
      setErrorMessage(null);
      setConfirmedOrder(null);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [product, onClose]);

  if (!product) return null;

  const item = product.item;
  const isLaptop = product.kind === 'laptop';
  const discount = getDiscountPercent(item.pricePkr, item.originalPricePkr);
  const totalPkr = item.pricePkr * quantity;
  const galleryImages = item.gallery.length > 0 ? item.gallery : [item.image];

  const whatsappUrl = buildWhatsAppOrderUrl({
    product,
    quantity,
    customerName,
    deliveryAddress,
    contactNumber,
  });

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return; // Prevent duplicate submissions while processing
    setErrorMessage(null);

    if (customerName.trim().length < 2) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (deliveryAddress.trim().length < 5) {
      setErrorMessage('Please enter your complete delivery address.');
      return;
    }
    if (contactNumber.trim().length < 7) {
      setErrorMessage('Please enter a valid contact phone number (e.g. 03086421306).');
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitCustomerOrder({
        customerName,
        deliveryAddress,
        contactNumber,
        productName: item.name,
        productBrand: item.brand,
        productCategory: isLaptop ? 'Laptops' : product.item.category,
        productPrice: item.pricePkr,
        quantity,
      });

      if (!result.saved) {
        setErrorMessage(
          result.error ||
            'Unable to save your order to Supabase right now. Please try again or order via WhatsApp.'
        );
        return;
      }

      setConfirmedOrder({
        orderId: result.orderId || 'CONFIRMED',
        orderDate: result.orderDate || new Date().toISOString(),
        totalPkr: result.totalPkr ?? totalPkr,
      });
      setStage('order-success');
    } catch {
      setErrorMessage(
        'Unexpected error while submitting your order. Please try again or order via WhatsApp at 03086421306.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-[#040812]/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[92dvh] overscroll-contain overflow-y-auto bg-white rounded-2xl border border-slate-200 shadow-2xl"
      >
        {/* Sticky Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 sm:px-7 py-3.5 sm:py-4 bg-white/95 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center gap-3 min-w-0">
            {stage === 'order-form' && (
              <button
                type="button"
                onClick={() => {
                  setStage('details');
                  setErrorMessage(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#090D16] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Details</span>
              </button>
            )}
            {isLaptop ? (
              <BrandLogo brand={product.item.brand} tone="dark" />
            ) : (
              <span className="font-display font-semibold text-sm text-[#090D16]">
                {item.brand} · {product.item.subType}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close product dialog"
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:text-[#090D16] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 p-4 sm:p-8">
          {/* Left Column: Multi-Image Studio Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#0A1328] border border-slate-200">
              {imgError ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0A1328] to-[#1E3A8A] text-slate-200 gap-3 p-6 text-center">
                  {isLaptop ? (
                    <LaptopIcon className="w-12 h-12 text-[#60A5FA]" />
                  ) : (
                    <Package className="w-12 h-12 text-[#60A5FA]" />
                  )}
                  <span className="font-display font-semibold">{item.name}</span>
                </div>
              ) : (
                <img
                  src={activeImage || item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  onClick={() => setZoomed((z) => !z)}
                  className={`w-full h-full object-cover cursor-zoom-in transition-transform duration-300 ${
                    zoomed ? 'scale-125 cursor-zoom-out' : 'scale-100'
                  }`}
                />
              )}

              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                aria-label={zoomed ? 'Reset zoom' : 'Zoom product photo'}
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050914]/80 text-white text-xs font-medium hover:bg-[#050914] transition-colors cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>{zoomed ? 'Reset Zoom' : 'Zoom'}</span>
              </button>
            </div>

            {/* Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={`${imgUrl}-${idx}`}
                    type="button"
                    onClick={() => {
                      setActiveImage(imgUrl);
                      setImgError(false);
                      setZoomed(false);
                    }}
                    className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activeImage === imgUrl
                        ? 'border-[#2563EB] shadow-md'
                        : 'border-slate-200 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${item.name} view ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Selected Order Summary Card (visible in order-form stage) */}
            {stage !== 'details' && (
              <div className="rounded-xl bg-[#F8FAFC] border border-slate-200 p-4 space-y-2 text-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Order Summary
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-600">Product</span>
                  <span className="font-semibold text-[#090D16] text-right">{item.name}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-600">Brand / Category</span>
                  <span className="font-medium text-slate-800 text-right">
                    {item.brand} · {item.category}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-600">Unit Price</span>
                  <span className="font-mono tabular-nums text-slate-800">
                    {formatPkr(item.pricePkr)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-600">Quantity</span>
                  <span className="font-mono tabular-nums text-slate-800">{quantity}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between gap-4 font-bold text-base">
                  <span className="text-[#090D16]">Total Amount</span>
                  <span className="font-mono tabular-nums text-[#2563EB]">
                    {formatPkr(totalPkr)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Product Details OR 3-Field Order Form OR Confirmed Receipt */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            {stage === 'details' && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-medium text-[#2563EB]">
                    {item.brand} · {item.category} · {item.availability}
                  </p>
                  <h2
                    id="product-modal-title"
                    className="font-display font-bold text-2xl sm:text-3xl text-[#090D16] mt-1 leading-tight"
                  >
                    {item.name}
                  </h2>
                  <div className="mt-3 flex flex-wrap items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[#090D16]">
                      {formatPkr(item.pricePkr)}
                    </span>
                    {item.originalPricePkr && item.originalPricePkr > item.pricePkr && (
                      <>
                        <span className="text-sm text-slate-400 line-through font-mono tabular-nums">
                          {formatPkr(item.originalPricePkr)}
                        </span>
                        {discount && (
                          <span className="text-xs font-semibold text-[#2563EB]">
                            Save {discount}%
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>

                {/* Full Specifications Grid */}
                <div className="rounded-xl bg-[#F8FAFC] border border-slate-200 p-4">
                  <h3 className="font-display font-semibold text-sm text-[#090D16] mb-3">
                    {isLaptop ? 'Complete Technical Specifications' : 'Product Specifications'}
                  </h3>

                  {isLaptop ? (
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                      <div>
                        <dt className="text-slate-400">Processor</dt>
                        <dd className="font-semibold text-slate-900">
                          {product.item.specs.processor}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-400">Memory (RAM)</dt>
                        <dd className="font-semibold text-slate-900">{product.item.specs.ram}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-400">Storage</dt>
                        <dd className="font-semibold text-slate-900">
                          {product.item.specs.storage}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-400">Display</dt>
                        <dd className="font-semibold text-slate-900">
                          {product.item.specs.display}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-400">Graphics</dt>
                        <dd className="font-semibold text-slate-900">
                          {product.item.specs.graphics}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-400">Battery</dt>
                        <dd className="font-semibold text-slate-900">
                          {product.item.specs.battery}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-400">Weight</dt>
                        <dd className="font-semibold text-slate-900">
                          {product.item.specs.weight}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-400">Operating System</dt>
                        <dd className="font-semibold text-slate-900">{product.item.specs.os}</dd>
                      </div>
                    </dl>
                  ) : (
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                      {product.item.highlights.map((spec) => (
                        <div key={spec.label}>
                          <dt className="text-slate-400">{spec.label}</dt>
                          <dd className="font-semibold text-slate-900">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>

                {/* Quantity Stepper + Purchase Actions */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-slate-700">Quantity</span>
                    <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        aria-label="Decrease quantity"
                        className="w-10 h-10 inline-flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-l-lg cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-mono tabular-nums text-sm font-semibold text-[#090D16]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                        aria-label="Increase quantity"
                        className="w-10 h-10 inline-flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-r-lg cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setStage('order-form')}
                      className="h-12 px-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>ORDER NOW · {formatPkr(totalPkr)}</span>
                    </button>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 px-5 rounded-xl bg-[#0A1328] hover:bg-[#16254A] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      <span>Order via WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {stage === 'order-form' && (
              <form onSubmit={handleOrderSubmit} className="space-y-5">
                <div>
                  <p className="text-xs font-medium text-[#2563EB]">
                    Quick Direct Checkout · No Account Required
                  </p>
                  <h2
                    id="product-modal-title"
                    className="font-display font-bold text-2xl text-[#090D16] mt-1"
                  >
                    Complete Your Order
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Enter your name, delivery address, and phone number below. Our team will confirm
                    stock and arrange delivery.
                  </p>
                </div>

                {/* Quantity Quick Adjust */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
                  <span className="text-xs font-medium text-slate-700">Order Quantity</span>
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease order quantity"
                      className="w-10 h-10 sm:w-8 sm:h-8 inline-flex items-center justify-center rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-mono tabular-nums text-sm font-semibold">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                      aria-label="Increase order quantity"
                      className="w-10 h-10 sm:w-8 sm:h-8 inline-flex items-center justify-center rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* ONLY THREE CUSTOMER FIELDS */}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="fs-customer-name"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      1. Customer Name
                    </label>
                    <input
                      id="fs-customer-name"
                      type="text"
                      autoComplete="name"
                      required
                      disabled={submitting}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ali Raza"
                      className="w-full h-11 px-3.5 rounded-lg border border-slate-300 text-base sm:text-sm text-[#090D16] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="fs-delivery-address"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      2. Complete Delivery Address
                    </label>
                    <textarea
                      id="fs-delivery-address"
                      autoComplete="street-address"
                      required
                      disabled={submitting}
                      rows={3}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="House / Street, Sector / Block, City, Pakistan"
                      className="w-full p-3.5 rounded-lg border border-slate-300 text-base sm:text-sm text-[#090D16] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 resize-none disabled:bg-slate-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="fs-contact-number"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      3. Contact Number
                    </label>
                    <input
                      id="fs-contact-number"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      disabled={submitting}
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="e.g. 03086421306"
                      className="w-full h-11 px-3.5 rounded-lg border border-slate-300 text-base sm:text-sm text-[#090D16] font-mono focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 disabled:bg-slate-50"
                    />
                  </div>
                </div>

                {/* Real Error Alert (Never fake success) */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-900 space-y-2.5"
                  >
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <p className="leading-relaxed font-medium">{errorMessage}</p>
                    </div>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0A1328] text-white font-semibold hover:bg-[#16254A] transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>Send This Order via WhatsApp (03086421306)</span>
                    </a>
                  </div>
                )}

                <div className="space-y-2.5 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-12 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm tracking-wide transition-colors cursor-pointer"
                  >
                    {submitting ? 'SAVING ORDER TO SUPABASE...' : 'SUBMIT ORDER'}
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-11 rounded-xl border border-slate-300 hover:bg-slate-50 text-[#090D16] font-semibold text-xs inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#16A34A]" />
                    <span>Or Send Order Directly on WhatsApp</span>
                  </a>
                </div>
              </form>
            )}

            {stage === 'order-success' && confirmedOrder && (
              <div className="space-y-6 py-4">
                <div className="flex items-start gap-3.5">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-700">
                      Order Saved to Supabase
                    </p>
                    <h2
                      id="product-modal-title"
                      className="font-display font-bold text-2xl text-[#090D16] mt-0.5"
                    >
                      Thank You, {customerName}
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Your order has been recorded with FS SHOP. Fiza&apos;s team will contact you
                      at <span className="font-mono font-semibold">{contactNumber}</span> to confirm
                      stock and dispatch.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-[#F8FAFC] border border-slate-200 p-4 space-y-2 text-xs">
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 shrink-0">Order Reference</span>
                    <span className="font-mono font-semibold text-[#090D16] break-all text-right">
                      {confirmedOrder.orderId}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 shrink-0">Order Status</span>
                    <span className="font-semibold text-emerald-700 text-right">
                      Pending Confirmation
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 shrink-0">Order Date</span>
                    <span className="font-mono text-slate-800 text-right">
                      {new Date(confirmedOrder.orderDate).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 shrink-0">Delivery Address</span>
                    <span className="font-medium text-slate-800 text-right max-w-[65%] break-words">
                      {deliveryAddress}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3 pt-2 border-t border-slate-200 text-sm font-bold">
                    <span className="text-[#090D16]">Total Payable</span>
                    <span className="font-mono tabular-nums text-[#2563EB]">
                      {formatPkr(confirmedOrder.totalPkr)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 h-11 px-4 rounded-xl bg-[#0A1328] hover:bg-[#16254A] text-white font-semibold text-xs inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Share Receipt on WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-11 px-6 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-[#090D16] cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
