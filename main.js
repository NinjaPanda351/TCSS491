import * as THREE from 'three';

/**
 * DEBUGGING
 */
const SHOW_WIREFRAMES = false;

/**
 * World Attributes
 */
const GRAVITY = 30;
const STEPS_PER_FRAME = 5;

/**
 * Scene objects
 */
let scene, camera, renderer, mesh;
let meshFloor;


let keyboard = {};
let player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.01}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);

    mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({color: 0xff9999, wireframe: SHOW_WIREFRAMES})
    );
    mesh.position.y += 1;
    scene.add(mesh);

    meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10, 2, 2),
        new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: SHOW_WIREFRAMES})
    )
    meshFloor.rotation.x -= Math.PI / 2;
    scene.add(meshFloor);

    camera.position.set(0, player.height, -5);
    camera.lookAt(new THREE.Vector3(0, player.height, 0));

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    animate()
}

function animate() {
    requestAnimationFrame(animate);

    const deltaTime = Math.min(0.05, clock.getDelta()) / STEPS_PER_FRAME;
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    handleMovement();

    renderer.render(scene, camera);
}

function handleMovement() {
    if (keyboard[87]) { // W key
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += Math.cos(camera.rotation.y) * player.speed;
    }
    if (keyboard[65]) { // A key
        camera.position.x -= Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
        camera.position.z += Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
    }
    if (keyboard[83]) { // S key
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= Math.cos(camera.rotation.y) * player.speed;
    }
    if (keyboard[68]) { // D key
        camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
        camera.position.z -= Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
    }
    if (keyboard[37]) { // left arrow key
        camera.rotation.y -= player.turnSpeed;
    }
    if (keyboard[39]) { // right arrow key
        camera.rotation.y += player.turnSpeed;
    }
}

/**
 * Key Press Functions
 */
function keyDown(event) {
    keyboard[event.keyCode] = true;
}

function keyUp(event) {
    keyboard[event.keyCode] = false;
}

/**
 * Event Listeners
 */
window.addEventListener('resize', ()=> {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

// INITIATE
window.onload = init;