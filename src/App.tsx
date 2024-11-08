import React, {Suspense} from 'react';
import {Canvas} from "react-three-fiber";
import {House2} from "./components/house/House2";
import {OrbitControls, Sky} from '@react-three/drei';

function App() {
  return (
    <div style={{width: '100%', height: '80vh'}}>
      <Canvas camera={{zoom: 1, position: [15, 20, 15]}}>
        <ambientLight intensity={1.5}/>
        <pointLight position={[35, 35, 0]} intensity={1000}/>
        <pointLight position={[-35, 35, 0]} intensity={1000}/>
        <Sky
          distance={450000}
          inclination={0.6}
          azimuth={0.25}
          sunPosition={[100, 10, 100]}/>
        <Suspense fallback={null}>
          <House2/>
        </Suspense>
        <OrbitControls/>
      </Canvas>
    </div>
  );
}

export default App;
