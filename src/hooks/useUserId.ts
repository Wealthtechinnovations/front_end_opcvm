'use client';

import { useState, useEffect } from 'react';

export function useUserId(): string {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem('userId');
    if (stored) {
      setUserId(stored);
    }
  }, []);

  return userId;
}
