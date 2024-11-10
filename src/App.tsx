import { useState } from 'react';
import './App.css';
import CanvasContainer from './components/CanvasContainer';
import ResponsiveAppBar from './components/HeaderBar';
import ModelContainer from './components/ModelContainer';
import { useLocation } from 'react-router-dom';

interface Response 
  {
    above_file: string | null,
    under_file: string | null,
    elevator_file: string | null
}

function App() {
  const {state} = useLocation();
  const { id } = state;
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
        <CanvasContainer setModelData={modifyModelData} mapId={id}/>
        {!!modelData || id === 5 ? <iframe src="http://10.87.1.131:8504" height="450" style={{width:'50%', height: "100%", border:'none'}}></iframe> : null}
        {/*<ModelContainer modelData={modelData}/>*/}
      </div>
    </div>
  );
}

export default App;
