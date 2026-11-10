import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const canvas = document.querySelector('#my-canvas');

// Scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 1.7, 16); // eye height, outside the door

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(innerWidth, innerHeight);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 2.5));
const sun = new THREE.DirectionalLight(0xffffff, 5);
sun.position.set(5, 5, 5);
scene.add(sun);

// Load the museum
let museum;

new GLTFLoader().load('/models/Museum.glb', (gltf) => {
  museum = gltf.scene;

  museum.traverse((obj) => {
    // make the floor wood-coloured
    if (obj.isMesh && obj.material.name?.startsWith('Floor')) {
      obj.material.color.set(0x8b5a2b);
    }
  });

  scene.add(museum);
});

// Controls
const controls = new PointerLockControls(camera, document.body);
canvas.addEventListener('click', () => controls.lock());

// Click → log the name of the object in the middle of the screen
const ray = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);

addEventListener('click', () => {
  if (!museum) return; // model not loaded yet
  ray.setFromCamera(center, camera);
  const hit = ray.intersectObject(museum, true)[0];
  console.log(hit?.object.name);
});

// WASD keys
const keys = {};
addEventListener('keydown', (e) => keys[e.code] = true);
addEventListener('keyup', (e) => keys[e.code] = false);

function animate() {
  requestAnimationFrame(animate);

  const speed = 0.1;
  if (keys.KeyW) controls.moveForward(speed);
  if (keys.KeyS) controls.moveForward(-speed);
  if (keys.KeyD) controls.moveRight(speed);
  if (keys.KeyA) controls.moveRight(-speed);

  renderer.render(scene, camera);
}
animate();

// Resize
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});