export function formatCurrency(value: number) {
  if (value >= 1000000) {
    return `KES ${(value / 1000000).toFixed(1)}M`;
  }

  return `KES ${value.toLocaleString()}`;
}
