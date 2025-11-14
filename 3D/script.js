import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164/build/three.module.js";

let scene, camera, renderer, earth;

init();
animate();

function init() {
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 3);

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("three-canvas"),
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Light
  const light = new THREE.PointLight(0xffffff, 1.2);
  light.position.set(3, 3, 3);
  scene.add(light);

  // Earth Geometry + Texture
  const texture = new THREE.TextureLoader().load("./assets/earth.jpg");

  const geo = new THREE.SphereGeometry(1, 64, 64);
  const mat = new THREE.MeshStandardMaterial({
    map: texture
  });

  earth = new THREE.Mesh(geo, mat);
  scene.add(earth);

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

  earth.rotation.y += 0.002;

  renderer.render(scene, camera);
}
