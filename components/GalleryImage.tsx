'use client';

import { useState } from 'react';
import Image from 'next/image';

type Props = {
  src: string;
  alt: string;
  className?: string;
};

export default function GalleryImage({ src, alt, className = '' }: Props) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-void-700 border border-void-600 text-fg/30 font-display text-sm ${className}`}
      >
        Image
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      sizes="(max-width: 1024px) 100vw, 896px"
      unoptimized
      onError={() => setError(true)}
    />
  );
}
