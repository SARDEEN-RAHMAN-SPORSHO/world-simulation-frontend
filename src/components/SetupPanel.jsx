import React, { useState } from 'react';
import './SetupPanel.css';

export default function SetupPanel({ onStart, onError }) {
  const [apiKeys, setApiKeys] = useState({
    overseer: '',
    leaders: ['', '', ''],
    thinker: '',
    strategist: ''
  });
  
  const [duration, setDuration] = useState(72);
  const [tickInterval, setTickInterval] = useState(5);
  const [loading, setLoading] = useState(false);

  const addLeaderKey = () => {
    if (apiKeys.leaders.length < 5) {
      setApiKeys({
        ...apiKeys,
        leaders: [...apiKeys.leaders, '']
      });
    }
  };

  const removeLeaderKey = (index) => {
    if (apiKeys.leaders.length > 1) {
      const newLeaders = apiKeys.leaders.filter((_, i) => i !== index);
      setApiKeys({ ...apiKeys, leaders: newLeaders });
    }
  };

  const updateLeaderKey = (index, value) => {
    const newLeaders = [...apiKeys.leaders];
    newLeaders[index] = value;
    setApiKeys({ ...apiKeys, leaders: newLeaders });
  };

  const handleStart = async () => {
    // Validation
    if (!apiKeys.overseer.trim()) {
      onError('Overseer API key is required');
      return;
    }

    const validLeaders = apiKeys.leaders.filter(k => k.trim());
    if (validLeaders.length === 0) {
      onError('At least one leader API key is required');
      return;
    }

    setLoading(true);

    try {
      await onStart({
        ...apiKeys,
        leaders: validLeaders
      }, duration, tickInterval);
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const estimatedYears = Math.floor((duration * 60) / tickInterval);

  return (
    <div className="setup-panel">
      <h2>🌍 Configure World Simulation</h2>
      <p className="subtitle">Set up your AI agents and simulation parameters</p>

      <div className="api-keys-section">
        <h3>🤖 AI Agent API Keys (Gemini)</h3>
        
        <div className="api-key-group">
          <label>
            <span className="label-icon">👁️</span>
            World Overseer (Required)
          </label>
          <input 
            type="password" 
            value={apiKeys.overseer}
            onChange={e => setApiKeys({...apiKeys, overseer: e.target.value})}
            placeholder="Enter Gemini API key for neutral observer"
            disabled={loading}
          />
          <small>Neutral observer that analyzes world state and calculates stability</small>
        </div>

        <div className="api-key-group">
          <label>
            <span className="label-icon">👑</span>
            Country Leaders (Required, 1-5 keys)
          </label>
          {apiKeys.leaders.map((key, idx) => (
            <div key={idx} className="leader-key-row">
              <input 
                type="password" 
                value={key}
                onChange={e => updateLeaderKey(idx, e.target.value)}
                placeholder={`Leader ${idx + 1} API key`}
                disabled={loading}
              />
              {apiKeys.leaders.length > 1 && (
                <button 
                  onClick={() => removeLeaderKey(idx)}
                  className="btn-remove"
                  disabled={loading}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {apiKeys.leaders.length < 5 && (
            <button 
              onClick={addLeaderKey}
              className="btn-add"
              disabled={loading}
            >
              + Add Leader
            </button>
          )}
          <small>Each leader represents a nation with its own ideology</small>
        </div>

        <div className="api-key-group">
          <label>
            <span className="label-icon">💭</span>
            Philosophical Thinker (Optional)
          </label>
          <input 
            type="password" 
            value={apiKeys.thinker}
            onChange={e => setApiKeys({...apiKeys, thinker: e.target.value})}
            placeholder="Enter Gemini API key for moral commentary"
            disabled={loading}
          />
          <small>Provides philosophical analysis and reveals hidden costs of ideologies</small>
        </div>

        <div className="api-key-group">
          <label>
            <span className="label-icon">⚔️</span>
            Conflict Strategist (Optional)
          </label>
          <input 
            type="password" 
            value={apiKeys.strategist}
            onChange={e => setApiKeys({...apiKeys, strategist: e.target.value})}
            placeholder="Enter Gemini API key for military analysis"
            disabled={loading}
          />
          <small>Analyzes power dynamics and predicts conflict outcomes</small>
        </div>
      </div>

      <div className="simulation-params">
        <h3>⏱️ Simulation Parameters</h3>
        
        <div className="param-group">
          <label>
            Real-Time Duration (hours)
            <span className="param-value">{duration}h</span>
          </label>
          <input 
            type="range"
            min="1"
            max="168"
            value={duration}
            onChange={e => setDuration(parseInt(e.target.value))}
            disabled={loading}
          />
          <small>How long the simulation runs in real-world time (1-168 hours / 1 week)</small>
        </div>

        <div className="param-group">
          <label>
            Tick Interval (minutes)
            <span className="param-value">{tickInterval}min</span>
          </label>
          <input 
            type="range"
            min="1"
            max="60"
            value={tickInterval}
            onChange={e => setTickInterval(parseInt(e.target.value))}
            disabled={loading}
          />
          <small>Time between simulation steps (1 tick = 1 simulated year)</small>
        </div>

        <div className="estimation">
          <p>
            <strong>Estimated:</strong> ~{estimatedYears} simulated years
            <br />
            <small>({Math.floor(duration * 60 / tickInterval)} ticks over {duration} hours)</small>
          </p>
        </div>
      </div>

      <button 
        className="btn-start"
        onClick={handleStart}
        disabled={loading}
      >
        {loading ? '🔄 Starting Simulation...' : '🚀 Start Simulation'}
      </button>

      <div className="info-box">
        <h4>ℹ️ How It Works</h4>
        <ul>
          <li>Each AI agent represents a role in the world (leaders, observers, analysts)</li>
          <li>The simulation runs continuously in the background, even when you close this page</li>
          <li>Every tick (interval), agents make decisions and the world evolves</li>
          <li>You can pause, resume, and review logs at any time</li>
          <li>After the duration, you'll have a complete history of your fictional world</li>
        </ul>
      </div>
    </div>
  );
}
