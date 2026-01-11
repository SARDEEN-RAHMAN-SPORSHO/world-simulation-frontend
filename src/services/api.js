
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  async createSimulation(apiKeys, durationHours, tickIntervalMinutes) {
    const response = await fetch(`${API_BASE}/api/simulation/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKeys, durationHours, tickIntervalMinutes })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create simulation');
    }
    
    return response.json();
  },

  async pauseSimulation(simulationId) {
    const response = await fetch(`${API_BASE}/api/simulation/${simulationId}/pause`, {
      method: 'POST'
    });
    return response.json();
  },

  async resumeSimulation(simulationId) {
    const response = await fetch(`${API_BASE}/api/simulation/${simulationId}/resume`, {
      method: 'POST'
    });
    return response.json();
  },

  async getSimulationState(simulationId) {
    const response = await fetch(`${API_BASE}/api/simulation/${simulationId}/state`);
    return response.json();
  },

  async getSimulationLogs(simulationId, limit = 100) {
    const response = await fetch(`${API_BASE}/api/simulation/${simulationId}/logs?limit=${limit}`);
    return response.json();
  },

  async getSimulationReport(simulationId) {
    const response = await fetch(`${API_BASE}/api/simulation/${simulationId}/report`);
    return response.json();
  },

  async listSimulations() {
    const response = await fetch(`${API_BASE}/api/simulations`);
    return response.json();
  },

  async checkHealth() {
    const response = await fetch(`${API_BASE}/api/health`);
    return response.json();
  }
};
