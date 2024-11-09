import Container from './components/container';
import Header from './components/header';
import './App.css';
import CanvasContainer from './components/CanvasContainer';

function App() {
  
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <CanvasContainer />
    </div>
  );
}

export default App;
