// Import modules FIRST — absolutely no code above this line
import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

// Canvas
const canvas = document.getElementById("viewer");

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera
const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    200
);
camera.position.set(0, 1.4, 3);

// Lighting
scene.add(new THREE.HemisphereLight(0xffffff, 0x333333, 1.2));

const dir = new THREE.DirectionalLight(0xffffff, 1.0);
dir.position.set(5, 10, 7);
scene.add(dir);

// GLTF Loader
const loader = new GLTFLoader();

loader.load(
    "../assets/kaijo.glb",   // relative path is correct for /kaijo/
    (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        document.getElementById("loading").style.display = "none";

        // Adjust height if needed
        model.position.set(0, -1, 0);
    },
    undefined,
    (err) => {
        console.error("Failed to load model:", err);
    }
);

// Animation loop
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
