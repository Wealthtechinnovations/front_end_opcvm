'use client';

import ErrorAlert from '@/components/common/ErrorAlert';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container py-5">
      <ErrorAlert
        message={error.message || 'Une erreur inattendue est survenue.'}
        onRetry={reset}
      />
    </div>
  );
}
