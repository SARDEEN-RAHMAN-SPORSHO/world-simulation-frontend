import React, { useState, useEffect } from 'react';
import './ControlPanel.css';

export default function ControlPanel({ simulationId, api }) {
  const [status, setStatus] = useState('LOADING');
  const [worldState, setWorldState] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [simulationId]);

  const fetchStatus = async () => {
    try {
      const state = await api.getSimulationState(simulationId);
      setWorldState(state);
      setStatus(state.status);
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  };

  const handlePause = async () => {
    setLoading(true);
    try {
      await api.pauseSimulation(simulationId);
      setStatus('PAUSED');
    } catch (error) {
      console.error('Failed to pause:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    setLoading(true);
    try {
      await api.resumeSimulation(simulationId);
      setStatus('RUNNING');
    } catch (error) {
      console.error('Failed to resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'RUNNING': return '▶️';
      case 'PAUSED': return '⏸️';
      case 'COMPLETED': return '🏁';
      case 'FAILED': return '❌';
      default: return '⏳';
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case 'RUNNING': return 'status-running';
      case 'PAUSED': return 'status-paused';
      case 'COMPLETED': return 'status-completed';
      case 'FAILED': return 'status-failed';
      default: return 'status-loading';
    }
  };

  return (
    <div className="control-panel">
      <div className="status-section">
        <div className={`status-indicator ${getStatusClass()}`}>
          <span className="status-icon">{getStatusIcon()}</span>
          <span className="status-text">{status}</span>
        </div>

        {worldState && (
          <div className="world-info">
            <div className="info-item">
              <span className="info-label">World:</span>
              <span className="info-value">{worldState.worldName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Year:</span>
              <span className="info-value">{worldState.year}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Tick:</span>
              <span className="info-value">{worldState.tick}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Stability:</span>
              <span className="info-value">
                {worldState.metrics?.stabilityIndex || 0}/100
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="control-buttons">
        <button
          onClick={handlePause}
          disabled={status !== 'RUNNING' || loading}
          className="btn-control btn-pause"
        >
          ⏸️ Pause
        </button>
        
        <button
          onClick={handleResume}
          disabled={status === 'RUNNING' || status === 'COMPLETED' || loading}
          className="btn-control btn-resume"
        >
          ▶️ Resume
        </button>
      </div>

      {worldState?.metrics && (
        <div className="metrics-preview">
          <h4>Current State</h4>
          <div className="metric-bar">
            <div className="metric-label">Stability Index</div>
            <div className="bar">
              <div 
                className="bar-fill"
                style={{ width: `${worldState.metrics.stabilityIndex}%` }}
              />
            </div>
            <div className="metric-value">{worldState.metrics.stabilityIndex}/100</div>
          </div>
          
          <div className="metric-bar">
            <div className="metric-label">Survival Rate</div>
            <div className="bar">
              <div 
                className="bar-fill bar-fill-green"
                style={{ width: `${worldState.metrics.survivalRate || 100}%` }}
              />
            </div>
            <div className="metric-value">{worldState.metrics.survivalRate || 100}%</div>
          </div>
          
          <div className="metric-bar">
            <div className="metric-label">Conflict Level</div>
            <div className="bar">
              <div 
                className="bar-fill bar-fill-red"
                style={{ width: `${worldState.metrics.conflictLevel || 0}%` }}
              />
            </div>
            <div className="metric-value">{worldState.metrics.conflictLevel || 0}/100</div>
          </div>
        </div>
      )}
    </div>
  );
}
