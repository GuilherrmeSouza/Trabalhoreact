export function getRatingColor(rating) {
  if (rating >= 7.5) return 'var(--rating-high)';
  if (rating >= 5.0) return 'var(--rating-mid)';
  return 'var(--rating-low)';
}
