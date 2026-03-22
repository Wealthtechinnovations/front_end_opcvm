'use client';

import React from 'react';
import { HelmetProvider } from 'react-helmet-async';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HelmetProvider>
      {children}
    </HelmetProvider>
  );
}
