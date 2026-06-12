import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { formatUsd } from '../utils/format';
import type { Token } from '../types/swap';

type TokenSelectProps = {
  tokens: Token[];
  selectedToken: Token | null;
  excludedSymbol?: string;
  onChange: (token: Token) => void;
};

export function TokenSelect({
  tokens,
  selectedToken,
  excludedSymbol,
  onChange,
}: TokenSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const filteredTokens = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return tokens.filter((token) => {
      if (token.symbol === excludedSymbol) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return token.symbol.toLowerCase().includes(normalizedQuery);
    });
  }, [excludedSymbol, query, tokens]);

  const handleSelect = (token: Token) => {
    onChange(token);
    setOpen(false);
    setQuery('');
  };

  return (
    <div className="token-select" ref={rootRef}>
      <button
        className="token-select__button"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selectedToken ? (
          <>
            <TokenIcon token={selectedToken} />
            <span>{selectedToken.symbol}</span>
          </>
        ) : (
          <span>Select</span>
        )}
        <ChevronDown className={open ? 'is-open' : ''} size={18} />
      </button>

      {open && (
        <div className="token-menu">
          <label className="token-search">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search token"
              autoFocus
            />
          </label>

          <div className="token-options" role="listbox">
            {filteredTokens.length ? (
              filteredTokens.map((token, index) => (
                <button
                  className="token-option"
                  key={token.symbol}
                  type="button"
                  onClick={() => handleSelect(token)}
                  role="option"
                  aria-selected={selectedToken?.symbol === token.symbol}
                  style={{ '--option-index': index } as React.CSSProperties}
                >
                  <TokenIcon token={token} />
                  <span className="token-option__symbol">{token.symbol}</span>
                  <span className="token-option__price">{formatUsd(token.price)}</span>
                  {selectedToken?.symbol === token.symbol && <Check size={16} />}
                </button>
              ))
            ) : (
              <div className="token-empty">No tokens found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function TokenIcon({ token }: { token: Token }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [token.symbol]);

  if (failed) {
    return <span className="token-icon token-icon--fallback">{token.symbol.slice(0, 3)}</span>;
  }

  return (
    <img
      className="token-icon"
      src={token.iconUrl}
      alt=""
      aria-hidden="true"
      onError={() => setFailed(true)}
    />
  );
}
