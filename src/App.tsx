import Container from './components/container';
import Header from './components/header';
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import './App.css';

function App() {
  
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <Header />
      <Container />
    </div>
  );
}

export default App;
