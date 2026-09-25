'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container py-5 text-center">
      <h2>Une erreur est survenue</h2>
      <p className="text-muted">{error.message || 'Veuillez réessayer.'}</p>
      <button className="btn btn-primary" onClick={reset}>
        Réessayer
      </button>
    </div>
  );
}
