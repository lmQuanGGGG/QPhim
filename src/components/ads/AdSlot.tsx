'use client';

import { useEffect } from 'react';
import type { CSSProperties } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSlotProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function AdSlot({
  slot,
  format = 'auto',
  responsive = true,
  className,
  style,
}: AdSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client || !slot) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // ignore adblock/duplicate push runtime errors
    }
  }, [client, slot]);

  if (!client || !slot) {
    return (
      <div className={`flex items-center justify-center border border-zinc-800 rounded-lg bg-zinc-900/40 text-zinc-500 text-xs ${className || ''}`} style={style}>
        Chưa cấu hình quảng cáo
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle block ${className || ''}`}
      style={style}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  );
}
