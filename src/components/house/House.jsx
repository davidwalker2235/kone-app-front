/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 house2.gltf
Author: Artjoms Horosilovs (https://sketchfab.com/Artjoms_Horosilovs)
License: CC-BY-NC-SA-4.0 (http://creativecommons.org/licenses/by-nc-sa/4.0/)
Source: https://sketchfab.com/3d-models/sea-keep-lonely-watcher-09a15a0c14cb4accaf060a92bc70413d
Title: Sea Keep "Lonely Watcher"
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export function House(props) {
  const { nodes, materials } = useGLTF('/house.gltf')
  return (
    <group {...props} dispose={null}>
      <group position={[17.117, 218.356, 23.591]} rotation={[-Math.PI / 2, 0, Math.PI]}>
        <group position={[33.745, 38.713, -60.289]}>
          <mesh geometry={nodes.Fortress_Fortress_0.geometry} material={materials.Fortress} />
          <mesh geometry={nodes.Fortress_Fortress_0_1.geometry} material={materials.Fortress} />
          <mesh geometry={nodes.Fortress_Fortress_0_2.geometry} material={materials.Fortress} />
          <mesh geometry={nodes.Fortress_Environment_0.geometry} material={materials.Environment} />
          <mesh geometry={nodes.Fortress_Sand_0.geometry} material={materials.Sand} />
        </group>
      </group>
      <mesh geometry={nodes.Sea_Sea_0.geometry} material={materials.material} position={[-1.388, 326.224, 14.92]} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Sky_Sky_0.geometry} material={materials.material_4} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  )
}

useGLTF.preload('/house.gltf')
