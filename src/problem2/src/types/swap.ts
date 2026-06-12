export type PriceRecord = {
  currency: string;
  date: string;
  price: number;
};

export type Token = {
  symbol: string;
  price: number;
  updatedAt: string;
  iconUrl: string;
};

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
