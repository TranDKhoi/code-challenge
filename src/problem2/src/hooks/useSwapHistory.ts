import { useCallback, useState } from 'react';
import type { NewSwapHistoryItem, SwapHistoryItem } from '../types/swap';

export function useSwapHistory() {
  const [history, setHistory] = useState<SwapHistoryItem[]>([]);

  const addHistoryItem = useCallback((item: NewSwapHistoryItem) => {
    setHistory((current) => [
      {
        ...item,
        id: createId(),
        createdAt: Date.now(),
      },
      ...current,
    ].slice(0, 6));
  }, []);

  return {
    history,
    addHistoryItem,
  };
}

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
