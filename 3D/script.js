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

// Earth sphere
const geo = new THREE.SphereGeometry(1, 64, 64);
const mat = new THREE.MeshStandardMaterial({
  map: earthTexture,
  roughness: 0.4,
  metalness: 0
});
const earth = new THREE.Mesh(geo, mat);
scene.add(earth);

// Lights
const ambient1 = new THREE.AmbientLight(0x444444, 0.6);
const ambient2 = new THREE.AmbientLight(0x6600cc, 0.3);
scene.add(ambient1, ambient2);

const pointLight = new THREE.PointLight(0xffffff, 1.2);
pointLight.position.set(2, 2, 3);
scene.add(pointLight);

// Mouse-following light
const mouseLight = new THREE.PointLight(0xff66ff, 0.8, 5);
scene.add(mouseLight);

const mouse = { x: 0, y: 0 };
window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Procedural galaxy background (particles)
const starCount = 2000;
const starsGeometry = new THREE.BufferGeometry();
const starPositions = [];

for (let i = 0; i < starCount; i++) {
  const x = (Math.random() - 0.5) * 200;
  const y = (Math.random() - 0.5) * 200;
  const z = (Math.random() - 0.5) * 200;
  starPositions.push(x, y, z);
}

starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
const starsMaterial = new THREE.PointsMaterial({ color: 0xbb00ff, size: 0.2, sizeAttenuation: true });
const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate Earth
  earth.rotation.y += 0.01;
  earth.rotation.x += 0.003;

  // Rotate galaxy slowly
  starField.rotation.y += 0.0005;
  starField.rotation.x += 0.0002;

  // Update mouse light position
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
