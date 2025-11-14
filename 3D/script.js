<script type="module">
  import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164/build/three.module.js";

  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 3;

  let renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Load your Earth screenshot texture
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load("./assets/ScreenShot of Earth.png");

  // Sphere with your custom texture
  let geo = new THREE.SphereGeometry(1, 64, 64);
  let mat = new THREE.MeshStandardMaterial({
    map: earthTexture,
    roughness: 0.6,
    metalness: 0.1
  });

  let sphere = new THREE.Mesh(geo, mat);
  scene.add(sphere);

  // Light
  let light = new THREE.PointLight(0xffffff, 1.4);
  light.position.set(2, 2, 3);
  scene.add(light);

  // Subtle ambient light so the dark side isn't pitch black
  let ambient = new THREE.AmbientLight(0x404040, 0.8);
  scene.add(ambient);

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    sphere.rotation.y += 0.002;
    sphere.rotation.x += 0.0005;

    renderer.render(scene, camera);
  }
  animate();

  // Resize fix
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
</script>
