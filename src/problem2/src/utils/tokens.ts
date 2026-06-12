import type { PriceRecord, Token } from '../types/swap';

export const PRICES_URL = 'https://interview.switcheo.com/prices.json';
export const TOKEN_ICON_BASE_URL =
  'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

const POPULAR_SYMBOLS = [
  'ETH',
  'WBTC',
  'USDC',
  'USD',
  'ATOM',
  'OSMO',
  'BUSD',
  'SWTH',
  'LUNA',
  'GMX',
  'KUJI',
];

export function assertPriceRecords(payload: unknown): PriceRecord[] {
  if (!Array.isArray(payload)) {
    throw new Error('Price API returned invalid data.');
  }

  return payload.filter(
    (record): record is PriceRecord =>
      typeof record?.currency === 'string' &&
      typeof record.date === 'string' &&
      typeof record.price === 'number',
  );
}

export function createTokensFromPrices(records: PriceRecord[]) {
  const latest = new Map<string, PriceRecord>();

  for (const record of records) {
    if (!record.currency || !Number.isFinite(record.price) || record.price <= 0) {
      continue;
    }

    const currentTime = Date.parse(record.date);
    const existing = latest.get(record.currency);
    const existingTime = existing ? Date.parse(existing.date) : Number.NEGATIVE_INFINITY;

    if (!existing || currentTime >= existingTime) {
      latest.set(record.currency, record);
    }
  }

  return Array.from(latest.values())
    .map<Token>((record) => ({
      symbol: record.currency,
      price: record.price,
      updatedAt: record.date,
      iconUrl: getTokenIconUrl(record.currency),
    }))
    .sort(sortTokens);
}

export function getDefaultPair(tokens: Token[]) {
  const from = findToken(tokens, 'ETH') ?? tokens[0] ?? null;
  const preferredTo =
    findToken(tokens, 'USDC') ??
    findToken(tokens, 'USD') ??
    tokens.find((token) => token.symbol !== from?.symbol) ??
    null;

  return {
    from,
    to: preferredTo,
  };
}

export function getTokenIconUrl(symbol: string) {
  return `${TOKEN_ICON_BASE_URL}/${symbol}.svg`;
}

function findToken(tokens: Token[], symbol: string) {
  return tokens.find((token) => token.symbol === symbol) ?? null;
}

function sortTokens(a: Token, b: Token) {
  const aIndex = POPULAR_SYMBOLS.indexOf(a.symbol);
  const bIndex = POPULAR_SYMBOLS.indexOf(b.symbol);

  if (aIndex !== -1 || bIndex !== -1) {
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  }

  return a.symbol.localeCompare(b.symbol);
}
