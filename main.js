import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 25;

const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const group = new THREE.Group();
scene.add(group);

const loader = new THREE.TextureLoader();

// Local images
const totalImages = 30; // your 30 uploaded images
const total = 90;       // total planes on the sphere
const images = [];
for(let i=1; i<=totalImages; i++){
    images.push(`images/img${i}.jpg`);
}

const radius = 20;
const goldenAngle = Math.PI * (3 - Math.sqrt(5));

for(let i=0; i<total; i++){
    const y = 1 - (i / (total - 1)) * 2;
    const r = Math.sqrt(1 - y*y);
    const theta = i * goldenAngle;

    const x = Math.cos(theta)*r;
    const z = Math.sin(theta)*r;
    const pos = new THREE.Vector3(x, y, z).multiplyScalar(radius);

    // repeat images if total > totalImages
    const texture = loader.load(images[i % totalImages]);
    const material = new THREE.MeshBasicMaterial({map:texture, side:THREE.DoubleSide, transparent:true});
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2,3), material);

    plane.position.copy(pos);
    plane.lookAt(pos.clone().multiplyScalar(2));

    group.add(plane);
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true;

function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene,camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
