import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js';


// variables
let w: number
let h: number
let canvas: HTMLCanvasElement | undefined
let camera: THREE.PerspectiveCamera | undefined
let renderer: THREE.WebGLRenderer | undefined
let scene: THREE.Scene | undefined
let controls: OrbitControls | undefined
let gltfLoader: GLTFLoader | undefined
let textureLoader: THREE.TextureLoader | undefined
let rgbeLoader: RGBELoader | undefined
let directionalLight: THREE.DirectionalLight | undefined
let ambientLight: THREE.AmbientLight | undefined
let floor: THREE.Mesh | undefined
let stats: Stats | undefined
let decalMaterial: THREE.MeshPhongMaterial | undefined
let raycaster: THREE.Raycaster | undefined
let increment = 0.01
let mouseHelper: THREE.Mesh | undefined
let line: THREE.Line | undefined
let mesh: THREE.Mesh | undefined
let truckGroup: THREE.Group | undefined


const intersection = {
  intersects: false,
  point: new THREE.Vector3(),
  normal: new THREE.Vector3()
};
let mouse = new THREE.Vector2();
const intersects: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[] = [];
const decals: THREE.Mesh[] = []
const position = new THREE.Vector3();
const orientation = new THREE.Euler();
const size = new THREE.Vector3(1, 1, 1);


const params = {
  minScale: 10,
  maxScale: 20,
  rotate: true,
};





export function init(canvasElement: HTMLCanvasElement, container: HTMLElement) {
  w = window.innerWidth
  h = window.innerHeight - 68

  canvas = canvasElement
  canvas.width = w
  canvas.height = h

  /**
   * Base
   */

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, w / h)
  camera.position.z = 5
  camera.position.y = 1
  scene.add(camera)
  stats = new Stats()
  container.appendChild(stats.dom)
  raycaster = new THREE.Raycaster();


  /**
   * Loaders
   */
  gltfLoader = new GLTFLoader()
  textureLoader = new THREE.TextureLoader()
  rgbeLoader = new RGBELoader()

  /**
   * Objects
   */

  const decalDiffuse = textureLoader.load('textures/decal/decal-diffuse.png');
  decalDiffuse.colorSpace = THREE.SRGBColorSpace;
  const decalNormal = textureLoader.load('textures/decal/decal-normal.jpg');
  decalMaterial = new THREE.MeshPhongMaterial({
    specular: 0x444444,
    map: decalDiffuse,
    normalMap: decalNormal,
    normalScale: new THREE.Vector2(1, 1),
    shininess: 30,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: - 4,
    wireframe: false
  });


  truckGroup = new THREE.Group()
  truckGroup.name = "Truck"
  gltfLoader.load(
    'cybertruck.glb',
    (gltf) => {
      console.log('gltf', gltf)
      while (gltf.scene.children.length > 0) {
        const child = gltf.scene.children[0]
        child.receiveShadow = true
        child.castShadow = true
        truckGroup?.add(child)
        scene?.add(child)

        if (child.name === "Body") {
          const childCopy = child.clone()
          childCopy.name = "BodyCopy"
          childCopy.scale.set(1, 1, -1)
          childCopy.receiveShadow = true
          childCopy.castShadow = true
          truckGroup?.add(childCopy)
          scene?.add(childCopy)
        }
      }
    },
    (progress) => { },
    (error) => {
      console.error('Error loading model:', error)
    }
  )

  /**
   * Environment
   */


  rgbeLoader.load('cobblestone_street_night_4k.hdr', (environmentMap) => {
    if (!scene) {
      throw new Error('Scene is not defined')
    }
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = environmentMap
    scene.environment = environmentMap

    //skybox
    const skybox = new GroundedSkybox(environmentMap, 15, 70);
    skybox.position.y = 15
    scene.add(skybox);
  })

  /**
   * Floor
   */

  floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: '#444444',
      metalness: 0,
      roughness: 0.3
    })
  )
  floor.receiveShadow = true
  floor.rotation.x = - Math.PI * 0.5
  // scene.add(floor)

  /**
   * Lights
   */

  ambientLight = new THREE.AmbientLight(0xffffff, 10.4)
  scene.add(ambientLight)

  directionalLight = new THREE.DirectionalLight(0xffffff, 10.8)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.set(1024, 1024)
  directionalLight.shadow.camera.far = 15
  directionalLight.shadow.camera.left = - 7
  directionalLight.shadow.camera.top = 7
  directionalLight.shadow.camera.right = 7
  directionalLight.shadow.camera.bottom = - 7
  directionalLight.position.set(- 5, 5, 5)
  scene.add(directionalLight)


  /**
   * Renderer
   */
  renderer = new THREE.WebGLRenderer({
    canvas: canvas
  })
  renderer.setSize(w, h)
  renderer.shadowMap.enabled = true
  renderer.render(scene, camera)


  /**
   * Controls & GUI
   */
  controls = new OrbitControls(camera, renderer.domElement);
  controls.update()

  const gui = new GUI();
  gui.add(params, 'minScale', 1, 30);
  gui.add(params, 'maxScale', 1, 30);
  gui.add(params, 'rotate');

  /**
   * Helpers
   */
  mouseHelper = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 10), new THREE.MeshNormalMaterial());
  mouseHelper.visible = false;
  scene.add(mouseHelper);

  const geometry = new THREE.BufferGeometry();
  geometry.setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);

  line = new THREE.Line(geometry, new THREE.LineBasicMaterial());
  scene.add(line);

  /**
   * Resize
   */

  window.addEventListener('resize', handleResize)
}


export function render() {
  if (!controls || !renderer || !scene || !camera) {
    return
  }
  controls.update()
  renderer.render(scene, camera)
  directionalLight?.color.set(globalThis.settings.color)
  directionalLight?.position.set(Math.cos(increment) * 5, 5, Math.sin(increment) * 5)
  increment += 0.01
  stats?.update()
  requestAnimationFrame(render)
}

// function checkIntersection(x: number, y: number) {
//   if (!camera || !mouse || !line || !mesh) return

//   mouse.x = (x / window.innerWidth) * 2 - 1;
//   mouse.y = - (y / window.innerHeight) * 2 + 1;

//   raycaster?.setFromCamera(mouse, camera);
//   raycaster?.intersectObject(mesh, false, intersects);

//   if (intersects.length > 0) {

//     const p = intersects[0].point;
//     mouseHelper?.position.copy(p);
//     intersection.point.copy(p);

//     const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);

//     const n = intersects[0].face.normal.clone();
//     n.applyNormalMatrix(normalMatrix);
//     n.multiplyScalar(10);
//     n.add(intersects[0].point);

//     intersection.normal.copy(intersects[0].face.normal);
//     mouseHelper?.lookAt(n);

//     const positions = line?.geometry.attributes.position;
//     positions.setXYZ(0, p.x, p.y, p.z);
//     positions.setXYZ(1, n.x, n.y, n.z);
//     positions.needsUpdate = true;

//     intersection.intersects = true;

//     intersects.length = 0;

//   } else {

//     intersection.intersects = false;

//   }

// }


function handleResize() {

  if (!camera || !renderer) {
    return
  }

  // Update sizes
  w = window.innerWidth
  h = window.innerHeight
  // Update camera
  camera.aspect = w / h
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}