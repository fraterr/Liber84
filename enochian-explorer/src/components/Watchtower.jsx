import React from 'react';

function Watchtower({ name, rows, highlightCells, crossCells, enochianView }) {
  
  const isCellInList = (r, c, list) => {
    return list.some(cell => cell.r === r && cell.c === c);
  };

  return (
    <div className="watchtower-wrapper" id={`watchtower-${name}`}>
      <h3 className="watchtower-title">{name}</h3>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <div className="watchtower-grid">
          {rows.map((rowString, rowIndex) => {
            return Array.from(rowString).map((char, colIndex) => {
              const isHighlighted = isCellInList(rowIndex, colIndex, highlightCells);
              const isCross = isCellInList(rowIndex, colIndex, crossCells);
              
              let className = "watchtower-cell";
              if (isHighlighted) className += " highlighted";
              if (isCross && !isHighlighted) className += " cross-highlight";
              if (enochianView) className += " enochian-font";

              return (
                <div 
                  id={`cell-${name}-${rowIndex}-${colIndex}`}
                  key={`${rowIndex}-${colIndex}`} 
                  className={className}
                  data-letter={char.toLowerCase()}
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

export default Watchtower;
