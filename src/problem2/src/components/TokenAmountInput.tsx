import type { ChangeEvent } from 'react';
import { formatUsd } from '../utils/format';
import type { Token } from '../types/swap';
import { TokenSelect } from './TokenSelect';

type TokenAmountInputProps = {
  id: string;
  label: string;
  value: string;
  token: Token | null;
  tokens: Token[];
  excludedSymbol?: string;
  usdValue: number;
  pulse: boolean;
  onAmountChange: (value: string) => void;
  onTokenChange: (token: Token) => void;
};

export function TokenAmountInput({
  id,
  label,
  value,
  token,
  tokens,
  excludedSymbol,
  usdValue,
  pulse,
  onAmountChange,
  onTokenChange,
}: TokenAmountInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onAmountChange(event.target.value);
  };

  return (
    <section className={`amount-box ${pulse ? 'is-pulsing' : ''}`}>
      <div className="amount-box__top">
        <label htmlFor={id}>{label}</label>
        {token && <span>{formatUsd(token.price)}</span>}
      </div>

      <div className="amount-box__control">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          placeholder="0.0"
          value={value}
          onChange={handleChange}
        />

        <TokenSelect
          tokens={tokens}
          selectedToken={token}
          excludedSymbol={excludedSymbol}
          onChange={onTokenChange}
        />
      </div>

      <div className="amount-box__usd">{formatUsd(usdValue)}</div>
    </section>
  );
}
