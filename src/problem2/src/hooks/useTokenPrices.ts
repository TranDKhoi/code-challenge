import { useCallback, useEffect, useState } from 'react';
import {
  PRICES_URL,
  assertPriceRecords,
  createTokensFromPrices,
} from '../utils/tokens';
import type { Token } from '../types/swap';

export function useTokenPrices() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPrices = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(PRICES_URL);

      if (!response.ok) {
        throw new Error(`Price API returned ${response.status}.`);
      }

      const payload = await response.json();
      const records = assertPriceRecords(payload);
      const nextTokens = createTokensFromPrices(records);

      if (!nextTokens.length) {
        throw new Error('No priced tokens found.');
      }

      setTokens(nextTokens);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Failed to load token prices.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPrices();
  }, [loadPrices]);

  return {
    tokens,
    loading,
    error,
    reload: loadPrices,
  };
}
