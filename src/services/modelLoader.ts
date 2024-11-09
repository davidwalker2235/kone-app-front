import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class ModelLoaderService {
    private loader: GLTFLoader;

    private dracoLoader: DRACOLoader;

    constructor() {
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath('../models/draco/');
        this.loader = new GLTFLoader();
        this.loader.setDRACOLoader(this.dracoLoader);
    }

    loadModel(url: string): Promise<THREE.Group> {
        return new Promise((resolve, reject) => {
            this.loader.load(
                'src/models/building_above.glb',
                (gltf) => {
                    resolve(gltf.scene);
                },
                undefined,
                (error) => {
                    reject(error);
                }
            );
        });
    }
}

export default new ModelLoaderService();