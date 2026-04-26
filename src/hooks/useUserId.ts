'use client';

import { useState, useEffect } from 'react';

export function useUserId(): string | null {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('userId');
    if (stored) {
      setUserId(stored);
    }
  }, []);

  return userId;
}
