const API_BASE = 'http://localhost:3001';

export const api = {
  async get(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`);
    return res.json();
  },
  
  getSeeds: () => api.get('/api/seeds'),
  getPrices: () => api.get('/api/prices')
};
