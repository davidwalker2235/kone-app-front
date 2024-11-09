import { Canvas } from 'react-three-fiber';
import { House2 } from './house/House2';
import Scene from './house/Scene';
import { Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';

const ModelContainer = () => {
    return (
        <div style={{ flex: 1 }}>
            <Canvas camera={{zoom: 1, position: [15,20,15]}}>
                <ambientLight intensity={0.5}/>
                <pointLight intensity={1500} position={[35, 35, 0]}/>
                <pointLight intensity={1500} position={[-35, 35, 0]}/>
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
                <OrbitControls />
            </Canvas>
        </div>
    );
}

export default ModelContainer;