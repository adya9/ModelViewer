// This is hardcoded hotspot created 

import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import LabelComp from './component/LabelComp';

function App() {
  const [selectedModel, setSelectedModel] = useState('Astronaut');
  const [clicked, setClicked] = useState(false);
  const [hotspots, setHotspots] = useState([]);
  const [clickPosition, setClickPosition] = useState({ x: null, y: null });
  const [threeDPosition, setThreeDPosition] = useState(null);
  const modelViewerRef = useRef(null);

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
    setClicked(false);
    setHotspots([]);
  };

  const handleClicked = () => {
    setClicked(true);
  };

  const handleModelClick = (event) => {
    if (!clicked || !modelViewerRef.current) return;

    const { clientX, clientY } = event;

    setClickPosition({ x: clientX, y: clientY });

    const modelViewer = modelViewerRef.current;
    const hitResult = modelViewer.positionAndNormalFromPoint(clientX, clientY);

    if (hitResult) {
      const { position, normal } = hitResult;

      const newHotspot = {
        position: position.toString(),
        normal: normal.toString(),
        annotation: 'New Hotspot created'
      };

      setHotspots([...hotspots, newHotspot]);
      setThreeDPosition({ position: position.toString(), normal: normal.toString() });
      setClicked(false);
    }
  };

  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (modelViewer && clicked) {
      modelViewer.addEventListener('click', handleModelClick);
    }
    return () => {
      if (modelViewer) {
        modelViewer.removeEventListener('click', handleModelClick);
      }
    };
  }, [clicked, hotspots]);

  return (
    <div className="flex h-screen">
      <div className='relative w-10/12 bg-slate-100 flex flex-col justify-center items-center'>
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
          id="hotspot-demo"
          ar
          ar-modes="webxr"
          camera-controls
          touch-action="pan-y"
          src={`${selectedModel}.glb`}
          poster="poster.webp"
          shadow-intensity="1"
          alt="A 3D model of an astronaut."
          style={{ width: '100%', height: '100%' }}
          ref={modelViewerRef}
        >
          {hotspots.map((hotspot,index) => (
            <button
              key={index}
              className="hotspot"
              slot={`hotspot-${index}`}
              data-position={hotspot.position}
              data-normal={hotspot.normal}
            >
              <div className="annotation">{hotspot.annotation}</div>
            </button>
          ))}
        </model-viewer>
      </div>

      <div className="w-2/12 bg-teal-500 flex flex-col">
        <button className="py-2 px-5 bg-blue-800 text-white font-semibold rounded-md shadow-md hover:bg-violet-700 focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-75 m-4" onClick={handleClicked}>
          ADD HOTSPOT
        </button>
        {clicked && (
          <div className='bg-slate-700 opacity-80 h-20 rounded-md m-4 mt-1 p-4'>
            <p className="text-white align-item-center">Click on the 3D object to Add Hotspot</p>
            
          </div>
          
        )}
        {threeDPosition && (
          <div>
            <LabelComp/>
            </div>
        )

        }
        
        <div className="m-4 p-4 bg-white rounded-md shadow-md">
          <h3 className="text-lg font-semibold">Click Coordinates:</h3>
          <p>X: {clickPosition.x}, Y: {clickPosition.y}</p>
          {threeDPosition && (
            <>
              <h3 className="text-lg font-semibold">3D Coordinates:</h3>
              <p>Position: {threeDPosition.position}</p>
              <p>Normal: {threeDPosition.normal}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

