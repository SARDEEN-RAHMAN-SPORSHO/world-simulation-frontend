import React, { useState, useEffect } from 'react';
import './EventLog.css';

export default function EventLog({ simulationId, api }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [simulationId, filter]);

  const fetchLogs = async () => {
    try {
      const response = await api.getSimulationLogs(simulationId, 100);
      setLogs(response.logs || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      setLoading(false);
    }
  };

  const getEventIcon = (eventType) => {
    const icons = {
      'WAR': '⚔️',
      'PEACE': '🕊️',
      'ALLIANCE': '🤝',
      'ALLIANCE_BROKEN': '💔',
      'COLLAPSE': '💥',
      'INNOVATION': '💡',
      'REBELLION': '⚡',
      'REFORM': '📜',
      'ESPIONAGE': '🕵️',
      'NATURAL_DISASTER': '🌪️',
      'RESOURCE_DISCOVERY': '💎',
      'TICK_SUMMARY': '📅',
      'SIMULATION_START': '🚀',
      'SIMULATION_END': '🏁'
    };
    return icons[eventType] || '📰';
  };

  const getEventClass = (eventType) => {
    if (['WAR', 'COLLAPSE', 'REBELLION', 'NATURAL_DISASTER'].includes(eventType)) {
      return 'event-critical';
    }
    if (['ALLIANCE', 'PEACE', 'INNOVATION'].includes(eventType)) {
      return 'event-positive';
    }
    if (['ESPIONAGE', 'ALLIANCE_BROKEN'].includes(eventType)) {
      return 'event-warning';
    }
    return 'event-neutral';
  };

  const filteredLogs = filter === 'ALL' 
    ? logs 
    : logs.filter(log => log.eventType === filter);

  if (loading) {
    return (
      <div className="event-log">
        <h3>📜 Event Chronicle</h3>
        <div className="loading">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="event-log">
      <div className="log-header">
        <h3>📜 Event Chronicle</h3>
        <div className="log-filters">
          <button 
            className={filter === 'ALL' ? 'active' : ''}
            onClick={() => setFilter('ALL')}
          >
            All
          </button>
          <button 
            className={filter === 'WAR' ? 'active' : ''}
            onClick={() => setFilter('WAR')}
          >
            ⚔️ Wars
          </button>
          <button 
            className={filter === 'ALLIANCE' ? 'active' : ''}
            onClick={() => setFilter('ALLIANCE')}
          >
            🤝 Alliances
          </button>
          <button 
            className={filter === 'COLLAPSE' ? 'active' : ''}
            onClick={() => setFilter('COLLAPSE')}
          >
            💥 Collapses
          </button>
          <button 
            className={filter === 'INNOVATION' ? 'active' : ''}
            onClick={() => setFilter('INNOVATION')}
          >
            💡 Innovations
          </button>
        </div>
      </div>

      <div className="log-entries">
        {filteredLogs.length === 0 ? (
          <div className="no-events">No events to display</div>
        ) : (
          filteredLogs.map((log, idx) => (
            <div key={idx} className={`log-entry ${getEventClass(log.eventType)}`}>
              <div className="log-header-row">
                <span className="log-icon">{getEventIcon(log.eventType)}</span>
                <span className="log-type">{log.eventType}</span>
                <span className="log-time">
                  Year {log.year} (Tick {log.tick})
                </span>
              </div>
              
              {log.description && (
                <p className="log-description">{log.description}</p>
              )}
              
              {log.content && (
                <p className="log-content">{log.content}</p>
              )}

              {log.events && log.events.length > 0 && (
                <div className="log-events">
                  {log.events.map((event, i) => (
                    <div key={i} className="sub-event">
                      <span className="sub-event-icon">{getEventIcon(event.type)}</span>
                      <span className="sub-event-text">{event.description}</span>
                    </div>
                  ))}
                </div>
              )}

              {log.overseerInsights && (
                <div className="overseer-analysis">
                  <div className="analysis-header">👁️ Overseer Analysis</div>
                  <p className="analysis-text">{log.overseerInsights.explanation}</p>
                  {log.overseerInsights.hiddenCosts && (
                    <p className="hidden-costs">
                      <strong>Hidden Cost:</strong> {log.overseerInsights.hiddenCosts}
                    </p>
                  )}
                </div>
              )}

              {log.philosophicalInsight && (
                <blockquote className="philosophical-insight">
                  <div className="insight-header">💭 Philosophical Reflection</div>
                  {log.philosophicalInsight.moralAnalysis && (
                    <p>{log.philosophicalInsight.moralAnalysis}</p>
                  )}
                  {log.philosophicalInsight.philosophicalQuestion && (
                    <p className="question">"{log.philosophicalInsight.philosophicalQuestion}"</p>
                  )}
                </blockquote>
              )}

              <div className="log-footer">
                <span className="log-timestamp">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
