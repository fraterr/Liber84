import React from 'react';

function ResultsPanel({ mode, data, onHoverEntity, onSelectEntity, selectedEntity }) {
  const towers = ['Air', 'Water', 'Earth', 'Fire'];
  const quadrants = ['Top-Left', 'Top-Right', 'Bottom-Left', 'Bottom-Right'];

  const handleMouseEnter = (towerId, entity) => {
    onHoverEntity({
      towerId,
      name: entity.name,
      cells: entity.cells,
      crossCells: entity.crossCells
    });
  };

  const handleMouseLeave = () => {
    onHoverEntity(null);
  };

  const handleClick = (towerId, entity) => {
    onSelectEntity({
      towerId,
      name: entity.name || entity,
      cells: entity.cells,
      crossCells: entity.crossCells
    });
  };

  if (mode === 'holy_names') {
    return (
      <div className="results-panel fade-in">
        <h2>Spiritus Sancti Names</h2>
        <div className="results-grid">
          {towers.map(tower => {
            const holyNames = data[tower].HolyNames;
            return (
              <div key={tower} className="result-tower">
                <h3>{tower}</h3>
                <div className="result-names hoverable-group">
                  {holyNames.names.map((name, i) => {
                    const entityObj = { name, cells: holyNames.cells, crossCells: holyNames.crossCells };
                    const isSelected = selectedEntity && selectedEntity.name === name;
                    
                    return (
                      <div 
                        key={i} 
                        className={`name-box interactive ${isSelected ? 'selected' : ''}`}
                        onMouseEnter={() => handleMouseEnter(tower, entityObj)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(tower, entityObj)}
                      >
                        {name}
                      </div>
                    )
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="results-panel full-mode fade-in">
      <h2>Enochian Hierarchies</h2>
      <div className="towers-container">
        {towers.map(tower => {
          const towerData = data[tower];
          return (
            <div key={tower} className="full-result-tower">
              <h3 className="tower-header">{tower} Watchtower</h3>
              
              <div className="hierarchy-section">
                <h4>King</h4>
                <div 
                  className={`name-box king-box interactive ${selectedEntity && selectedEntity.name === towerData.King.name ? 'selected' : ''}`}
                  onMouseEnter={() => handleMouseEnter(tower, towerData.King)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(tower, towerData.King)}
                >
                  {towerData.King.name}
                </div>
              </div>

              <div className="quadrants-grid">
                {quadrants.map(q => {
                  const qData = towerData.Quadrants[q];
                  const kerubicSelected = selectedEntity && selectedEntity.name === qData.Kerubic.name;
                  return (
                    <div key={q} className="quadrant-card">
                      <h5>{q}</h5>
                      
                      <div className="q-section">
                        <span className="q-label">Kerubic:</span>
                        <div 
                          className={`name-box small-box interactive ${kerubicSelected ? 'selected' : ''}`}
                          onMouseEnter={() => handleMouseEnter(tower, qData.Kerubic)}
                          onMouseLeave={handleMouseLeave}
                          onClick={() => handleClick(tower, qData.Kerubic)}
                        >
                          {qData.Kerubic.name}
                        </div>
                      </div>

                      <div className="q-section">
                        <span className="q-label">Servients:</span>
                        <div className="servients-list">
                          {qData.Servient.map((srv, i) => {
                            const srvSelected = selectedEntity && selectedEntity.name === srv.name;
                            return (
                              <div 
                                key={i} 
                                className={`name-box small-box interactive ${srvSelected ? 'selected' : ''}`}
                                onMouseEnter={() => handleMouseEnter(tower, srv)}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => handleClick(tower, srv)}
                              >
                                {srv.name}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResultsPanel;
