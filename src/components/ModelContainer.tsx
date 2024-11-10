import { Canvas } from 'react-three-fiber';
import { House2 } from './house/House2';
import DinamicModel from './house/Scene';
import { Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';

const ModelContainer = ({modelData}: any) => {
    return (
        <div style={{ flex: 1 }}>
            <Canvas camera={{zoom: 1, position: [15,20,15]}}>
                <ambientLight intensity={0.5}/>
                <pointLight intensity={1500} position={[35, 35, 0]}/>
                <pointLight intensity={1500} position={[-35, 35, 0]}/>
                {!!modelData &&
                    <Suspense fallback={null}>
                        <DinamicModel modelData={modelData}/>
                    </Suspense>
                }
                <OrbitControls />
            </Canvas>
        </div>
    );
}

export default ModelContainer;