import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { aethyrs } from '../data/aethyrs';

function Sidebar({ 
  extractionMode, 
  onSetMode, 
  enochianView, 
  onToggleEnochian, 
  onSearch, 
  elementalAffinity, 
  setElementalAffinity,
  selectedAethyr,
  onAethyrSelect,
  onOpenTutorial
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm.trim());
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  const handleInputChange = (e) => {
    // Allow letters AND numbers for Gematria search
    const sanitized = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    setSearchTerm(sanitized);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <div className="sidebar">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Logo size={64} />
        </div>
        <h1>Liber 84</h1>
      </div>

      <div className="affinity-container" style={{marginBottom: '1rem'}}>
        <label className="q-label">Elemental Affinity</label>
        <select 
          value={elementalAffinity} 
          onChange={(e) => setElementalAffinity(e.target.value)}
          className="search-input"
          style={{padding: '0.5rem'}}
        >
          <option value="Automatic">Automatic (Entire Tablet)</option>
          <option value="Air">Air</option>
          <option value="Water">Water</option>
          <option value="Earth">Earth</option>
          <option value="Fire">Fire</option>
        </select>
      </div>

      <div className="affinity-container" style={{marginBottom: '1rem'}}>
        <label className="q-label">Explore 30 Aethyrs (Visioning)</label>
        <select 
          value={selectedAethyr || ''} 
          onChange={(e) => onAethyrSelect(e.target.value || null)}
          className="search-input"
          style={{padding: '0.5rem'}}
        >
          <option value="">None (Inactive)</option>
          {Object.keys(aethyrs).sort((a, b) => parseInt(b) - parseInt(a)).map(aethyr => (
            <option key={aethyr} value={aethyr}>{aethyr}</option>
          ))}
        </select>
      </div>

      <div className="search-container">
        <label className="q-label">Search (Letters or Numbers)</label>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Word or Gematria (e.g. 162)..." 
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      
      <div style={{marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        <div className="toggle-container" style={{marginBottom: '1rem'}}>
          <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--accent-color)'}}>
            <input 
              type="checkbox" 
              checked={enochianView} 
              onChange={onToggleEnochian} 
              style={{width: '18px', height: '18px', cursor: 'pointer'}}
            />
            Enochian View
          </label>
        </div>

        <button 
          className={`btn-extract ${extractionMode === 'holy_names' ? 'active' : ''}`}
          onClick={() => onSetMode('holy_names')}
        >
          {extractionMode === 'holy_names' ? 'Hide Holy Names' : 'Extract Holy Names (Spiritus Sancti)'}
        </button>

        <button 
          className={`btn-extract ${extractionMode === 'full' ? 'active' : ''}`}
          onClick={() => onSetMode('full')}
        >
          {extractionMode === 'full' ? 'Hide Hierarchies' : 'Extract King and Hierarchies'}
        </button>

        <div style={{ marginTop: 'auto', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--panel-border)' }}>
          <button 
            className="btn-extract"
            onClick={onOpenTutorial}
            style={{ borderColor: 'var(--text-muted)', color: 'var(--text-color)' }}
          >
            Tutorial
          </button>
          
          <a 
            href="https://buymeacoffee.com/practicalhumanism" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-extract"
            style={{ textDecoration: 'none', textAlign: 'center', backgroundColor: 'var(--accent-color)', color: '#050505', fontWeight: 'bold' }}
          >
            Support the Project
          </a>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
