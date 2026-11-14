import React from 'react';
import { BrandName } from '../types/laptop';

interface BrandLogoProps {
  brand: BrandName;
  className?: string;
  tone?: 'dark' | 'light';
}

export const FSShopMark: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
    <rect x="2" y="2" width="32" height="32" rx="8" fill="#0A1328" stroke="#2563EB" strokeWidth="1.5" />
    <path
      d="M10 12.5H20.5M10 12.5V23.5M10 18H17.5"
      stroke="#FFFFFF"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M26 12.5H22C20.6 12.5 19.5 13.5 19.5 14.8C19.5 16.2 20.6 17 22.3 17.4L23.8 17.8C25.3 18.2 26.2 19 26.2 20.4C26.2 22.1 24.8 23.5 22.8 23.5H19.5"
      stroke="#3B82F6"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BrandLogo: React.FC<BrandLogoProps> = ({
  brand,
  className = 'h-5',
  tone = 'dark',
}) => {
  const fg = tone === 'light' ? '#FFFFFF' : '#090D16';
  const accent = tone === 'light' ? '#60A5FA' : '#2563EB';

  switch (brand) {
    case 'HP':
      return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
          <svg viewBox="0 0 28 28" className="w-6 h-6 shrink-0" aria-hidden="true">
            <circle cx="14" cy="14" r="13" stroke={accent} strokeWidth="1.8" fill="none" />
            <text
              x="14"
              y="18.5"
              textAnchor="middle"
              fill={fg}
              fontFamily="Outfit, sans-serif"
              fontWeight="700"
              fontSize="12"
              fontStyle="italic"
            >
              hp
            </text>
          </svg>
          <span className="font-display font-semibold tracking-tight text-sm" style={{ color: fg }}>
            HP
          </span>
        </div>
      );

    case 'Dell':
      return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
          <svg viewBox="0 0 28 28" className="w-6 h-6 shrink-0" aria-hidden="true">
            <circle cx="14" cy="14" r="13" stroke={accent} strokeWidth="1.8" fill="none" />
            <text
              x="14"
              y="17.5"
              textAnchor="middle"
              fill={fg}
              fontFamily="Outfit, sans-serif"
              fontWeight="700"
              fontSize="8.5"
              letterSpacing="0.5"
            >
              DELL
            </text>
          </svg>
          <span className="font-display font-semibold tracking-tight text-sm" style={{ color: fg }}>
            Dell
          </span>
        </div>
      );

    case 'Lenovo':
      return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
          <svg viewBox="0 0 28 28" className="w-6 h-6 shrink-0" aria-hidden="true">
            <rect x="2" y="6" width="24" height="16" rx="3" fill="#DC2626" />
            <text
              x="14"
              y="16.5"
              textAnchor="middle"
              fill="#FFFFFF"
              fontFamily="Outfit, sans-serif"
              fontWeight="700"
              fontSize="6.5"
            >
              Lenovo
            </text>
          </svg>
          <span className="font-display font-semibold tracking-tight text-sm" style={{ color: fg }}>
            Lenovo
          </span>
        </div>
      );

    case 'Apple MacBook':
      return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill={fg} aria-hidden="true">
            <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
          </svg>
          <span className="font-display font-semibold tracking-tight text-sm" style={{ color: fg }}>
            Apple MacBook
          </span>
        </div>
      );

    case 'Asus':
      return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
          <svg viewBox="0 0 28 28" className="w-6 h-6 shrink-0" aria-hidden="true">
            <path d="M4 19L11 9H15L11.5 19H4ZM15 19L18 9H24L20.5 19H15Z" fill={accent} />
          </svg>
          <span className="font-display font-semibold tracking-wider text-sm" style={{ color: fg }}>
            ASUS
          </span>
        </div>
      );

    case 'Acer':
      return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
          <svg viewBox="0 0 28 28" className="w-6 h-6 shrink-0" aria-hidden="true">
            <rect x="2" y="7" width="24" height="14" rx="4" stroke={accent} strokeWidth="1.8" fill="none" />
            <text
              x="14"
              y="16.5"
              textAnchor="middle"
              fill={fg}
              fontFamily="Outfit, sans-serif"
              fontWeight="700"
              fontSize="8.5"
            >
              acer
            </text>
          </svg>
          <span className="font-display font-semibold tracking-tight text-sm" style={{ color: fg }}>
            Acer
          </span>
        </div>
      );

    case 'MSI':
      return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
          <svg viewBox="0 0 28 28" className="w-6 h-6 shrink-0" aria-hidden="true">
            <polygon points="14,3 25,9 25,19 14,25 3,19 3,9" stroke={accent} strokeWidth="1.8" fill="none" />
            <text
              x="14"
              y="16.5"
              textAnchor="middle"
              fill={fg}
              fontFamily="Outfit, sans-serif"
              fontWeight="700"
              fontSize="8"
            >
              MSI
            </text>
          </svg>
          <span className="font-display font-semibold tracking-wider text-sm" style={{ color: fg }}>
            MSI
          </span>
        </div>
      );

    case 'Microsoft Surface':
      return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
            <rect x="2" y="2" width="9" height="9" fill="#F25022" />
            <rect x="13" y="2" width="9" height="9" fill="#7FBA00" />
            <rect x="2" y="13" width="9" height="9" fill="#00A4EF" />
            <rect x="13" y="13" width="9" height="9" fill="#FFB900" />
          </svg>
          <span className="font-display font-semibold tracking-tight text-sm" style={{ color: fg }}>
            Surface
          </span>
        </div>
      );

    case 'Samsung':
      return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
          <svg viewBox="0 0 28 28" className="w-6 h-6 shrink-0" aria-hidden="true">
            <ellipse cx="14" cy="14" rx="12" ry="7.5" stroke={accent} strokeWidth="1.8" fill="none" />
            <text
              x="14"
              y="16"
              textAnchor="middle"
              fill={fg}
              fontFamily="Outfit, sans-serif"
              fontWeight="700"
              fontSize="5.2"
              letterSpacing="0.4"
            >
              SAMSUNG
            </text>
          </svg>
          <span className="font-display font-semibold tracking-tight text-sm" style={{ color: fg }}>
            Samsung
          </span>
        </div>
      );

    case 'Toshiba':
      return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
          <svg viewBox="0 0 28 28" className="w-6 h-6 shrink-0" aria-hidden="true">
            <rect x="3" y="5" width="22" height="18" rx="3" stroke={accent} strokeWidth="1.8" fill="none" />
            <circle cx="10.5" cy="14" r="2.2" fill={accent} />
            <circle cx="17.5" cy="14" r="1.5" fill={fg} />
          </svg>
          <span className="font-display font-semibold tracking-tight text-sm" style={{ color: fg }}>
            Toshiba
          </span>
        </div>
      );
  }
};
