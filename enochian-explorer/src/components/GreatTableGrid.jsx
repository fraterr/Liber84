import React, { useEffect, useRef } from 'react';
import Watchtower from './Watchtower';
import TabletOfUnion from './TabletOfUnion';

function GreatTableGrid({ data, extractionMode, hoveredEntity, selectedEntity, enochianView, showSigil, setSigilPoints, sigilPoints, elementalAffinity, onSearch }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const drawSigil = () => {
      if (!svgRef.current || !selectedEntity || !containerRef.current) {
        setSigilPoints([]);
        return;
      }

      // Get the bounding rect of the relative parent container for coordinate normalization
      const parentRect = containerRef.current.getBoundingClientRect();
      const name = selectedEntity.name;
      let cells = selectedEntity.cells || [];
      const towerId = selectedEntity.towerId;

      let nodes = [];

      if (cells.length > 0 && towerId && towerId !== 'ALL') {
        cells.forEach((cell, idx) => {
          const el = document.getElementById(`cell-${towerId}-${cell.r}-${cell.c}`);
          if (el) nodes.push({ el, char: name[idx] || el.getAttribute('data-letter') });
        });
      } else if (name) {
        const cleanWord = name.toLowerCase().replace(/[^a-z]/g, '');
        
        // Intelligent Automatic Affinity: Determine the primary tower for this word based on letter density
        let primaryTower = elementalAffinity;
        if (elementalAffinity === 'Automatic') {
          const towers = ['Air', 'Water', 'Earth', 'Fire'];
          const scores = towers.map(t => {
            let score = 0;
            for(let c of cleanWord) {
              if (document.querySelector(`#watchtower-${t} .watchtower-cell[data-letter="${c}"]`)) score++;
            }
            return { t, score };
          });
          scores.sort((a, b) => b.score - a.score);
          primaryTower = scores[0].score > 0 ? scores[0].t : 'Air';
          console.log(`Sigil Clustering: Word "${name}" assigned to ${primaryTower} (Score: ${scores[0].score}/${cleanWord.length})`);
        }

        for (let char of cleanWord) {
          let el = null;
          
          // 1. Try Primary Tower (selected or automatic winner)
          el = document.querySelector(`#watchtower-${primaryTower} .watchtower-cell[data-letter="${char}"]`);

          // 2. Priority Fallback: Search in all Elemental Watchtowers
          if (!el) {
            el = document.querySelector(`.great-table-container .watchtower-cell[data-letter="${char}"]`);
          }

          // 3. Final Fallback: Search in Tablet of Union (Spirit)
          if (!el) {
            el = document.querySelector(`.tablet-of-union-wrapper .watchtower-cell[data-letter="${char}"]`);
            if (el) {
              console.log(`Sigil fallback: Letter '${char}' found in Tablet of Union.`);
            }
          }

          if (el) {
            nodes.push({ el, char });
          } else {
            console.warn(`Sigil warning: Letter '${char}' not found in DOM`);
            setSigilPoints([]);
            return;
          }
        }
      }

      const coords = nodes.map(({ el, char }) => {
        const rect = el.getBoundingClientRect();
        const parts = el.id.split('-');
        return {
          char,
          towerId: parts[1],
          r: parseInt(parts[2], 10),
          c: parseInt(parts[3], 10),
          x: rect.left - parentRect.left + (rect.width / 2),
          y: rect.top - parentRect.top + (rect.height / 2)
        };
      });

      setSigilPoints(coords);
    };

    drawSigil();
    
    window.addEventListener('resize', drawSigil);
    return () => window.removeEventListener('resize', drawSigil);
  }, [showSigil, selectedEntity, enochianView, setSigilPoints, elementalAffinity]);

  // Handle Sigil Drawing Animation (Ritual Mode)
  useEffect(() => {
    if (!showSigil || sigilPoints.length < 2 || !svgRef.current) return;

    const paths = svgRef.current.querySelectorAll('.sigil-path:not(.sigil-dashed)');
    paths.forEach(path => {
      const length = path.getTotalLength();
      
      // Set initial state: hidden
      path.style.transition = 'none';
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      
      // Force reflow to register the hidden state
      path.getBoundingClientRect();
      
      // Trigger animation: reveal
      path.style.transition = 'stroke-dashoffset 2.5s ease-in-out';
      path.style.strokeDashoffset = '0';
    });
  }, [sigilPoints, showSigil]);

  const getTowerProps = (towerId) => {
    let highlightCells = [];
    let crossCells = [];

    const activeEntity = hoveredEntity || selectedEntity;

    if (activeEntity) {
      if (activeEntity.towerId === towerId || activeEntity.towerId === 'ALL') {
        highlightCells = activeEntity.cells ? [...activeEntity.cells] : [];
        crossCells = activeEntity.crossCells ? [...activeEntity.crossCells] : [];
      }
    } else if (extractionMode === 'holy_names') {
      for(let i=0; i<12; i++) {
        highlightCells.push({r: 6, c: i});
      }
    }

    if (sigilPoints && sigilPoints.length > 0) {
      const sp = sigilPoints.filter(p => p.towerId === towerId).map(p => ({r: p.r, c: p.c}));
      highlightCells = [...highlightCells, ...sp];
    }

    return { highlightCells, crossCells };
  };

  const renderSigilElements = () => {
    if (!showSigil || sigilPoints.length < 2) return null;

    const paths = [];
    let currentPath = [sigilPoints[0]];
    
    for (let i = 1; i < sigilPoints.length; i++) {
      const p = sigilPoints[i];
      const prev = sigilPoints[i - 1];
      
      if (p.towerId !== prev.towerId) {
        if (currentPath.length > 1) {
          paths.push({ points: [...currentPath], dashed: false });
        }
        paths.push({ points: [prev, p], dashed: true });
        currentPath = [p];
      } else {
        currentPath.push(p);
      }
    }
    if (currentPath.length > 1) {
      paths.push({ points: currentPath, dashed: false });
    }

    const renderPath = (pts) => pts.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");

    const firstPoint = sigilPoints[0];
    const p1 = sigilPoints[sigilPoints.length - 2];
    const p2 = sigilPoints[sigilPoints.length - 1];
    
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx*dx + dy*dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const size = 12; 

    return (
      <g key={selectedEntity?.name || 'sigil'}>
        <circle cx={firstPoint.x} cy={firstPoint.y} r="8" className="sigil-start" />
        
        {paths.map((pathObj, idx) => (
          <path 
            key={idx} 
            d={renderPath(pathObj.points)} 
            className={`sigil-path ${pathObj.dashed ? 'sigil-dashed' : ''}`} 
          />
        ))}

        <line 
          x1={p2.x - nx * size} 
          y1={p2.y - ny * size} 
          x2={p2.x + nx * size} 
          y2={p2.y + ny * size} 
          className="sigil-end"
        />
      </g>
    );
  };

  return (
    <div className="layout-wrapper" style={{ position: 'relative' }} ref={containerRef}>
      <svg className="sigil-overlay" ref={svgRef}>
        {renderSigilElements()}
      </svg>
      
      {data.TabletOfUnion && (
        <TabletOfUnion 
          rows={data.TabletOfUnion} 
          enochianView={enochianView} 
          highlightCells={getTowerProps('TabletOfUnion').highlightCells}
          onSearch={onSearch}
        />
      )}

      <div className="great-table-container">
        <Watchtower name="Air" rows={data.Air} enochianView={enochianView} {...getTowerProps('Air')} />
        <Watchtower name="Water" rows={data.Water} enochianView={enochianView} {...getTowerProps('Water')} />
        <Watchtower name="Earth" rows={data.Earth} enochianView={enochianView} {...getTowerProps('Earth')} />
        <Watchtower name="Fire" rows={data.Fire} enochianView={enochianView} {...getTowerProps('Fire')} />
      </div>
    </div>
  );
}

export default GreatTableGrid;
