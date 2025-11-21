import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

const canvas = document.getElementById("viewer");

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    200
);
camera.position.set(0, 1.4, 3);

const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
scene.add(hemi);

const dir = new THREE.DirectionalLight(0xffffff, 1.0);
dir.position.set(3, 10, 10);
scene.add(dir);

const loader = new GLTFLoader();

loader.load(
    "../assets/kaijo.glb",
    (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        document.getElementById("loading").style.display = "none";

        model.position.set(0, -1, 0);

        model.traverse((o) => {
            if (o.isSkinnedMesh && o.morphTargetDictionary) {
                console.log("Blendshapes:", o.morphTargetDictionary);
            }
        });

        if (gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(model);
            mixer.clipAction(gltf.animations[0]).play();
            mixers.push(mixer);
        }
    },
    undefined,
    (err) => console.error(err)
);

const mixers = [];
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    mixers.forEach(m => m.update(dt));
    renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
