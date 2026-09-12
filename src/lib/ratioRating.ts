/**
 * Helper functions for "Par rapport a la Cat" (category comparison) bar charts.
 *
 * These compute dynamic notation classes and estimation labels
 * for risk indicators and expert ratios on fund summary pages.
 *
 * Used by:
 *   - src/app/funds/[fondId]/FundView.tsx         (local currency)
 *   - src/app/funds/summary-eur/[fondId]/FundSubView.tsx  (EUR)
 *   - src/app/funds/summary-usd/[fondId]/FundSubView.tsx  (USD)
 */

/**
 * Computes the CSS class array (length 5) for the 5-bar notation chart.
 *
 * @param rank  - Fund's rank within its category for the given metric (1 = best).
 * @param total - Total number of funds in the category for the given metric.
 * @returns Array of 5 CSS class strings: "conseil-default" (gray)
 *          or "conseil-default conseil-selected" (filled).
 *
 * A higher filled count means a better relative position.
 * When rank or total are missing / invalid, returns all gray (no data available).
 */
export function getNotationClasses(rank: any, total: any): string[] {
  const r = Number(rank);
  const t = Number(total);
  if (!r || !t || t === 0 || !isFinite(r) || !isFinite(t)) {
    return Array(5).fill("conseil-default");
  }
  const selectedCount = Math.ceil((r / t) * 5);
  const safeCount = isFinite(selectedCount) ? Math.min(Math.max(selectedCount, 0), 5) : 0;
  const classes = Array(5).fill("conseil-default");
  for (let i = 0; i < safeCount; i++) {
    classes[i] = "conseil-default conseil-selected";
  }
  return classes;
}

/**
 * Returns the French estimation label for a 1-5 score.
 *
 * @param rank - Score from 1 to 5 (derived from ratio of rank/total * 5, rounded up).
 */
export function getEstimationText(rank: any): string {
  const r = Number(rank);
  if (!isFinite(r) || r <= 0) return "";
  switch (Math.min(r, 5)) {
    case 1:
      return "Très mauvais";
    case 2:
      return "Mauvais";
    case 3:
      return "Moyen";
    case 4:
      return "Bon";
    case 5:
      return "Très bon";
    default:
      return "";
  }
}

/**
 * Convenience: compute the estimation text directly from rank and total.
 */
export function getEstimationFromRankTotal(rank: any, total: any): string {
  const r = Number(rank);
  const t = Number(total);
  if (!r || !t || t === 0 || !isFinite(r) || !isFinite(t)) return "";
  return getEstimationText(Math.ceil((r / t) * 5));
}
