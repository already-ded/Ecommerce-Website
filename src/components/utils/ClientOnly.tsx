'use client';

import { Suspense } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ClientOnly({ children, fallback }: ClientOnlyProps) {
  return (
    <Suspense
      fallback={
        fallback ?? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        )
      }
    >
      {children}
    </Suspense>
  );
}