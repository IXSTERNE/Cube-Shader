import * as THREE from 'three';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { CathodeRayTubeShader } from '/CathodeRayTubeShader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

scene.background = new THREE.Color(0x424949);

document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0xE2A801});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 4;

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const customShader = new ShaderPass(CathodeRayTubeShader);
composer.addPass(customShader)

const outputPass = new OutputPass();
composer.addPass(outputPass);


function animate(){
	requestAnimationFrame(animate);

    CathodeRayTubeShader.uniforms.u_resolution.value.x = renderer.domElement.width;
    CathodeRayTubeShader.uniforms.u_resolution.value.y = renderer.domElement.height;

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;

    composer.render(0.01);
}
animate();