import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const cropCatalog = [
  { name: 'Sun Bloom', icon: '🌼', value: 18, cost: 20, color: '#ffe38a' },
  { name: 'Amber Root', icon: '🧄', value: 26, cost: 28, color: '#ffb16f' },
  { name: 'Luma Bean', icon: '🫘', value: 34, cost: 34, color: '#7ef7bd' },
  { name: 'Glow Corn', icon: '🌽', value: 42, cost: 46, color: '#7cc3ff' },
  { name: 'Nova Berry', icon: '🍓', value: 58, cost: 62, color: '#d398ff' },
];

const boosterCatalog = [
  { name: 'Drip Flow', bonus: 10, icon: '💧' },
  { name: 'Moon Soil', bonus: 18, icon: '🌙' },
  { name: 'Solar Mist', bonus: 24, icon: '☀️' },
];

const leaderboard = [
  { name: 'Astra', score: '24.8K', accent: '#7ef7bd' },
  { name: 'Nova', score: '22.1K', accent: '#86bcff' },
  { name: 'Eden', score: '20.4K', accent: '#eba6ff' },
  { name: 'Luma', score: '19.6K', accent: '#ffd882' },
];

const initialPlots = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  crop: null,
  growth: 0,
  ready: false,
  value: 0,
  icon: null,
  booster: 0,
}));

const formatNumber = (value) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);

