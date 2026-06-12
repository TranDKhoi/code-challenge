import { RefreshCw } from 'lucide-react';
import { SwapForm } from './components/SwapForm';
import { SwapHistory } from './components/SwapHistory';
import { useSwapHistory } from './hooks/useSwapHistory';
import { useTokenPrices } from './hooks/useTokenPrices';

function App() {
  const { tokens, loading, error, reload } = useTokenPrices();
  const { history, addHistoryItem } = useSwapHistory();

  return (
    <main className="app-shell">
      <div className="app-frame">
        {loading ? (
          <div className="state-card">
            <span className="loader-ring" />
            <p>Loading token prices...</p>
          </div>
        ) : error ? (
          <div className="state-card">
            <p>{error}</p>
            <button type="button" onClick={reload}>
              <RefreshCw size={17} />
              Retry
            </button>
          </div>
        ) : (
          <>
            <SwapForm tokens={tokens} onSwapComplete={addHistoryItem} />
            <SwapHistory history={history} />
          </>
        )}
      </div>
    </main>
  );
}

export default App;
