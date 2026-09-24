"use client";

import { cn } from "@cds/core";
import Image from "next/image";
import type { ImageProps } from "next/image";
import { useState, type ReactNode } from "react";

export type ResponsiveImageProps = Omit<ImageProps, "alt"> & {
  alt: string;
  fallback?: ReactNode;
};

export function ResponsiveImage({
  alt,
  sizes,
  priority,
  loading,
  fallback,
  className,
  onError,
  ...props
}: ResponsiveImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed && fallback) {
    return <>{fallback}</>;
  }
  return (
    <Image
      alt={alt}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : loading ?? "lazy"}
      className={cn("h-auto max-w-full", className)}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
      {...props}
    />
  );
}
