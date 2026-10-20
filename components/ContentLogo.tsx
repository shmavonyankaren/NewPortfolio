"use client";
import { useState } from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";

export default function ContentLogo({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-purple-100 p-1 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300">
      {src?.trim() && failedSrc !== src ? (
        <Image
          src={src}
          alt={alt}
          width={52}
          height={52}
          className="h-full w-full object-contain"
          unoptimized
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <Building2 role="img" aria-label={alt} size={28} />
      )}
    </span>
  );
}
