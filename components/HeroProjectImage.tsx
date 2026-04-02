'use client';

import { useState } from 'react';
import Image from 'next/image';

type Props = {
  src: string;
  alt: string;
  title: string;
  className?: string;
};

export default function HeroProjectImage({ src, alt, title, className = '' }: Props) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-void-700 text-white/20 font-display text-2xl tracking-widest ${className}`}
      >
        {title}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes="(max-width: 1024px) 100vw, 896px"
      unoptimized
      priority
      onError={() => setError(true)}
    />
  );
}
