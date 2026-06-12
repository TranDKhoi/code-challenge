import { describe, it, expect } from 'vitest';
import { validateSwap } from '../validation';
import type { Token } from '../../types/token';

describe('validation utils', () => {
  const mockTokenA: Token = {
    symbol: 'USDC',
    price: 1,
    updatedAt: '2026-06-12',
    iconUrl: '',
  };

  const mockTokenB: Token = {
    symbol: 'ETH',
    price: 3000,
    updatedAt: '2026-06-12',
    iconUrl: '',
  };

  it('should return error if tokens are not selected', () => {
    expect(
      validateSwap({
        fromToken: null,
        toToken: mockTokenB,
        fromAmount: '1',
        toAmount: '3000',
        rate: 3000,
      })
    ).toBe('Select both tokens.');

    expect(
      validateSwap({
        fromToken: mockTokenA,
        toToken: null,
        fromAmount: '1',
        toAmount: '3000',
        rate: 3000,
      })
    ).toBe('Select both tokens.');
  });

  it('should return error if tokens are identical', () => {
    expect(
      validateSwap({
        fromToken: mockTokenA,
        toToken: mockTokenA,
        fromAmount: '1',
        toAmount: '1',
        rate: 1,
      })
    ).toBe('Choose two different tokens.');
  });

  it('should return error if amount is missing', () => {
    expect(
      validateSwap({
        fromToken: mockTokenA,
        toToken: mockTokenB,
        fromAmount: '',
        toAmount: '',
        rate: 3000,
      })
    ).toBe('Enter an amount.');
  });

  it('should return error if amount is not positive', () => {
    expect(
      validateSwap({
        fromToken: mockTokenA,
        toToken: mockTokenB,
        fromAmount: '0',
        toAmount: '0',
        rate: 3000,
      })
    ).toBe('Amount must be greater than 0.');

    expect(
      validateSwap({
        fromToken: mockTokenA,
        toToken: mockTokenB,
        fromAmount: '-5',
        toAmount: '-15000',
        rate: 3000,
      })
    ).toBe('Amount must be greater than 0.');
  });

  it('should return error if rate is missing or invalid', () => {
    expect(
      validateSwap({
        fromToken: mockTokenA,
        toToken: mockTokenB,
        fromAmount: '1',
        toAmount: '0',
        rate: 0,
      })
    ).toBe('No quote available for this pair.');
  });

  it('should return empty string if everything is valid', () => {
    expect(
      validateSwap({
        fromToken: mockTokenA,
        toToken: mockTokenB,
        fromAmount: '1',
        toAmount: '3000',
        rate: 3000,
      })
    ).toBe('');
  });
});
