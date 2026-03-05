export function normalizeText(value, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

export function normalizePositiveInteger(value, fallback = 1) {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}
