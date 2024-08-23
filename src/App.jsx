import React from 'react';

import VesselNav from './components/VesselNav';

function App() {
  const startCoords = [22.1696,91.4996]; // Start coor
  const endCoords = [22.2637,91.7159]; // End coord
  const speed = 20;// Speed

  return (
    <div className="App">
      <VesselNav startCoords={startCoords} endCoords={endCoords} speed={speed} />
    </div>
  );
}

export default App;
