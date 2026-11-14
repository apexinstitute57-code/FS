import React, { useState } from 'react';
import { RotateCcw, Save, X } from 'lucide-react';
import { Laptop } from '../types/laptop';
import { formatPkr } from '../data/laptops';

interface PriceEditorModalProps {
  open: boolean;
  laptops: Laptop[];
  onClose: () => void;
  onSavePrices: (updatedPrices: Record<string, { pricePkr: number; originalPricePkr?: number }>) => void;
  onResetPrices: () => void;
}

export const PriceEditorModal: React.FC<PriceEditorModalProps> = ({
  open,
  laptops,
  onClose,
  onSavePrices,
  onResetPrices,
}) => {
  const [drafts, setDrafts] = useState<Record<string, { pricePkr: string; originalPricePkr: string }>>(
    () =>
      Object.fromEntries(
        laptops.map((item) => [
          item.id,
          {
            pricePkr: String(item.pricePkr),
            originalPricePkr: item.originalPricePkr ? String(item.originalPricePkr) : '',
          },
        ])
      )
  );

  if (!open) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed: Record<string, { pricePkr: number; originalPricePkr?: number }> = {};
    for (const item of laptops) {
      const entry = drafts[item.id];
      const nextPrice = Number(entry?.pricePkr);
      const nextOrig = Number(entry?.originalPricePkr);
      parsed[item.id] = {
        pricePkr: Number.isFinite(nextPrice) && nextPrice > 0 ? Math.round(nextPrice) : item.pricePkr,
        originalPricePkr:
          Number.isFinite(nextOrig) && nextOrig > 0 ? Math.round(nextOrig) : undefined,
      };
    }
    onSavePrices(parsed);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit Product Prices"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040812]/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[86vh] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-display font-bold text-lg text-[#090D16]">
              FS SHOP Price Manager (PKR)
            </h2>
            <p className="text-xs text-slate-500">
              Update actual selling prices and original prices across the catalog.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close price editor"
            className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-3">
          {laptops.map((item) => {
            const draft = drafts[item.id] || {
              pricePkr: String(item.pricePkr),
              originalPricePkr: item.originalPricePkr ? String(item.originalPricePkr) : '',
            };
            return (
              <div
                key={item.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 rounded-xl bg-[#F8FAFC] border border-slate-200"
              >
                <div className="sm:col-span-6 min-w-0">
                  <div className="text-[11px] font-semibold text-[#2563EB]">{item.brand}</div>
                  <div className="text-sm font-semibold text-[#090D16] truncate">{item.model}</div>
                  <div className="text-xs text-slate-500 font-mono tabular-nums">
                    Current: {formatPkr(item.pricePkr)}
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[11px] text-slate-500 mb-1">Price (PKR)</label>
                  <input
                    type="number"
                    min={1000}
                    step={500}
                    value={draft.pricePkr}
                    onChange={(e) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [item.id]: { ...draft, pricePkr: e.target.value },
                      }))
                    }
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-300 bg-white text-xs font-mono tabular-nums text-[#090D16]"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={draft.originalPricePkr}
                    onChange={(e) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [item.id]: { ...draft, originalPricePkr: e.target.value },
                      }))
                    }
                    placeholder="None"
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-300 bg-white text-xs font-mono tabular-nums text-[#090D16]"
                  />
                </div>
              </div>
            );
          })}

          <div className="sticky bottom-0 pt-4 pb-1 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                onResetPrices();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default Prices</span>
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Catalog Prices</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
