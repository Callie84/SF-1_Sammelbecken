import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import './App.css';

function App() {
  const [seeds, setSeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadSeeds();
  }, []);

  const loadSeeds = async () => {
    try {
      const data = await api.getSeeds();
      setSeeds(data);
    } catch (err) {
      console.error('Fehler beim Laden:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return loadSeeds();
    try {
      const data = await api.searchStrain(search);
      setSeeds(data);
    } catch (err) {
      console.error('Suchfehler:', err);
    }
  };

  const runScraper = async () => {
    setLoading(true);
    try {
      await api.runScraper();
      await loadSeeds();
      alert('Scraper erfolgreich ausgefÃ¼hrt!');
    } catch (err) {
      alert('Scraper Fehler: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>ðŸŒ¿ SeedFinder PRO</h1>
        
        <form onSubmit={handleSearch} style={{margin: '20px'}}>
          <input 
            type="text" 
            placeholder="Strain suchen..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{padding: '10px', width: '300px'}}
          />
          <button type="submit" style={{padding: '10px 20px', marginLeft: '10px'}}>
            Suchen
          </button>
        </form>

        <button onClick={runScraper} style={{padding: '10px 20px', marginBottom: '20px'}}>
          ðŸ”„ Scraper starten
        </button>

        {loading ? (
          <p>LÃ¤dt...</p>
        ) : (
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <h2>{seeds.length} Seeds gefunden</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
              {seeds.map((seed, i) => (
                <div key={i} style={{
                  border: '1px solid #ddd', 
                  padding: '15px', 
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9'
                }}>
                  <h3>{seed.strain}</h3>
                  <p><strong>Seedbank:</strong> {seed.seedbank}</p>
                  <p><strong>Preis:</strong> â‚¬{seed.price}</p>
                  {seed.genetics && <p><strong>Genetik:</strong> {seed.genetics}</p>}
                  {seed.thc && <p><strong>THC:</strong> {seed.thc}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;