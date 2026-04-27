'use client';

import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <HelmetProvider>
        {children}
      </HelmetProvider>
    </SessionProvider>
  );
}
