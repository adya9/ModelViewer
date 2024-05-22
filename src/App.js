//made the label dynamic
import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import LabelComp from './component/LabelComp';
import {v4 as uuidv4} from 'uuid';


function App() {
  const [selectedModel, setSelectedModel] = useState('Astronaut');
  const [clicked, setClicked] = useState(false);
  const [hotspots, setHotspots] = useState([]);
  const [clickPosition, setClickPosition] = useState({ x: null, y: null });
  const [threeDPosition, setThreeDPosition] = useState(null);
  const [currentHotspot, setCurrentHotspot] = useState(null);
  const modelViewerRef = useRef(null);


  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
    setClicked(false);
    setHotspots([]);
    setCurrentHotspot(null);
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
        id:uuidv4(),
        // position: position.toString(),
        // normal: normal.toString(),

        position: `${position.x} ${position.y} ${position.z}`,
        normal: `${normal.x} ${normal.y} ${normal.z}`,
        type:"question",
        annotation: ''
      };
      
      const newHotspotJSON = JSON.stringify(newHotspot);
      console.log(newHotspotJSON);

      setHotspots([...hotspots, newHotspot]);
      setThreeDPosition({ position: position.toString(), normal: normal.toString() });
      setClicked(false);
      setCurrentHotspot(hotspots.length);
    }
  };

  const handleLabelChange = (id, newLabel) => {
    const updatedHotspots = hotspots.map(hotspot =>
      hotspot.id === id ? { ...hotspot, annotation: newLabel } : hotspot
    );
    setHotspots(updatedHotspots);
  };

  const handleLabelDelete = (id) => {
    const indexToDelete = hotspots.findIndex(hotspot => hotspot.id === id);
    const updatedHotspots = hotspots.filter(hotspot => hotspot.id !== id);
    setHotspots(updatedHotspots);

    if (indexToDelete === currentHotspot) {
     
      if (updatedHotspots.length === 0) {
        setCurrentHotspot(null);
      } else if (indexToDelete === updatedHotspots.length) {
       
        setCurrentHotspot(updatedHotspots.length - 1);
      } else {
       
        setCurrentHotspot(indexToDelete);
      }
    } else if (indexToDelete < currentHotspot) {
      
      setCurrentHotspot(currentHotspot - 1);
    }
  };

  const handlePrevClick = () => {
    if (currentHotspot !== null && currentHotspot > 0) {
      setCurrentHotspot(currentHotspot - 1);
      updateCameraOrbit(currentHotspot - 1);
    }
  };

  const handleNextClick = () => {
    if (currentHotspot !== null && currentHotspot < hotspots.length - 1) {
      setCurrentHotspot(currentHotspot + 1);
      updateCameraOrbit(currentHotspot + 1);
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
 

  //used the cartesian coordinates and get their sperical coordinates and pass to camera orbit 
  const updateCameraOrbit = (index) => {
    const modelViewer = modelViewerRef.current;
    if (modelViewer && index !== null && index < hotspots.length) {
      const hotspot = hotspots[index];
      const position = hotspot.position.split(' ').map(Number);
      console.log("Position is"+ position);

      if (position.length === 3) {
        const [x, y, z] = position;

        const radius = Math.sqrt(x * x + y * y + z * z);
        const theta = Math.atan2(y, x);
        const phi = Math.acos(z / radius);

        const newCameraOrbit = `${theta}rad ${phi}rad ${radius}m`;
        modelViewer.cameraOrbit = newCameraOrbit;
        console.log("New orbit is "+newCameraOrbit);
       
      }
    }
  };


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
          // camera-orbit="0.2940971513368917rad 6.4386257620807659rad 4.287888690270461m"
          //camera-orbit="calc(-1.5rad + env(window-scroll-y) * 4rad) calc(0deg + env(window-scroll-y) * 180deg) calc(5m - env(window-scroll-y) * 10m)"
          //camera-orbit="3.2940971513368917rad 1.4386257620807659rad 4.287888690270461m" 
          // camera-target={threeDPosition.position}
          src={`${selectedModel}.glb`}
          poster="poster.webp"
          shadow-intensity="1"
         
          style={{ width: '100%', height: '100%' }}
          ref={modelViewerRef}
        >
          
          {hotspots.map((hotspot,index) => {
            console.log(hotspot)
            return <button
              key={hotspot.id}
              className={`hotspot ${index === currentHotspot ? 'highlight' : ''}`}
              slot={`hotspot-${hotspot.id}`}
              data-position={hotspot.position}
              data-normal={hotspot.normal}
              
            >

              {hotspot.annotation && (
                <div className="annotation">{hotspot.annotation}</div>
              )

              }
            </button>
            
          }

          )}
        </model-viewer>
        <div className="absolute bottom-4 left-10 z-10">
          <button className="py-2 px-5 text-white bg-orange-600 rounded-full hover:bg-orange-500" onClick={handlePrevClick}>PREV</button>
        </div>
        <div className="absolute bottom-4 right-10 z-10">
          <button className="py-2 px-5 text-white bg-orange-600 rounded-full hover:bg-orange-500" onClick={handleNextClick}>NEXT</button>
        </div>
      </div>


      <div className="w-2/12 bg-slate-800 flex flex-col overflow-auto">
        <button className="py-2 px-5 bg-orange-600 text-white font-semibold rounded-md shadow-md hover:bg-orange-500 m-4" onClick={handleClicked}>
          ADD HOTSPOT
        </button>
        {clicked && (
          <div className='bg-zinc-500 opacity-80 h-20 rounded-md m-4 mt-1 p-4'>
            <p className="text-white align-item-center">Click on the 3D object to Add Hotspot</p>
          </div>
        )}

        {threeDPosition && (
          hotspots.map((hotspot) => (
            <LabelComp
              key={hotspot.id}
              id={hotspot.id}
              label={hotspot.annotation}
              onLabelChange={handleLabelChange}
              onDelete={handleLabelDelete}

            />
          ))
        )}

        {/* <div className="m-4 p-4 bg-white rounded-md shadow-md">
          <h3 className="text-lg font-semibold">Click Coordinates:</h3>
          <p>X: {clickPosition.x}, Y: {clickPosition.y}</p>
          {threeDPosition && (
            <>
              <h3 className="text-lg font-semibold">3D Coordinates:</h3>
              <p>Position: {threeDPosition.position}</p>
              <p>Normal: {threeDPosition.normal}</p>
            </>
          )}
        </div> */}
      </div>
    </div>
  );
}


export default App;
