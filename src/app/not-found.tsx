import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-1 text-muted">404</h1>
      <h2>Page introuvable</h2>
      <p className="text-muted">La page que vous cherchez n&apos;existe pas ou a été déplacée.</p>
      <Link href="/home" className="btn btn-primary">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
