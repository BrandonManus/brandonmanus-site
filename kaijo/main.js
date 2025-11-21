import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- 1. SCENE SETUP ---
const scene = new THREE.Scene();

// Camera (Field of View, Aspect Ratio, Near Clip, Far Clip)
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
// Move camera back so we can see the globe initially
camera.position.z = 3; 

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);


// --- 2. CREATING EARTH ---
// Geometry: A sphere with a radius of 1. 
// 64, 32 are width/height segments to make it look smooth.
const geometry = new THREE.SphereGeometry(1, 64, 32);

// Texture Loader: This loads your PNG file
const textureLoader = new THREE.TextureLoader();

// Load the texture from the assets folder
// NOTE: If your image isn't loading, check the browser console (F12) for errors
const earthTexture = textureLoader.load('assets/earth.png');

// Material: Standard material reacts to light. We set the 'map' to your texture.
const material = new THREE.MeshStandardMaterial({ 
    map: earthTexture,
    roughness: 0.8, //Adjusts how shiny the surface is (0-1)
    metalness: 0.1  //Adjusts how metallic it looks (0-1)
});

// Mesh: Combines geometry and material
const earthMesh = new THREE.Mesh(geometry, material);
scene.add(earthMesh);


// --- 3. LIGHTING ---
// Without light, the standard material will be black.

// Ambient Light: Soft general white light illuminating everywhere
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); 
scene.add(ambientLight);

// Directional Light: Like a sun, coming from the top right
const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
sunLight.position.set(5, 3, 5);
scene.add(sunLight);


// --- 4. CONTROLS ("Flying around") ---
// OrbitControls allow clicking and dragging to rotate around the center
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Adds a smooth feeling of weight
controls.dampingFactor = 0.05;
// Prevent zooming too far in (clipping through earth) or too far out
controls.minDistance = 1.2;
controls.maxDistance = 10;
controls.autoRotate = true; // Optional: slowly rotates when idle
controls.autoRotateSpeed = 0.5;


// --- 5. THE ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);
    
    // Required if enableDamping or autoRotate is true
    controls.update();

    renderer.render(scene, camera);
}
// Start the loop
animate();


// --- 6. RESIZE HANDLER ---
// Keeps the view looking correct if the window is resized
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
