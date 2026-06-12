import { parseAmount } from './format';
import type { Token } from '../types/swap';

type ValidateSwapInput = {
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  toAmount: string;
  rate: number;
};

export function validateSwap({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  rate,
}: ValidateSwapInput) {
  if (!fromToken || !toToken) {
    return 'Select both tokens.';
  }

  if (fromToken.symbol === toToken.symbol) {
    return 'Choose two different tokens.';
  }

  if (!fromAmount) {
    return 'Enter an amount.';
  }

  if (!parseAmount(fromAmount)) {
    return 'Amount must be greater than 0.';
  }

  if (!rate || !parseAmount(toAmount)) {
    return 'No quote available for this pair.';
  }

  return '';
}
