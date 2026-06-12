export type SwapSide = 'from' | 'to';

export type SwapHistoryItem = {
  id: string;
  createdAt: number;
  fromAmount: string;
  fromSymbol: string;
  toAmount: string;
  toSymbol: string;
  rate: number;
};

export type NewSwapHistoryItem = Omit<SwapHistoryItem, 'id' | 'createdAt'>;
