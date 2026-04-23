import React, { useState, useEffect, useMemo, useCallback } from 'react';
import tableData from './assets/great_table.json';
import dictionary from './assets/dictionary.json';
import { EnochianCore } from './core/EnochianCore';
import { findWordsByGematria } from './core/gematria';
import { aethyrs } from './data/aethyrs';
import Sidebar from './components/Sidebar';
import GreatTableGrid from './components/GreatTableGrid';
import ResultsPanel from './components/ResultsPanel';
import InspectorPanel from './components/InspectorPanel';
import TutorialModal from './components/TutorialModal';

function App() {
  const [extractionMode, setExtractionMode] = useState('none');
  const [hoveredEntity, setHoveredEntity] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [enochianView, setEnochianView] = useState(false);
  const [showSigil, setShowSigil] = useState(false);
  const [sigilPoints, setSigilPoints] = useState([]);
  const [elementalAffinity, setElementalAffinity] = useState('Automatic');
  const [selectedAethyr, setSelectedAethyr] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);

  const engine = useMemo(() => {
    return new EnochianCore(tableData.GreatTable);
  }, []);

  const fullData = useMemo(() => {
    return engine.extractAll();
  }, [engine]);

  const handleSearch = useCallback((searchTerm) => {
    if (!searchTerm || searchTerm.trim().length === 0) {
      setSelectedEntity(null);
      return;
    }

    // Check if it's a number for Reverse Gematria
    if (/^\d+$/.test(searchTerm)) {
      const matches = findWordsByGematria(dictionary, searchTerm);
      setSelectedEntity({
        name: `Value ${searchTerm}`,
        type: 'gematria_reverse',
        matches: matches,
        value: searchTerm
      });
      return;
    }

    setSelectedEntity({
      name: searchTerm,
      cells: [],
      crossCells: []
    });
  }, []);

  const handleAethyrSelect = (aethyrKey) => {
    setSelectedAethyr(aethyrKey);
    if (aethyrKey && aethyrs[aethyrKey]) {
      setSelectedEntity({
        name: aethyrKey,
        type: 'aethyr',
        governors: aethyrs[aethyrKey]
      });
    } else {
      setSelectedEntity(null);
    }
  };

  if (!tableData) {
    return <div style={{color: 'white', padding: '2rem'}}>Loading...</div>;
  }

  const handleSetMode = (mode) => {
    if (extractionMode === mode) {
      setExtractionMode('none');
      setHoveredEntity(null);
      setSelectedEntity(null);
    } else {
      setExtractionMode(mode);
      setHoveredEntity(null);
      setSelectedEntity(null);
    }
  };

  const handleSelectEntity = (entity) => {
    setSelectedEntity(entity);
  };

  return (
    <div className="app-container">
      <Sidebar 
        extractionMode={extractionMode} 
        onSetMode={handleSetMode} 
        enochianView={enochianView}
        onToggleEnochian={() => setEnochianView(!enochianView)}
        onSearch={handleSearch}
        elementalAffinity={elementalAffinity}
        setElementalAffinity={setElementalAffinity}
        selectedAethyr={selectedAethyr}
        onAethyrSelect={handleAethyrSelect}
        onOpenTutorial={() => setShowTutorial(true)}
      />
      
      <div className="main-area">
        <GreatTableGrid 
          data={tableData.GreatTable} 
          extractionMode={extractionMode}
          hoveredEntity={hoveredEntity}
          selectedEntity={selectedEntity}
          enochianView={enochianView}
          showSigil={showSigil}
          setSigilPoints={setSigilPoints}
          sigilPoints={sigilPoints}
          elementalAffinity={elementalAffinity}
          onSearch={handleSearch}
        />
        
        {extractionMode !== 'none' && (
          <ResultsPanel 
            mode={extractionMode}
            data={fullData}
            onHoverEntity={setHoveredEntity}
            onSelectEntity={handleSelectEntity}
            selectedEntity={selectedEntity}
          />
        )}
      </div>

      <InspectorPanel 
        entity={selectedEntity} 
        onClose={() => setSelectedEntity(null)} 
        showSigil={showSigil}
        onToggleSigil={() => setShowSigil(!showSigil)}
        sigilPoints={sigilPoints}
        elementalAffinity={elementalAffinity}
        onSearch={handleSearch}
      />

      <TutorialModal 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)} 
      />
    </div>
  );
}

export default App;
