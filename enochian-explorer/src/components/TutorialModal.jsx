import React from 'react';

function TutorialModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>How to use Liber 84</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <p className="tutorial-intro">
            Welcome to <strong>Liber 84</strong>, your advanced Enochian Explorer. 
            Here is a quick guide to navigating the Great Table, extracting Holy Names, and using the Sigil Engine.
          </p>

          <div className="tutorial-section">
            <h3>1. The Great Table & Enochian View</h3>
            <img 
              src="/images/tutorial_1.png" 
              alt="Enochian Table" 
              className="tutorial-image"
            />
            <p>
              The core of the app is the <strong>Great Table</strong> composed of the 4 Elemental Watchtowers and the Tablet of Union. 
              Toggle <strong>"Enochian View"</strong> in the sidebar to translate the entire grid into original Enochian glyphs.
            </p>
          </div>

          <div className="tutorial-section">
            <h3>2. Gematria & Intelligent Search</h3>
            <img 
              src="/images/tutorial_2.png" 
              alt="Search" 
              className="tutorial-image"
            />
            <p>
              Use the search bar to find words, entity names, or numeric values. 
              Type a number like <strong>162</strong> to perform a Reverse Gematria search and discover all words sharing that numerical value.
            </p>
          </div>

          <div className="tutorial-section">
            <h3>3. The Sigil Engine (Ritual Drawing)</h3>
            <img 
              src="/images/tutorial_3.png" 
              alt="Sigil Engine" 
              className="tutorial-image"
            />
            <p>
              When you search for a name (e.g., <em>"bataivh"</em>) or click on an extracted entity, the <strong>Sigil Engine</strong> activates. 
              It will intelligently cluster the letters within the dominant Watchtower and dynamically draw the ritual sigil connecting the coordinates.
            </p>
          </div>

          <div className="tutorial-section">
            <h3>4. Exploring the 30 Aethyrs</h3>
            <img 
              src="/images/tutorial_4.png" 
              alt="Aethyrs" 
              className="tutorial-image"
            />
            <p>
              Select an Aethyr from the dropdown menu to explore its specific governors, their sigils, and geographical associations. 
              Click on any governor to inspect their details.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default TutorialModal;