function App() {
  const [wallet, setWallet] = React.useState(2842.72);
  const [energy, setEnergy] = React.useState(86);
  const [xp, setXp] = React.useState(14820);
  const [streak, setStreak] = React.useState(11);
  const [plots, setPlots] = React.useState(initialPlots);
  const [time, setTime] = React.useState(new Date());
  const [selectedCrop, setSelectedCrop] = React.useState(0);
  const [selectedBooster, setSelectedBooster] = React.useState(0);
  const [pool, setPool] = React.useState(48.214);
  const [marketPulse, setMarketPulse] = React.useState(12.4);
  const [dayMode, setDayMode] = React.useState('dawn');

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      setTime(new Date());
      setMarketPulse((prev) => (prev + (Math.random() * 1.6 - 0.8)).toFixed(1));
      setPool((prev) => Number((prev + Math.random() * 0.38).toFixed(3)));
      setEnergy((prev) => Math.min(100, prev + 2));
      setPlots((prev) =>
        prev.map((plot) => {
          if (!plot.crop) return plot;
          const growthBoost = plot.booster ? boosterCatalog[plot.booster - 1].bonus / 100 : 0;
          const nextGrowth = Math.min(plot.growth + (9.5 + growthBoost * 18), 100);
          return {
            ...plot,
            growth: nextGrowth,
            ready: nextGrowth >= 100,
          };
        })
      );
    }, 1800);

    return () => window.clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const hour = time.getHours();
    if (hour >= 5 && hour < 11) setDayMode('dawn');
    else if (hour >= 11 && hour < 17) setDayMode('day');
    else if (hour >= 17 && hour < 20) setDayMode('sunset');
    else setDayMode('night');
  }, [time]);

  const currentCrop = cropCatalog[selectedCrop];
  const currentBooster = boosterCatalog[selectedBooster];

  const plantCrop = (id) => {
    if (energy < 10) return;

    setEnergy((prev) => prev - 10);
    setPlots((prev) =>
      prev.map((plot) =>
        plot.id === id
          ? {
              ...plot,
              crop: currentCrop.name,
              growth: 14,
              ready: false,
              value: currentCrop.value,
              icon: currentCrop.icon,
              booster: selectedBooster + 1,
            }
          : plot
      )
    );
  };

  const harvestCrop = (id) => {
    const plot = plots.find((item) => item.id === id);
    if (!plot || !plot.ready || !plot.crop) return;

    const gain = Math.round((plot.value || 18) * (1 + (plot.booster ? boosterCatalog[plot.booster - 1].bonus / 100 : 0)) + 8);
    setWallet((value) => value + gain);
    setPool((value) => Number((value + gain * 0.16).toFixed(3)));
    setXp((value) => value + gain * 20);
    setStreak((value) => value + 1);
    setEnergy((value) => Math.min(100, value + 12));
    setPlots((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, crop: null, growth: 0, ready: false, value: 0, icon: null, booster: 0 } : item
      )
    );
  };

  const activePlanted = plots.filter((plot) => plot.crop).length;
  const readyCount = plots.filter((plot) => plot.ready).length;
  const performance = Math.min(100, ((activePlanted * 18 + readyCount * 10 + energy) / 1.6).toFixed(0));

  return (
    <div className="app-shell">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">C</div>
          <div>
            <div className="brand-name">CryptoCrop</div>
            <div className="brand-sub">Farm Protocol</div>
          </div>
        </div>

        <nav className="topnav">
          <a href="#farm">Farm</a>
          <a href="#vault">Vault</a>
          <a href="#rewards">Rewards</a>
          <a href="#leaderboard">Leaderboard</a>
        </nav>

        <button className="wallet-btn">0x7b4e...d93f</button>
      </header>

      <main className="hero-grid">
        <section className="hero-copy">
          <div className="eyebrow">Season 22 • live harvest cycle</div>
          <h1>Grow premium crops in a radiant crypto world.</h1>
          <p>
            Manage a thriving farm, stack yield boosters, and optimize the harvest pool with premium crop rotations,
            energy loops, and a fast-moving seasonal economy.
          </p>

          <div className="cta-row">
            <button className="primary-btn">Start farming</button>
            <button className="secondary-btn">View vault</button>
          </div>

          <div className="stat-row">
            <div>
              <span>Pool value</span>
              <strong>{formatNumber(pool)} ETH</strong>
            </div>
            <div>
              <span>Farmers online</span>
              <strong>8.4k</strong>
            </div>
            <div>
              <span>APY</span>
              <strong>214%</strong>
            </div>
          </div>
        </section>

        <section className="hero-panel" id="farm">
          <div className="panel-top">
            <div>
              <span className="tiny-tag">Live balance</span>
              <h3>${formatNumber(wallet)}</h3>
            </div>
            <div className="status-pill">+18.6% today</div>
          </div>

          <div className={`sky-scene ${dayMode}`}>
            <div className="sun" />
            <div className="cloud cloud-one" />
            <div className="cloud cloud-two" />
            <div className="field-glow" />

            <div className="field-wrap">
              <div className="field-back" />
              <div className="field-front" />

              {plots.map((plot, index) => (
                <button
                  key={plot.id}
                  className={`farm-plot ${plot.crop ? 'planted' : ''} ${plot.ready ? 'ready' : ''}`}
                  onClick={() => (plot.crop ? harvestCrop(plot.id) : plantCrop(plot.id))}
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <div className="plot-halo" />
                  <span className="plot-icon">{plot.icon || '✦'}</span>
                  <span className="plot-growth">{plot.crop ? `${Math.round(plot.growth)}%` : 'Idle'}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mini-info">
            <div>
              <span>Seeding</span>
              <strong>{activePlanted}/8</strong>
            </div>
            <div>
              <span>Ready</span>
              <strong>{readyCount}</strong>
            </div>
            <div>
              <span>Energy</span>
              <strong>{energy}%</strong>
            </div>
          </div>
        </section>
      </main>

      <section className="dashboard-grid">
        <div className="info-card glass-card">
          <div className="section-header">
            <span className="tiny-tag">Performance</span>
            <span className="muted-value">+{marketPulse}% market</span>
          </div>
          <div className="big-score">{performance}%</div>
          <div className="progress-line">
            <span style={{ width: `${performance}%` }} />
          </div>
          <ul className="metrics-list">
            <li>
              <span>XP</span>
              <strong>{formatNumber(xp)}</strong>
            </li>
            <li>
              <span>Streak</span>
              <strong>{streak} days</strong>
            </li>
            <li>
              <span>Yield rate</span>
              <strong>{(marketPulse * 1.8).toFixed(1)}x</strong>
            </li>
          </ul>
        </div>

        <div className="info-card glass-card">
          <div className="section-header">
            <span className="tiny-tag">Boosts</span>
            <span className="muted-value">Active</span>
          </div>
          <div className="boost-row">
            {boosterCatalog.map((booster, index) => (
              <button
                key={booster.name}
                className={`boost-chip ${selectedBooster === index ? 'selected' : ''}`}
                onClick={() => setSelectedBooster(index)}
              >
                <span>{booster.icon}</span>
                {booster.name}
              </button>
            ))}
          </div>
          <div className="booster-summary">
            <span>{currentBooster.icon}</span>
            <div>
              <h4>{currentBooster.name}</h4>
              <p>+{currentBooster.bonus}% crop efficiency</p>
            </div>
          </div>
        </div>
      </section>

      <section className="selection-section" id="vault">
        <div className="section-header wide">
          <div>
            <span className="tiny-tag">Seed vault</span>
            <h2>Curated growth cycles</h2>
          </div>
          <button className="wallet-btn small">Sync market</button>
        </div>

        <div className="seed-grid">
          {cropCatalog.map((crop, index) => (
            <button
              key={crop.name}
              className={`seed-card ${selectedCrop === index ? 'selected' : ''}`}
              onClick={() => setSelectedCrop(index)}
            >
              <div className="seed-icon" style={{ color: crop.color }}>{crop.icon}</div>
              <div className="seed-copy">
                <h4>{crop.name}</h4>
                <span>{crop.value} / harvest</span>
              </div>
              <div className="seed-cost">{crop.cost} seeds</div>
            </button>
          ))}
        </div>
      </section>

      <section className="bottom-grid" id="rewards">
        <div className="reward-panel glass-card">
          <div className="section-header">
            <span className="tiny-tag">Token rewards</span>
            <span className="muted-value">Live</span>
          </div>
          <h3>24.7K $CROP</h3>
          <div className="reward-bar">
            <span style={{ width: '74%' }} />
          </div>
          <small>74% distributed • 26% reserved for the next growth season</small>
        </div>

        <div className="reward-panel glass-card" id="leaderboard">
          <div className="section-header">
            <span className="tiny-tag">Leaderboard</span>
            <span className="muted-value">Top growers</span>
          </div>
          <div className="leaderboard">
            {leaderboard.map((player, index) => (
              <div key={player.name} className="leader-row">
                <div className="leader-left">
                  <span className="leader-rank">#{index + 1}</span>
                  <span className="leader-name">{player.name}</span>
                </div>
                <span className="leader-score" style={{ color: player.accent }}>{player.score}</span>
              </div>
            ))}
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
