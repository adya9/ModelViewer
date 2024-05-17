import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedModel, setSelectedModel] = useState('Astronaut');

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  return (
    <div className="flex h-screen">
      <div className='relative w-10/12 bg-slate-100 flex flex-col justify-center items-center'>

        {/* relative top-0 right-0 p-4 */}
        <div className="absolute top-4 right-4 z-10">
          <select
            className="bg-white border border-gray-300 rounded-md py-2 px-4"
            value={selectedModel}
            onChange={handleModelChange}
          >
            <option value="Astronaut">Astronaut</option>
            <option value="Horse">Horse</option>
            <option value="NeilArmstrong">Neil Armstrong</option>
            <option value="RocketShip">Rocket Ship</option>
            <option value="odd-shape">odd shape</option>
            <option value="vintagetv_background_asset">Vintage TV</option>
          </select>
        </div>
        <model-viewer
          src={`${selectedModel}.glb`}
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          tone-mapping="neutral"
          poster="poster.webp"
          shadow-intensity="1"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="w-2/12 bg-teal-500 flex flex-col ">
        <button class="py-2 px-5 bg-blue-800 text-white font-semibold rounded-md shadow-md hover:bg-violet-700 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-75 m-4">
          ADD HOTSPOT
        </button>
        <p>Adding Hotspot</p>
      </div>
    </div>
  );
}

export default App;
