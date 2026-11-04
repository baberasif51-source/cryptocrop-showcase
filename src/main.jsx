import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const cropCatalog = [
  { name: 'Sun Bloom', icon: '🌼', value: 18, cost: 20 },
  { name: 'Amber Root', icon: '🧄', value: 26, cost: 28 },
  { name: 'Luma Bean', icon: '🫘', value: 34, cost: 34 },
  { name: 'Glow Corn', icon: '🌽', value: 42, cost: 46 },
];

const initialPlots = [
  { id: 1, crop: null, growth: 0, ready: false },
  { id: 2, crop: null, growth: 0, ready: false },
  { id: 3, crop: null, growth: 0, ready: false },
  { id: 4, crop: null, growth: 0, ready: false },
  { id: 5, crop: null, growth: 0, ready: false },
  { id: 6, crop: null, growth: 0, ready: false },
];

const formatNumber = (value) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);

function App() {
  const [wallet, setWallet] = React.useState(2842.72);
  const [energy, setEnergy] = React.useState(85);
  const [plots, setPlots] = React.useState(initialPlots);
  const [time, setTime] = React.useState(new Date());
  const [selectedCrop, setSelectedCrop] = React.useState(0);
  const [pool, setPool] = React.useState(42.861);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setTime(new Date());
      setPlots((prev) =>
        prev.map((plot) => {
          if (!plot.crop) return plot;
          const nextGrowth = Math.min(plot.growth + 9.5, 100);
          return {
            ...plot,
            growth: nextGrowth,
            ready: nextGrowth >= 100,
          };
        })
      );
    }, 1500);

    return () => window.clearInterval(id);
  }, []);

  const currentCrop = cropCatalog[selectedCrop];

  const plantCrop = (id) => {
    if (energy < 12) return;

    setEnergy((prev) => prev - 12);
    setPlots((prev) =>
      prev.map((plot) =>
        plot.id === id
          ? {
              ...plot,
              crop: currentCrop.name,
              growth: 12,
              ready: false,
              value: currentCrop.value,
              icon: currentCrop.icon,
            }
          : plot
      )
    );
  };

  const harvestCrop = (id) => {
    const plot = plots.find((item) => item.id === id);
    if (!plot || !plot.ready || !plot.crop) return;

    const gain = (plot.value || 18) * 1.7;
    setWallet((value) => value + gain);
    setPool((value) => value + gain * 0.18);
    setEnergy((value) => Math.min(100, value + 9));
    setPlots((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, crop: null, growth: 0, ready: false, value: 0, icon: null } : item
      )
    );
  };

  const activePlanted = plots.filter((plot) => plot.crop).length;
  const readyCount = plots.filter((plot) => plot.ready).length;
  const cycleSeconds = time.getSeconds();
  const dayProgress = ((time.getHours() * 3600 + time.getMinutes() * 60 + cycleSeconds) / 86400) * 100;
  const glow = Math.sin(dayProgress / 18) * 18 + 70;

  return (
    <div className="app-shell">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">C</div>
          <div>
            <div className="brand-name">CryptoCrop</div>
            <div className="brand-sub">Harvest pool</div>
          </div>
        </div>

        <nav className="nav">
          <a href="#farm">Farm</a>
          <a href="#rewards">Rewards</a>
          <a href="#market">Market</a>
          <a href="#leaderboard">Leaderboard</a>
        </nav>

        <button className="ghost-btn">Connect wallet</button>
      </header>

      <main className="hero-grid">
        <section className="hero-copy">
          <div className="eyebrow">Season 22 • Live harvesting</div>
          <h1>Grow brighter yields in a world of radiant crypto farms.</h1>
          <p>
            Plant rare crops, optimize the harvest pool, and automate the flow of value across a premium
            virtual farming ecosystem designed for speed, beauty, and rewards.
          </p>

          <div className="cta-row">
            <button className="primary-btn">Start farming</button>
            <button className="secondary-btn">View pool</button>
          </div>

          <div className="stats-row">
            <div>
              <span>Pool value</span>
              <strong>{formatNumber(pool)} ETH</strong>
            </div>
            <div>
              <span>Farmers online</span>
              <strong>8.4k</strong>
            </div>
            <div>
              <span>APR</span>
              <strong>214%</strong>
            </div>
          </div>
        </section>

        <section className="hero-panel">
          <div className="panel-header">
            <div>
              <span className="tiny-label">Live balance</span>
              <h3>${formatNumber(wallet)}</h3>
            </div>
            <div className="status-pill">+18.6% today</div>
          </div>

          <div className="sky-scene" style={{ '--glow': `${glow}%` }}>
            <div className="sun" />
            <div className="cloud cloud-one" />
            <div className="cloud cloud-two" />

            <div className="field-wrap">
              <div className="field field-back" />
              <div className="field field-front" />

              {plots.map((plot, index) => (
                <button
                  key={plot.id}
                  className={`plot ${plot.crop ? 'planted' : ''} ${plot.ready ? 'ready' : ''}`}
                  onClick={() => (plot.crop ? harvestCrop(plot.id) : plantCrop(plot.id))}
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <div className="plot-glow" />
                  <span className="plot-icon">{plot.icon || '✦'}</span>
                  <span className="plot-growth">{plot.crop ? `${Math.round(plot.growth)}%` : 'Empty'}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mini-rail">
            <div>
              <span>Seeding</span>
              <strong>{activePlanted}/6 plots</strong>
            </div>
            <div>
              <span>Ready</span>
              <strong>{readyCount} crops</strong>
            </div>
            <div>
              <span>Energy</span>
              <strong>{energy}%</strong>
            </div>
          </div>
        </section>
      </main>

      <section className="selection-section" id="farm">
        <div className="section-heading">
          <div>
            <span className="tiny-label">Choose crop</span>
            <h2>Curated seed vault</h2>
          </div>
          <button className="ghost-btn small">Sync market</button>
        </div>

        <div className="seed-grid">
          {cropCatalog.map((crop, index) => (
            <button
              key={crop.name}
              className={`seed-card ${selectedCrop === index ? 'selected' : ''}`}
              onClick={() => setSelectedCrop(index)}
            >
              <div className="seed-icon">{crop.icon}</div>
              <div>
                <h4>{crop.name}</h4>
                <span>{crop.value} / harvest</span>
              </div>
              <div className="seed-cost">{crop.cost} seeds</div>
            </button>
          ))}
        </div>
      </section>

      <section className="bottom-grid" id="rewards">
        <div className="token-card">
          <span className="tiny-label">Total rewards</span>
          <h3>24.7K $CROP</h3>
          <div className="token-bar">
            <span style={{ width: '74%' }} />
          </div>
          <small>74% distributed • 26% reserved for next launch</small>
        </div>

        <div className="feature-list">
          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <div>
              <h4>Auto harvest</h4>
              <p>Smart rotations trigger optimized yields when crop vitality peaks.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">🌿</div>
            <div>
              <h4>Multi-layer growth</h4>
              <p>Amplify growth with premium boosters and rare soil patterns.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">🧊</div>
            <div>
              <h4>Low-latency UI</h4>
              <p>Realtime pulses and premium motion design built for a next-gen experience.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
