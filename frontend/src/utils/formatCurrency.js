export const formatAUD = (value = 0) =>
  new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(Number.isFinite(value) ? value : 0);

