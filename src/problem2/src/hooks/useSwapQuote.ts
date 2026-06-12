import { useMemo } from 'react';
import {
  formatInputAmount,
  parseAmount,
} from '../utils/format';
import type { SwapSide, Token } from '../types/swap';

type UseSwapQuoteInput = {
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  toAmount: string;
  lastEdited: SwapSide;
};

export function useSwapQuote({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  lastEdited,
}: UseSwapQuoteInput) {
  return useMemo(() => {
    const rate =
      fromToken && toToken && toToken.price > 0 ? fromToken.price / toToken.price : 0;

    const parsedFromAmount = parseAmount(fromAmount);
    const parsedToAmount = parseAmount(toAmount);
    const calculatedToAmount =
      rate && parsedFromAmount ? formatInputAmount(parsedFromAmount * rate) : '';
    const calculatedFromAmount =
      rate && parsedToAmount ? formatInputAmount(parsedToAmount / rate) : '';

    const effectiveFromAmount =
      lastEdited === 'to'
        ? parseAmount(calculatedFromAmount) ?? 0
        : parsedFromAmount ?? 0;
    const effectiveToAmount =
      lastEdited === 'from'
        ? parseAmount(calculatedToAmount) ?? 0
        : parsedToAmount ?? 0;

    const fromUsd = fromToken ? effectiveFromAmount * fromToken.price : 0;
    const toUsd = toToken ? effectiveToAmount * toToken.price : 0;

    return {
      rate,
      calculatedFromAmount,
      calculatedToAmount,
      effectiveFromAmount,
      effectiveToAmount,
      fromUsd,
      toUsd,
    };
  }, [fromAmount, fromToken, lastEdited, toAmount, toToken]);
}
