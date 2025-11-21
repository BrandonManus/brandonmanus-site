const canvas = document.getElementById("viewer");

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false
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
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.1);
scene.add(hemi);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(3, 10, 10);
scene.add(dirLight);

// Load the GLB
const loader = new THREE.GLTFLoader();
loader.load(
    "../assets/kaijo.glb",
    (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        document.getElementById("loading").style.display = "none";

        // Position fix depending on model origin
        model.position.set(0, -1, 0);

        // Check for bones, animations, morph targets
        model.traverse((o) => {
            if (o.isSkinnedMesh) console.log("SkinnedMesh:", o);
            if (o.morphTargetInfluences) console.log("Blendshapes:", o.morphTargetDictionary);
        });

        if (gltf.animations && gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(model);
            mixer.clipAction(gltf.animations[0]).play();

            animateMixers.push(mixer);
        }
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + "% loaded");
    },
    (err) => {
        console.error("Error loading model:", err);
    }
);

let animateMixers = [];

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    animateMixers.forEach(m => m.update(delta));

    renderer.render(scene, camera);
}

const clock = new THREE.Clock();
animate();

// Handle resize
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
