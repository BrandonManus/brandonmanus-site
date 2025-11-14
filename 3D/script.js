import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164/build/three.module.js";

// Scene & camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 3;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load Earth texture
const loader = new THREE.TextureLoader();
const earthTexture = loader.load("../assets/earth.png");

// Sphere
const geo = new THREE.SphereGeometry(1, 64, 64);
const mat = new THREE.MeshStandardMaterial({
  map: earthTexture,
  roughness: 0.4,
  metalness: 0
});
const earth = new THREE.Mesh(geo, mat);
scene.add(earth);

// Lights
const ambient1 = new THREE.AmbientLight(0x444444, 0.6); // soft gray
const ambient2 = new THREE.AmbientLight(0x6600cc, 0.3); // subtle purple
scene.add(ambient1, ambient2);

const pointLight = new THREE.PointLight(0xffffff, 1.2);
pointLight.position.set(2, 2, 3);
scene.add(pointLight);

// Mouse light
const mouseLight = new THREE.PointLight(0xff66ff, 0.8, 5);
scene.add(mouseLight);

// Background: galaxy image
scene.background = loader.load("../assets/galaxy.jpg"); // dark galaxy

// Mouse tracking
const mouse = { x: 0, y: 0 };
window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Animation
function animate() {
  requestAnimationFrame(animate);

  // Rotate Earth
  earth.rotation.y += 0.01;
  earth.rotation.x += 0.003;

  // Update mouse light
  mouseLight.position.x = mouse.x * 5;
  mouseLight.position.y = mouse.y * 5;
  mouseLight.position.z = 2;

  renderer.render(scene, camera);
}

animate();

// Handle resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
