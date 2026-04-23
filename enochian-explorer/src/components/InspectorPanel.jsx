import React from 'react';
import { calculateGematria } from '../core/gematria';
import { getPhoneticPronunciation } from '../core/phonetic';
import dictionary from '../assets/dictionary.json';

function InspectorPanel({ entity, onClose, showSigil, onToggleSigil, sigilPoints, elementalAffinity, onSearch }) {
  if (!entity || !entity.name) return null;

  // Multi-result types
  if (entity.type === 'gematria_reverse' || entity.type === 'aethyr') {
    const items = entity.type === 'gematria_reverse' ? entity.matches : entity.governors.map(g => ({ name: g }));
    const title = entity.type === 'gematria_reverse' 
      ? `Matches for Value ${entity.value}` 
      : `Governors of ${entity.name}`;

    return (
      <div className="inspector-panel fade-in">
        <div className="inspector-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="inspector-content">
          <p style={{fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem'}}>
            {entity.type === 'gematria_reverse' 
              ? `Found ${items.length} words with gematria value ${entity.value}:`
              : `The following governors belong to the Aethyr ${entity.name}:`}
          </p>
          <div className="results-list" style={{ maxHeight: 'calc(100vh - 15rem)', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {items.length > 0 ? items.map((item, idx) => (
              <div 
                key={idx} 
                className="name-box interactive" 
                style={{ marginBottom: '0.8rem', padding: '0.8rem', textAlign: 'left', fontSize: '1rem' }}
                onClick={() => onSearch(item.name)}
              >
                <div style={{ color: 'var(--accent-hover)', fontFamily: 'var(--font-primary)', marginBottom: '0.2rem' }}>
                  {item.name}
                </div>
                {item.meaning && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-color)', opacity: 0.8, fontStyle: 'italic', fontFamily: 'var(--font-secondary)' }}>
                    {item.meaning}
                  </div>
                )}
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No matches found in dictionary.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Single entity logic
  const { total, breakdown } = calculateGematria(entity.name);
  const phonetic = getPhoneticPronunciation(entity.name);
  
  const searchName = entity.name.toLowerCase();
  const meaning = dictionary[searchName] || "Meaning not found in archive";

  const exportSigilToPNG = () => {
    if (!sigilPoints || sigilPoints.length < 2) return;

    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0a0a0c'; // Updated to match Obsidian background
    ctx.fillRect(0, 0, 500, 500);

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    sigilPoints.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });

    const padding = 60;
    const drawWidth = 500 - padding * 2;
    const drawHeight = 500 - padding * 2;
    
    const sigilWidth = Math.max(maxX - minX, 1);
    const sigilHeight = Math.max(maxY - minY, 1);
    
    const scale = Math.min(drawWidth / sigilWidth, drawHeight / sigilHeight);
    
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    
    const transformPoint = (p) => ({
      x: 250 + (p.x - cx) * scale,
      y: 250 + (p.y - cy) * scale,
      towerId: p.towerId
    });

    const tPoints = sigilPoints.map(transformPoint);

    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = '#d4af37';
    ctx.shadowBlur = 15;

    for (let i = 1; i < tPoints.length; i++) {
      ctx.beginPath();
      ctx.moveTo(tPoints[i-1].x, tPoints[i-1].y);
      ctx.lineTo(tPoints[i].x, tPoints[i].y);
      
      if (tPoints[i].towerId !== tPoints[i-1].towerId) {
        ctx.setLineDash([10, 10]);
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)'; // Soft dashed gold
      } else {
        ctx.setLineDash([]);
        ctx.strokeStyle = '#d4af37';
      }
      ctx.stroke();
    }
    
    ctx.setLineDash([]);
    ctx.strokeStyle = '#d4af37';

    ctx.beginPath();
    ctx.arc(tPoints[0].x, tPoints[0].y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#0a0a0c'; 
    ctx.fill();
    ctx.stroke();

    const p1 = tPoints[tPoints.length - 2];
    const p2 = tPoints[tPoints.length - 1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const size = 15;

    ctx.beginPath();
    ctx.moveTo(p2.x - nx * size, p2.y - ny * size);
    ctx.lineTo(p2.x + nx * size, p2.y + ny * size);
    ctx.stroke();

    const dataURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `${searchName}_sigil.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const fallbackPoints = (elementalAffinity !== 'Automatic' && sigilPoints) 
    ? sigilPoints.filter(p => p.towerId !== elementalAffinity) 
    : [];
  
  const fallbackChars = Array.from(new Set(fallbackPoints.map(p => p.char.toUpperCase())));

  return (
    <div className="inspector-panel fade-in">
      <div className="inspector-header">
        <h3>Enochian Inspector</h3>
        <button className="close-btn" onClick={onClose}>&times;</button>
      </div>
      
      <div className="inspector-content">
        <div className="inspector-section">
          <button 
            className={`btn-extract ${showSigil ? 'active' : ''}`} 
            onClick={onToggleSigil}
            style={{width: '100%', marginBottom: '0.5rem'}}
          >
            {showSigil ? 'Hide Sigil on Tablet' : 'Show Sigil on Tablet'}
          </button>
          
          {showSigil && sigilPoints && sigilPoints.length > 1 && (
            <button 
              className="btn-extract"
              onClick={exportSigilToPNG}
              style={{width: '100%', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download Talisman (PNG)
            </button>
          )}
        </div>

        <div className="inspector-section">
          <span className="inspector-label">Name (Latin):</span>
          <div className="inspector-value latin-name">{entity.name}</div>
        </div>

        <div className="inspector-section">
          <span className="inspector-label">Name (Enochian):</span>
          <div className="inspector-value enochian-name enochian-font">{entity.name}</div>
        </div>

        <div className="inspector-section">
          <span className="inspector-label">Gematria:</span>
          <div className="inspector-value gematria-total">{total}</div>
          <div className="gematria-breakdown">{breakdown}</div>
        </div>

        <div className="inspector-section">
          <span className="inspector-label" style={{color: 'var(--accent-color)'}}>Ritual Pronunciation (Golden Dawn):</span>
          <div className="inspector-value" style={{fontSize: '1.2rem', letterSpacing: '1.5px', textTransform: 'capitalize', fontStyle: 'italic', fontWeight: 300}}>
            {phonetic}
          </div>
        </div>

        <div className="inspector-section">
          <span className="inspector-label">Coordinates:</span>
          <div className="inspector-value">
            {sigilPoints && sigilPoints.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '1rem', color: 'var(--text-color)' }}>
                {sigilPoints.map((p, idx) => {
                  const isFallback = elementalAffinity !== 'Automatic' && p.towerId !== elementalAffinity;
                  return (
                    <li key={idx} style={{marginBottom: '4px', color: isFallback ? '#e74c3c' : 'inherit'}}>
                      <strong style={{color: isFallback ? '#e74c3c' : 'var(--accent-color)'}}>{p.char.toUpperCase()}</strong> : {p.towerId} ({p.c}, {p.r})
                    </li>
                  );
                })}
              </ul>
            ) : (
              <span style={{color: 'var(--text-muted)'}}>N/A</span>
            )}
            
            {fallbackChars.length > 0 && (
              <div className="fade-in" style={{ marginTop: '0.8rem', padding: '0.6rem', backgroundColor: 'rgba(231, 76, 60, 0.15)', borderLeft: '3px solid #e74c3c', fontSize: '0.8rem', color: '#e74c3c', borderRadius: '0 4px 4px 0' }}>
                <strong>⚠️ Warning:</strong> Some letters ({fallbackChars.join(', ')}) are not present in the selected element and were dynamically extracted from the global Tablet.
              </div>
            )}
          </div>
        </div>

        <div className="inspector-section">
          <span className="inspector-label">Translation Note:</span>
          <div className="inspector-value translation-note">
            <em>{meaning}</em>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InspectorPanel;
