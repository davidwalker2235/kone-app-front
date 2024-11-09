import './App.css';
import CanvasContainer from './components/CanvasContainer';
import ResponsiveAppBar from './components/HeaderBar';
import LoadingDialog from './components/LoadingDialog';
import ModelContainer from './components/ModelContainer';

function App() {
  
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
