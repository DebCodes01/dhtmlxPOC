import React, { useState } from 'react';
import './sidePanel.css';

function SidePanel({isOpen, togglePanel}) {
  return (
    <div id="sidePanel">
      {/* <button onClick={togglePanel} className="open-btn">Open Side Panel</button> */}

      {/* Side Panel */}
      <div className={`side-panel ${isOpen ? 'open' : ''}`}>
        <button onClick={togglePanel} className="close-btn">Close</button>
        <div className="side-panel-content">
          <h2>Side Panel</h2>
          <p>Under construction</p>
        </div>
      </div>
    </div>
  );
}

export default SidePanel;
