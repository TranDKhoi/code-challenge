const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

export function sanitizeAmount(value: string) {
  const stripped = value.replace(/[^\d.]/g, '');
  const [wholePart, ...fractionParts] = stripped.split('.');
  const whole = wholePart.slice(0, 14);
  const fraction = fractionParts.join('').slice(0, 8);

  if (stripped.startsWith('.')) {
    return fraction ? `0.${fraction}` : '0.';
  }

  return fractionParts.length ? `${whole}.${fraction}` : whole;
}

export function parseAmount(value: string) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

export function formatInputAmount(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return '';
  }

  const maximumFractionDigits = value >= 1000 ? 4 : value >= 1 ? 6 : 8;

  return new Intl.NumberFormat('en-US', {
    useGrouping: false,
    maximumFractionDigits,
  }).format(value);
}

export function formatTokenAmount(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return '0';
  }

  const maximumFractionDigits = value >= 1000 ? 4 : value >= 1 ? 6 : 8;

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
  }).format(value);
}

export function formatUsd(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return '$0.00';
  }

  return usdFormatter.format(value);
}

export function formatRate(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return '0';
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: value >= 1 ? 6 : 10,
  }).format(value);
}

export function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);
}
