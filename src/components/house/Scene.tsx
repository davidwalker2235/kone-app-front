import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Html, useProgress, OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(2)} % cargado</Html>;
}

function Model({ modelPath, texturePath }: any) {
  const gltf = useLoader(GLTFLoader, modelPath);
  console.log('Modelo cargado:', modelPath, gltf);

  const texture = useLoader(TextureLoader, texturePath);
  console.log('Textura cargada:', texturePath, texture);

  const scene = Array.isArray(gltf) ? gltf[0].scene : gltf.scene;
  scene.position.set(0, 0, 0); // Ajustar posición si es necesario
  scene.scale.set(1, 1, 1);    // Ajustar escala si es necesario

  scene.traverse((node) => {
    if (node instanceof THREE.Mesh) {
      if (Array.isArray(node.material)) {
        node.material.forEach((material) => {
          material.map = texture;
          material.transparent = true;
          material.opacity = 0.5;
          material.depthWrite = false;
          material.depthTest = true;
          material.side = THREE.DoubleSide;
          material.needsUpdate = true;
        });
      } else if (node.material) {
        node.material.map = texture;
        node.material.transparent = true;
        node.material.opacity = 0.5;
        node.material.depthWrite = false;
        node.material.depthTest = true;
        node.material.side = THREE.DoubleSide;
        node.material.needsUpdate = true;
      }
    }
  });

  scene.rotation.x = THREE.MathUtils.degToRad(-90);
  scene.rotation.y = THREE.MathUtils.degToRad(0);


  return <primitive object={Array.isArray(gltf) ? gltf[0].scene : gltf.scene} />;
}

function Scene() {
  return (
    <>
      {/* Iluminación */}
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <ambientLight intensity={0.5} />

      {/* Ejes para referencia */}

      {/* Modelos */}
      <Suspense fallback={<Loader />}>
        <Model
          modelPath="/building_above.glb"
          texturePath="/blue-color.png"
        />
        <Model
          modelPath="/building_under.glb"
          texturePath="/brown-color.png"
        />
        <Model
          modelPath="/elevator.glb"
          texturePath="/red-color.png"
        />
      </Suspense>

      {/* Controles de órbita */}
      <OrbitControls />
    </>
  );
}

function App() {
  return (
    <>
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <ambientLight intensity={0.5} />

      <Suspense fallback={<Loader />}>
        <Model
          modelPath="/building_above.glb"
          texturePath="/blue-color.png"
        />
        <Model
          modelPath="/building_under.glb"
          texturePath="/brown-color.png"
        />
        <Model
          modelPath="/elevator.glb"
          texturePath="/red-color.png"
        />
      </Suspense>
    </>
  );
}

export default App;