import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164/build/three.module.js';

// -------------------------------------------------
// Scene, Camera, Renderer
// -------------------------------------------------
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1);
document.body.appendChild(renderer.domElement);

// -------------------------------------------------
// Lights
// -------------------------------------------------
const directional = new THREE.DirectionalLight(0xffffff, 2);
directional.position.set(3, 3, 5);
scene.add(directional);

const ambient = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambient);

// -------------------------------------------------
// Load texture → create Earth
// -------------------------------------------------
const loader = new THREE.TextureLoader();
loader.load(
  // ←←←  THIS POINTS TO YOUR ASSET  ←←←
  "assets/earth.png",

  // onLoad
  (texture) => {
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.5,
      metalness: 0.1,
    });

    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // -------------------------------------------------
    // Animation loop (now **outside** the loader)
    // -------------------------------------------------
    function animate() {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.003;   // slow spin
      renderer.render(scene, camera);
    }
    animate();
  },

  // onProgress (optional)
  undefined,

  // onError
  (err) => console.error("TEXTURE FAILED TO LOAD:", err)
);

// -------------------------------------------------
// Handle window resize
// -------------------------------------------------
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
