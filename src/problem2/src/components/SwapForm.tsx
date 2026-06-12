import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownUp, LoaderCircle, ShieldCheck } from 'lucide-react';
import {
  formatRate,
  formatTokenAmount,
  sanitizeAmount,
} from '../utils/format';
import { getDefaultPair } from '../utils/tokens';
import { validateSwap } from '../utils/validation';
import { useSwapQuote } from '../hooks/useSwapQuote';
import type {
  NewSwapHistoryItem,
  SwapSide,
} from '../types/swap';
import type { Token } from '../types/token';
import { StatusMessage } from './StatusMessage';
import { TokenAmountInput } from './TokenAmountInput';

type SwapFormProps = {
  tokens: Token[];
  onSwapComplete: (item: NewSwapHistoryItem) => void;
};

export function SwapForm({ tokens, onSwapComplete }: SwapFormProps) {
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [lastEdited, setLastEdited] = useState<SwapSide>('from');
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [swapping, setSwapping] = useState(false);
  const [pulseSide, setPulseSide] = useState<SwapSide | null>(null);
  const pulseTimer = useRef<number | undefined>(undefined);
  const swapTimer = useRef<number | undefined>(undefined);

  const quote = useSwapQuote({
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    lastEdited,
  });

  useEffect(() => {
    const pair = getDefaultPair(tokens);

    if (!fromToken && pair.from) {
      setFromToken(pair.from);
    }

    if (!toToken && pair.to) {
      setToToken(pair.to);
    }
  }, [fromToken, toToken, tokens]);

  const triggerPulse = useCallback((side: SwapSide) => {
    window.clearTimeout(pulseTimer.current);
    setPulseSide(side);
    pulseTimer.current = window.setTimeout(() => setPulseSide(null), 520);
  }, []);

  useEffect(() => {
    if (!quote.rate) {
      return;
    }

    if (lastEdited === 'from' && toAmount !== quote.calculatedToAmount) {
      setToAmount(quote.calculatedToAmount);
      triggerPulse('to');
    }

    if (lastEdited === 'to' && fromAmount !== quote.calculatedFromAmount) {
      setFromAmount(quote.calculatedFromAmount);
      triggerPulse('from');
    }
  }, [
    fromAmount,
    lastEdited,
    quote.calculatedFromAmount,
    quote.calculatedToAmount,
    quote.rate,
    toAmount,
    triggerPulse,
  ]);

  useEffect(() => {
    return () => {
      window.clearTimeout(pulseTimer.current);
      window.clearTimeout(swapTimer.current);
    };
  }, []);

  const validationMessage = useMemo(
    () =>
      validateSwap({
        fromToken,
        toToken,
        fromAmount,
        toAmount,
        rate: quote.rate,
      }),
    [fromAmount, fromToken, quote.rate, toAmount, toToken],
  );

  const canSubmit = !validationMessage && !submitting;
  const showValidation = attempted || Boolean(fromAmount && validationMessage);

  const handleAmountChange = (side: SwapSide, value: string) => {
    const sanitized = sanitizeAmount(value);

    setAttempted(false);
    setSuccessMessage('');
    setLastEdited(side);

    if (side === 'from') {
      setFromAmount(sanitized);
    } else {
      setToAmount(sanitized);
    }
  };

  const handleSwapDirection = () => {
    if (!fromToken || !toToken) {
      return;
    }

    window.clearTimeout(swapTimer.current);
    setSwapping(true);
    setSuccessMessage('');
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    setLastEdited((side) => (side === 'from' ? 'to' : 'from'));
    swapTimer.current = window.setTimeout(() => setSwapping(false), 620);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);

    if (validationMessage || !fromToken || !toToken) {
      return;
    }

    setSubmitting(true);
    setSuccessMessage('');
    await wait(1050);

    const historyItem: NewSwapHistoryItem = {
      fromAmount: formatTokenAmount(quote.effectiveFromAmount),
      fromSymbol: fromToken.symbol,
      toAmount: formatTokenAmount(quote.effectiveToAmount),
      toSymbol: toToken.symbol,
      rate: quote.rate,
    };

    onSwapComplete(historyItem);
    setSuccessMessage(
      `Swap confirmed: ${historyItem.fromAmount} ${historyItem.fromSymbol} to ${historyItem.toAmount} ${historyItem.toSymbol}.`,
    );
    setSubmitting(false);
  };

  return (
    <form className={`swap-card ${swapping ? 'is-swapping' : ''}`} onSubmit={handleSubmit}>
      <header className="swap-card__header">
        <div>
          <span className="kicker">Currency swap</span>
          <h1>Swap</h1>
        </div>
      </header>

      <div className="swap-panels">
        <TokenAmountInput
          id="from-amount"
          label="You pay"
          value={fromAmount}
          token={fromToken}
          tokens={tokens}
          excludedSymbol={toToken?.symbol}
          usdValue={quote.fromUsd}
          pulse={pulseSide === 'from'}
          onAmountChange={(value) => handleAmountChange('from', value)}
          onTokenChange={(token) => {
            setSuccessMessage('');
            setFromToken(token);
          }}
        />

        <div className="swap-button-row">
          <button
            className="swap-direction-button"
            type="button"
            onClick={handleSwapDirection}
            aria-label="Swap token direction"
          >
            <ArrowDownUp size={20} />
          </button>
        </div>

        <TokenAmountInput
          id="to-amount"
          label="You receive"
          value={toAmount}
          token={toToken}
          tokens={tokens}
          excludedSymbol={fromToken?.symbol}
          usdValue={quote.toUsd}
          pulse={pulseSide === 'to'}
          onAmountChange={(value) => handleAmountChange('to', value)}
          onTokenChange={(token) => {
            setSuccessMessage('');
            setToToken(token);
          }}
        />
      </div>

      <section className="quote-box" aria-label="Quote details">
        <QuoteRow
          label="Rate"
          value={
            fromToken && toToken && quote.rate
              ? `1 ${fromToken.symbol} = ${formatRate(quote.rate)} ${toToken.symbol}`
              : 'Waiting for pair'
          }
        />
        <QuoteRow
          label="Source value"
          value={
            fromToken && quote.fromUsd
              ? `$${quote.fromUsd.toFixed(2)}`
              : '$0.00'
          }
        />
      </section>

      <button className={`confirm-button ${submitting ? 'is-loading' : ''}`} type="submit" disabled={!canSubmit}>
        {submitting ? (
          <>
            <LoaderCircle className="spin" size={19} />
            Swapping
          </>
        ) : canSubmit ? (
          <>
            <ShieldCheck size={19} />
            Confirm swap
          </>
        ) : (
          validationMessage || 'Confirm swap'
        )}
      </button>

      {showValidation && validationMessage && (
        <StatusMessage variant="error" message={validationMessage} />
      )}

      {successMessage && <StatusMessage variant="success" message={successMessage} />}
    </form>
  );
}

function QuoteRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="quote-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function wait(duration: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
}
