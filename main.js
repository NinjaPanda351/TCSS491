import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

/**
 * DEBUGGING
 */
const SHOW_WIREFRAMES = false;

/**
 * World Attributes
 */
const GRAVITY = 30;
const JUMP_STRENGTH = 10;
const clock = new THREE.Clock();

/**
 * Scene objects
 */
let scene, camera, renderer, controls;
let mesh, meshFloor;
let raycaster;

let player = {
    height: 1.8,
    speed: 0.3,
    turnSpeed: Math.PI * 0.01,
    velocity: new THREE.Vector3(0, 0, 0),
    isOnGround: true
};
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 0.5, 300);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = player.height;

    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    controls = new PointerLockControls(camera, document.body);

    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');

    instructions.addEventListener('click', () => {
        controls.lock();
    });

    controls.addEventListener('lock', () => {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    });

    controls.addEventListener('unlock', () => {
        blocker.style.display = 'block';
        instructions.style.display = '';
    });

    scene.add(controls.getObject());

    const onKeyDown = (event) => {
        switch (event.code) {
            case 'KeyW':
                moveForward = true;
                break;
            case 'KeyS':
                moveBackward = true;
                break;
            case 'KeyA':
                moveLeft = true;
                break;
            case 'KeyD':
                moveRight = true;
                break;
            case 'Space':
                if (player.isOnGround) {
                    player.velocity.y = 10;
                    player.isOnGround = false;
                }
                break;
        }
    };

    const onKeyUp = (event) => {
        switch (event.code) {
            case 'KeyW':
                moveForward = false;
                break;
            case 'KeyS':
                moveBackward = false;
                break;
            case 'KeyA':
                moveLeft = false;
                break;
            case 'KeyD':
                moveRight = false;
                break;
        }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

    mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: 0xff9999, wireframe: SHOW_WIREFRAMES })
    );
    mesh.position.y += 1;
    scene.add(mesh);

    meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20, 2, 2),
        new THREE.MeshBasicMaterial({ color: 0x999999, wireframe: SHOW_WIREFRAMES })
    );
    meshFloor.rotation.x -= Math.PI / 2;
    scene.add(meshFloor);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();

    if (controls.isLocked) {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;

        updatePlayer(deltaTime);

        handleMovement();
    }

    renderer.render(scene, camera);
}

function updatePlayer(deltaTime) {
    if (!player.isOnGround) {
        player.velocity.y -= GRAVITY * deltaTime;
    }

    camera.position.y += player.velocity.y * deltaTime;

    if (camera.position.y < player.height) {
        camera.position.y = player.height;
        player.velocity.y = 0;
        player.isOnGround = true;
    }

    handleMovement(deltaTime);
}

function handleMovement(deltaTime) {
    const velocity = new THREE.Vector3();

    const diagonalSpeedFactor = 1.2; //Speed normalizer

    let forwardSpeed = computeSpeed(moveForward, moveBackward);
    let horizontalSpeed = computeSpeed(moveRight, moveLeft);

    if (horizontalSpeed !== 0 && forwardSpeed !== 0) {
        horizontalSpeed = horizontalSpeed / Math.sqrt(2) * diagonalSpeedFactor;
        forwardSpeed = forwardSpeed / Math.sqrt(2) * diagonalSpeedFactor;
    }

    velocity.z += forwardSpeed * player.speed;
    velocity.x += horizontalSpeed * player.speed;

    controls.moveRight(velocity.x);
    controls.moveForward(velocity.z);
}

function computeSpeed(isPositivePressed, isNegativePressed) {
    return isNegativePressed ? -player.speed : isPositivePressed ? player.speed : 0;
}

// INITIATE
window.onload = init;
