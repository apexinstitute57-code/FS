import React from 'react';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppOrderUrl } from '../data/laptops';

export const FloatingWhatsApp: React.FC = () => {
  const url = buildWhatsAppOrderUrl({});

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order or chat with FS SHOP on WhatsApp at 03086421306"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 inline-flex items-center gap-2.5 h-11 px-4 rounded-full bg-[#0A1328] hover:bg-[#16A34A] text-white border border-white/15 shadow-[0_12px_30px_rgba(0,0,0,0.3)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
    >
      <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0" />
      <span className="text-xs font-semibold tracking-wide whitespace-nowrap">
        WhatsApp Order
      </span>
    </a>
  );
};
