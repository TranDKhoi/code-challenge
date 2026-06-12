import { Clock3 } from 'lucide-react';
import { formatRate, formatTime } from '../utils/format';
import type { SwapHistoryItem } from '../types/swap';

type SwapHistoryProps = {
  history: SwapHistoryItem[];
};

export function SwapHistory({ history }: SwapHistoryProps) {
  return (
    <section className="history-panel" aria-label="Swap history">
      <div className="history-panel__header">
        <div>
          <span className="kicker">Activity</span>
          <h2>Recent swaps</h2>
        </div>
        <Clock3 size={18} />
      </div>

      {history.length ? (
        <div className="history-list">
          {history.map((item) => (
            <article className="history-item" key={item.id}>
              <div>
                <strong>
                  {item.fromAmount} {item.fromSymbol}
                </strong>
                <span>
                  to {item.toAmount} {item.toSymbol}
                </span>
              </div>
              <div className="history-item__meta">
                <span>{formatTime(item.createdAt)}</span>
                <span>1 {item.fromSymbol} = {formatRate(item.rate)} {item.toSymbol}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="history-empty">No swaps yet.</p>
      )}
    </section>
  );
}
