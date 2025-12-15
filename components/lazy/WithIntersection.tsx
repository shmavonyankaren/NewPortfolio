"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  rootMargin?: string;
  fallback?: React.ReactNode;
}

export default function WithIntersection({
  children,
  rootMargin = "200px",
  fallback = null,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [rootMargin]);

  return <div ref={ref}>{isVisible ? children : fallback}</div>;
}
