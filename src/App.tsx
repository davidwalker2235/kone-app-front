import './App.css';
import CanvasContainer from './components/CanvasContainer';
import ResponsiveAppBar from './components/HeaderBar';
import ModelContainer from './components/ModelContainer';
import modelLoader from './services/modelLoader';

function App() {

  // const model = modelLoader.loadModel('../models/building_above.glb');
  return (
    <div className="App">
      <div style={{marginBottom: '5px'}} >
        <ResponsiveAppBar />
      </div>
      <div style={{ display: 'flex', height: '100vh' }}>
        <CanvasContainer />
        <ModelContainer />
      </div>
    </div>
  );
}

export default App;
