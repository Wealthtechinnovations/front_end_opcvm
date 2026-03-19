export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generates a URL-friendly slug from text.
 * Handles French accented characters and special chars.
 */
export function generateSlug(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generates a unique fund slug: nom-du-fond-code-isin-id
 */
export function generateFundSlug(nomFond: string, codeISIN: string, id: number | string): string {
  const nameSlug = generateSlug(nomFond);
  const isinSlug = codeISIN ? generateSlug(codeISIN) : '';
  return [nameSlug, isinSlug, id].filter(Boolean).join('-');
}

/**
 * Extracts the numeric ID from the end of a slug.
 * e.g., "nom-du-fond-isin-123" => 123
 */
export function extractIdFromSlug(slug: string): number | null {
  if (!slug) return null;
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : parseInt(slug, 10) || null;
}
