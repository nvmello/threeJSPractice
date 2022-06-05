/**
 * NOTES:
 * Type 'npm run dev' in console to run and view in browser
 * Thank you to Fireship on YouTube -> https://www.youtube.com/watch?v=Q7AOvWpIVHU
 */

import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const scene = new THREE.Scene();    //Creates the container to hold all objects, cameras, lights

// PerspectiveCamera(FOV, ASPECT RATIO, view frustrum, view frustrum)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGL1Renderer({   //Actually renders the graphics to the screen
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);    //Sets device pixel ratio.

renderer.setSize(window.innerWidth, window.innerHeight);  //Resizes the output canvas to (width, height) with 
                                                          //device pixel ratio taken into account
camera.position.setZ(30);

// renderer.render(scene, camera);   //renders the scene from the cameras current perspective

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);     //creates a torus geometry  (i'm ghuessing this goes to the vertex shader)
const material = new THREE.MeshStandardMaterial( {color: 0xFF6347} );   //sets the torus material (this proobably goes to the fragment shader)
const torus = new THREE.Mesh(geometry, material);   //this creates an object with a torus geometry and the previously specified material (object probably just means buffer here)

scene.add(torus);   //adds the torus object/buffer to the screen

const pointLight = new THREE.PointLight(0xffffff);  //creates a new point of light and specifies the lights color
pointLight.position.set(20,20,20);                  //changes the position of the light from (0,0,0) to (20,20,20)

// const ambientLight = new THREE.AmbientLight(0xffffff);   //makes the light ambient
// scene.add(pointLight, ambientLight); //adds the point of light to the scene

scene.add(pointLight);//adds the point of light to the scene


const lightHelper = new THREE.PointLightHelper(pointLight); //adds a small frame at the position of the light source for assistance
const gridHelper = new THREE.GridHelper(200,50);      //creates a grid in the scene GridHelper(size,divisions);
scene.add(lightHelper, gridHelper);   //adds the grid and light helpers to the scene

const controls = new OrbitControls(camera, renderer.domElement);    //allows the user to to control screen with mouse

/**
 * addStar()
 * function to be loooped over in order to add small sperical stars randomly around the scene
 */
function addStar(){
  // SphereGeometry(radius, widthSegments, heightSegments)
  const geometry = new THREE.SphereGeometry(0.25,24,24);  //creates a sphere geometry  (i'm ghuessing this goes to the vertex shader)
  const material = new THREE.MeshStandardMaterial({color: 0xffffff}); //sets the sphere material

  const star = new THREE.Mesh(geometry, material);    //creates a new 'star' onject with both the geometry and material specified

  const [ x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100) );  //randomly generates a unique x,y,z value for each star
  star.position.set(x,y,z);   //sets each stars position to the randomly generated x,y,z position calculated previously
  scene.add(star);    //adds each star to the scene once it is created 

}

Array(200).fill().forEach(addStar);   //creates an array of size 200 and for each position in the array it adds a star with addStar()

const spaceTexture = new THREE.TextureLoader().load('space.jpg');   //creates a new texture from a saved jpg
scene.background = spaceTexture;    //adds the texture to the background of the scene

const rockTexture = new THREE.TextureLoader().load('rock.jpg'); //creates a new texture from a saved jpg

//this is how you map textures to different shapes
const rock = new THREE.Mesh(  
  new THREE.SphereGeometry(3,32,32),    // create a new sphere geometry
  new THREE.MeshStandardMaterial({map: rockTexture})    //map the rock texture to the sphere
);
scene.add(rock);    //add out texture mapped sphere to the scene

//Animate the scene with an infitite recursive loop that continually calls render
function animate(){       
  requestAnimationFrame(animate);     //tells the browser that you want to animate something
  controls.update();                  //allows the user to control the scene with the mouse
  torus.rotation.x+= 0.01;            //changes the rotation of the torus in the x direction
  torus.rotation.y+= 0.005;           //changes the rotation of the torus in the y direction
  torus.rotation.z+= 0.01;            //changes the rotation of the torus in the z direction
  renderer.render(scene, camera);     //call render on the scene and camera
}

animate();      //call our recursive animate function