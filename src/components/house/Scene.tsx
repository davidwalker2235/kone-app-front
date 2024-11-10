import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Html, useProgress, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface Response 
  {
    above_file: string | null,
    under_file: string | null,
    elevator_file: string | null
}

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(2)} % cargado</Html>;
}

function Model({ arrayBuffer, texturePath }: any) {
  const [gltf, setGltf] = useState<any>();
  const texture = useLoader(TextureLoader, texturePath);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.parse(
      arrayBuffer,
      '',
      (loadedGltf: any) => {
        setGltf(loadedGltf);
      },
      (error) => {
        console.error('Error al cargar el modelo GLTF:', error);
      }
    );
  }, [arrayBuffer]);

  if (!gltf) {
    // Puedes mostrar un indicador de carga aquí si lo deseas
    return null;
  }
  const scene = Array.isArray(gltf) ? gltf[0].scene : gltf.scene;
  scene.position.set(0, 0, 0); // Ajustar posición si es necesario
  scene.scale.set(1, 1, 1);  

  const sss = scene.traverse((node: any) => {
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
  })

  scene.rotation.x = THREE.MathUtils.degToRad(-90);
  scene.rotation.y = THREE.MathUtils.degToRad(0);

  return <primitive object={scene} />;
}

function DinamicModel({modelData}: any) {
  return (
    <>
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <ambientLight intensity={0.5} />

      <Suspense fallback={<Loader />}>
        <Model
          arrayBuffer={modelData.above_file}
          texturePath="/blue-color.png"
        />
        <Model
          arrayBuffer={modelData.under_file}
          texturePath="/brown-color.png"
        />
        <Model
          arrayBuffer={modelData.elevator_file}
          texturePath="/red-color.png"
        />
      </Suspense>
    </>
  );
}

export default DinamicModel;