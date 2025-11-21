import * as THREE from "https://unpkg.com/three@0.162.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.162.0/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "https://unpkg.com/three@0.162.0/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "https://unpkg.com/three@0.162.0/examples/jsm/loaders/GLTFLoader.js";

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);
camera.position.set(0, 1, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 1));
const dir = new THREE.DirectionalLight(0xffffff, 2);
dir.position.set(5, 10, 5);
scene.add(dir);

let currentModel = null;

// Handle file upload
document.getElementById("fileInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  const ext = file.name.split('.').pop().toLowerCase();

  if (currentModel) {
    scene.remove(currentModel);
    currentModel = null;
  }

  // Load GLB/GLTF
  if (ext === "glb" || ext === "gltf") {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      currentModel = gltf.scene;
      scene.add(currentModel);
      centerModel(currentModel);
    });
  }

  // Load FBX
  else if (ext === "fbx") {
    const loader = new FBXLoader();
    loader.load(url, (fbx) => {
      currentModel = fbx;
      scene.add(currentModel);
      centerModel(currentModel);
    });
  }
});

// Center and scale model nicely
function centerModel(model) {
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxAxis = Math.max(size.x, size.y, size.z);

  model.scale.setScalar(2 / maxAxis); // normalize size
  box.setFromObject(model);

  const center = new THREE.Vector3();
  box.getCenter(center);
  model.position.sub(center); // recenter
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}
animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
