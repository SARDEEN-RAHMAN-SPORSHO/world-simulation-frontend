import React, { useState, useEffect } from 'react';
import './WorldDashboard.css';

export default function WorldDashboard({ simulationId, api }) {
  const [worldState, setWorldState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorldState();
    const interval = setInterval(fetchWorldState, 5000);
    return () => clearInterval(interval);
  }, [simulationId]);

  const fetchWorldState = async () => {
    try {
      const state = await api.getSimulationState(simulationId);
      setWorldState(state);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch world state:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="world-dashboard">
        <h3>🌍 World State</h3>
        <div className="loading">Loading world data...</div>
      </div>
    );
  }

  if (!worldState) {
    return (
      <div className="world-dashboard">
        <h3>🌍 World State</h3>
        <div className="error">Failed to load world state</div>
      </div>
    );
  }

  const getStabilityColor = (stability) => {
    if (stability >= 70) return '#27ae60';
    if (stability >= 40) return '#f39c12';
    return '#e74c3c';
  };

  const getPowerRank = (power) => {
    if (power >= 80) return '🌟';
    if (power >= 60) return '⭐';
    if (power >= 40) return '✨';
    return '💫';
  };

  return (
    <div className="world-dashboard">
      <div className="dashboard-header">
        <h3>🌍 {worldState.worldName}</h3>
        <p className="world-description">{worldState.description}</p>
      </div>

      <div className="global-metrics">
        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <div className="metric-label">Stability Index</div>
            <div className="metric-value">{worldState.metrics?.stabilityIndex || 0}/100</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🏛️</div>
          <div className="metric-content">
            <div className="metric-label">Surviving Nations</div>
            <div className="metric-value">
              {worldState.countries.filter(c => c.stability > 20).length}/{worldState.countries.length}
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⚔️</div>
          <div className="metric-content">
            <div className="metric-label">Conflict Level</div>
            <div className="metric-value">{worldState.metrics?.conflictLevel || 0}/100</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🔬</div>
          <div className="metric-content">
            <div className="metric-label">Avg Technology</div>
            <div className="metric-value">
              {Math.round(worldState.countries.reduce((sum, c) => sum + c.technology, 0) / worldState.countries.length)}/100
            </div>
          </div>
        </div>
      </div>

      {worldState.metrics?.explanation && (
        <div className="overseer-summary">
          <h4>👁️ Overseer's Assessment</h4>
          <p>{worldState.metrics.explanation}</p>
          {worldState.metrics.hiddenCosts && (
            <p className="hidden-costs">
              <strong>Hidden Costs:</strong> {worldState.metrics.hiddenCosts}
            </p>
          )}
        </div>
      )}

      <div className="countries-section">
        <h4>🏛️ Nations of Terra Novus</h4>
        <div className="countries-grid">
          {worldState.countries.map((country) => (
            <div 
              key={country.id} 
              className={`country-card ${country.stability < 20 ? 'country-collapsed' : ''}`}
            >
              <div className="country-header">
                <h5>{getPowerRank(country.power)} {country.name}</h5>
                {country.stability < 20 && <span className="collapsed-badge">💀 COLLAPSED</span>}
              </div>
              
              <div className="country-ideology">{country.ideology}</div>
              <p className="country-description">{country.description}</p>

              <div className="country-stats">
                <div className="stat">
                  <div className="stat-label">Power</div>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill stat-power"
                      style={{ width: `${country.power}%` }}
                    />
                  </div>
                  <div className="stat-value">{country.power}</div>
                </div>

                <div className="stat">
                  <div className="stat-label">Stability</div>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill"
                      style={{ 
                        width: `${country.stability}%`,
                        background: getStabilityColor(country.stability)
                      }}
                    />
                  </div>
                  <div className="stat-value">{country.stability}</div>
                </div>

                <div className="stat">
                  <div className="stat-label">Technology</div>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill stat-tech"
                      style={{ width: `${country.technology}%` }}
                    />
                  </div>
                  <div className="stat-value">{country.technology}</div>
                </div>

                <div className="stat">
                  <div className="stat-label">Resources</div>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill stat-resources"
                      style={{ width: `${country.resources}%` }}
                    />
                  </div>
                  <div className="stat-value">{country.resources}</div>
                </div>
              </div>

              <div className="country-info">
                <div className="info-row">
                  <span className="info-icon">👥</span>
                  <span>{(country.population / 1000000).toFixed(1)}M citizens</span>
                </div>
                {country.alliances && country.alliances.length > 0 && (
                  <div className="info-row">
                    <span className="info-icon">🤝</span>
                    <span>{country.alliances.length} alliance(s)</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
