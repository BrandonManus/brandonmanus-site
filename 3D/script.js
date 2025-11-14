import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.164/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.164/examples/jsm/loaders/GLTFLoader.js";

let scene, camera, renderer, controls, mixer;
const clock = new THREE.Clock();

init();
animate();

function init() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  // Camera
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );
  camera.position.set(3, 2, 5);

  // Renderer
  const canvas = document.getElementById("three-canvas");
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1, 0);
  controls.update();

  // Lighting
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.3);
  scene.add(hemi);

  const dir = new THREE.DirectionalLight(0xffffff, 1.1);
  dir.position.set(5, 10, 7);
  dir.castShadow = true;
  scene.add(dir);

  // Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );
  ground.rotation.x = -Math.PI * 0.5;
  ground.receiveShadow = true;
  scene.add(ground);

  // Load Character
  const loader = new GLTFLoader();
  loader.load(
    "./assets/model.glb", // <— REPLACE with your character
    (gltf) => {
      const model = gltf.scene;

      model.traverse((obj) => {
        if (obj.isMesh) obj.castShadow = true;
      });

      model.scale.set(1, 1, 1);
      scene.add(model);

      // Animation
      mixer = new THREE.AnimationMixer(model);

      // pick first animation or replace
      const clip = gltf.animations[0];
      const action = mixer.clipAction(clip);
      action.play();
    },
    undefined,
    (err) => console.error("Model load error:", err)
  );

  // Resize
  window.addEventListener("resize", onResize);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  renderer.render(scene, camera);
}
