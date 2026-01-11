import React, { useState } from 'react';
import SetupPanel from './components/SetupPanel';
import ControlPanel from './components/ControlPanel';
import WorldDashboard from './components/WorldDashboard';
import EventLog from './components/EventLog';
import { api } from './services/api';
import './App.css';

function App() {
  const [simulationId, setSimulationId] = useState(null);
  const [error, setError] = useState(null);

  const handleStart = async (apiKeys, duration, tickInterval) => {
    try {
      setError(null);
      const result = await api.createSimulation(apiKeys, duration, tickInterval);
      setSimulationId(result.simulationId);
    } catch (err) {
      throw err; // Let SetupPanel handle it
    }
  };

  const handleError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌍 World Simulation System</h1>
        <p className="tagline">An autonomous world driven by AI agents</p>
      </header>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <main className="app-main">
        {!simulationId ? (
          <SetupPanel onStart={handleStart} onError={handleError} />
        ) : (
          <div className="simulation-view">
            <ControlPanel simulationId={simulationId} api={api} />
            
            <div className="simulation-content">
              <div className="left-column">
                <WorldDashboard simulationId={simulationId} api={api} />
              </div>
              
              <div className="right-column">
                <EventLog simulationId={simulationId} api={api} />
              </div>
            </div>

            <button 
              className="btn-new-simulation"
              onClick={() => {
                if (confirm('Start a new simulation? Current simulation will continue in background.')) {
                  setSimulationId(null);
                }
              }}
            >
              🔄 New Simulation
            </button>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Terra Novus World Simulation • A system exploring ideology, power, and the cost of perfection
        </p>
        <p className="footer-note">
          This simulation runs continuously in the backend. Close this page anytime and return later.
        </p>
      </footer>
    </div>
  );
}

export default App;
