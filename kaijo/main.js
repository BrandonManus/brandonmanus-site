import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

// --- SCENE SETUP ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2a2a2a);

// Grid for reference
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting (Crucial for visibility)
const ambientLight = new THREE.AmbientLight(0xffffff, 1); 
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

// --- LOADERS SETUP ---
const gltfLoader = new GLTFLoader();
// Register VRM plugin for GLTF loader
gltfLoader.register((parser) => new VRMLoaderPlugin(parser));

const fbxLoader = new FBXLoader();
const stlLoader = new STLLoader();

let currentModel = null;

// --- DRAG & DROP LOGIC ---
window.addEventListener('dragover', (e) => e.preventDefault(), false);
window.addEventListener('drop', (e) => {
    e.preventDefault();
    
    // Hide instruction text
    document.getElementById('info').style.display = 'none';

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const extension = file.name.split('.').pop().toLowerCase();

    loadModel(url, extension);
}, false);

// --- LOADING LOGIC ---
function loadModel(url, ext) {
    // Remove old model
    if (currentModel) {
        scene.remove(currentModel);
        // Dispose memory (optional but good practice)
        currentModel = null;
    }

    switch (ext) {
        case 'gltf':
        case 'glb':
        case 'vrm': // VRM is technically a GLB
            gltfLoader.load(url, (gltf) => {
                const model = gltf.scene || gltf.userData.vrm?.scene;
                
                // Handle VRM specific logic
                if (gltf.userData.vrm) {
                    VRMUtils.removeUnnecessaryJoints(gltf.scene);
                    VRMUtils.rotateVRM0(gltf.userData.vrm);
                }
                
                addToScene(model);
            }, undefined, (error) => console.error(error));
            break;

        case 'fbx':
            fbxLoader.load(url, (fbx) => {
                addToScene(fbx);
            }, undefined, (error) => console.error(error));
            break;

        case 'stl':
            stlLoader.load(url, (geometry) => {
                const material = new THREE.MeshStandardMaterial({ color: 0x808080 });
                const mesh = new THREE.Mesh(geometry, material);
                addToScene(mesh);
            }, undefined, (error) => console.error(error));
            break;

        default:
            alert(`File format .${ext} not supported yet.`);
    }
}

function addToScene(object) {
    currentModel = object;
    scene.add(object);
    fitCameraToObject(object);
}

// Helper to center camera on loaded object
function fitCameraToObject(object) {
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 * Math.tan(fov * 2));
    
    cameraZ *= 1.5; // Zoom out a little
    camera.position.z = center.z + cameraZ;
    
    const minZ = box.min.z;
    const cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ;

    camera.far = cameraToFarEdge * 3;
    camera.updateProjectionMatrix();
    controls.target.copy(center);
    controls.update();
}

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
