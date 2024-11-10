import { useState } from 'react';
import './App.css';
import CanvasContainer from './components/CanvasContainer';
import ResponsiveAppBar from './components/HeaderBar';
import ModelContainer from './components/ModelContainer';

interface Response 
  {
    above_file: string | null,
    under_file: string | null,
    elevator_file: string | null
}

function App() {

  // const model = modelLoader.loadModel('../models/building_above.glb');
  const [modelData, setModelData] = useState(null);

const modifyModelData = (modelData: any) => {
  setModelData(modelData)};

  return (
    <div className="App">
      <div style={{marginBottom: '5px'}} >
        <ResponsiveAppBar />
      </div>
      <div style={{ display: 'flex', height: '100vh' }}>
        <CanvasContainer setModelData={modifyModelData}/>
        <ModelContainer modelData={modelData}/>
      </div>
    </div>
  );
}

export default App;
