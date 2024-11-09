import './App.css';
import CanvasContainer from './components/CanvasContainer';
import ModelContainer from './components/ModelContainer';

function App() {
  
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <CanvasContainer />
      <ModelContainer />
    </div>
  );
}

export default App;
