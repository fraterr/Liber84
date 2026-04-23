import React from 'react';

function TabletOfUnion({ rows, highlightCells, enochianView, onSearch }) {
  
  const isCellInList = (r, c, list) => {
    return list.some(cell => cell.r === r && cell.c === c);
  };

  return (
    <div className="watchtower-wrapper tablet-of-union-wrapper" id="watchtower-TabletOfUnion" style={{ marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
      <h3 className="watchtower-title" style={{ color: 'var(--accent-color)' }}>Tablet of Union</h3>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <div className="watchtower-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
          {rows.map((rowString, rowIndex) => {
            return Array.from(rowString).map((char, colIndex) => {
              const isHighlighted = isCellInList(rowIndex, colIndex, highlightCells);
              
              let className = "watchtower-cell";
              if (isHighlighted) className += " highlighted";
              if (enochianView) className += " enochian-font";

              return (
                <div 
                  id={`cell-TabletOfUnion-${rowIndex}-${colIndex}`}
                  key={`${rowIndex}-${colIndex}`} 
                  className={className}
                  data-letter={char.toLowerCase()}
                  onClick={() => onSearch && onSearch(rowString)}
                  style={{ cursor: 'pointer' }}
                  title={`Click to search: ${rowString}`}
                >
                  {char}
                </div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
}

export default TabletOfUnion;
