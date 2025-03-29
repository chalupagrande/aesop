import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js'


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
let ambientLight: THREE.AmbientLight | undefined
let stats: Stats | undefined
let decalMaterial: THREE.MeshPhongMaterial | undefined
let raycaster: THREE.Raycaster | undefined
let mouseHelper: THREE.Mesh | undefined
let line: THREE.Line | undefined
let truck: THREE.Group<THREE.Object3DEventMap> | undefined
let moved = false
let isDrawing = false
let lastDrawPosition = new THREE.Vector3()


const intersection = {
  intersects: false,
  point: new THREE.Vector3(),
  normal: new THREE.Vector3(),
  object: new THREE.Mesh(),
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
  brushSize: 0.5,
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
  camera.position.z = 20
  camera.position.y = 10
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

  const decalDiffuse = textureLoader.load('decal-diffuse.png');
  decalDiffuse.colorSpace = THREE.SRGBColorSpace;
  const decalNormal = textureLoader.load('decal-normal.jpg');
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


  gltfLoader.load(
    'tesla-cybertruck-2019.gltf',
    (gltf) => {
      truck = gltf.scene
      truck.scale.set(5, 5, 5)
      truck.rotateY(Math.PI * 0.5)
      scene?.add(truck)
      truck.traverse((child: THREE.Object3D) => {
        // makes tires black
        if (child instanceof THREE.Mesh && child.name.includes("BRUBLER")) {
          const rubberMaterial = child?.material as THREE.MeshStandardMaterial
          if (!rubberMaterial) { return }
          rubberMaterial.color?.set(0x000000)
          rubberMaterial.metalness = 0
          rubberMaterial.roughness = 1
        }
      })
    },
    (progress) => { },
    (error) => {
      console.error('Error loading model:', error)
    }
  )

  /**
   * Environment
   */


  rgbeLoader.load('abandoned_parking_1k.hdr', (environmentMap) => {
    if (!scene) {
      throw new Error('Scene is not defined')
    }
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    // scene.background = environmentMap
    scene.environment = environmentMap

    //skybox
    const skybox = new GroundedSkybox(environmentMap, 15, 70);
    skybox.position.y = 15
    scene.add(skybox);
  })

  /**
   * Lights
   */

  ambientLight = new THREE.AmbientLight(0xffffff, 10.4)
  scene.add(ambientLight)



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
  gui.add(params, 'brushSize', 0.1, 2).name('Brush Size');

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
   * Listeners
   */

  window.addEventListener('resize', handleResize)
  window.addEventListener('pointermove', onPointerMove)
  controls.addEventListener('change', function () {
    moved = true;
  });
  window.addEventListener('pointerdown', function (event) {
    moved = false;
    checkIntersection(event.clientX, event.clientY);
    if (intersection.intersects) {
      isDrawing = true;
      lastDrawPosition.copy(intersection.point);
      shoot();
    }
  });
  window.addEventListener('pointerup', function () {
    isDrawing = false;
  });

}


export function render() {
  if (!controls || !renderer || !scene || !camera) {
    return
  }
  controls.update()
  renderer.render(scene, camera)
  stats?.update()
  requestAnimationFrame(render)
}

function checkIntersection(x: number, y: number) {
  if (!camera || !mouse || !line || !truck || !canvas) {
    return
  }

  // Get canvas position and dimensions
  const rect = canvas.getBoundingClientRect();
  
  // Calculate mouse position relative to the canvas
  const mouseX = x - rect.left;
  const mouseY = y - rect.top;
  
  // Convert to normalized device coordinates (-1 to +1)
  mouse.x = (mouseX / rect.width) * 2 - 1;
  mouse.y = - (mouseY / rect.height) * 2 + 1;

  raycaster?.setFromCamera(mouse, camera);
  raycaster?.intersectObject(truck, true, intersects);
  if (intersects.length > 0) {
    const p = intersects[0].point;
    mouseHelper?.position.copy(p);
    intersection.point.copy(p);

    const normalMatrix = new THREE.Matrix3().getNormalMatrix(truck.matrixWorld);

    if (!intersects[0]?.face) {
      return
    }
    const n = intersects[0].face.normal.clone();
    n.applyNormalMatrix(normalMatrix);
    n.multiplyScalar(10);
    n.add(intersects[0].point);

    intersection.normal.copy(intersects[0].face.normal);
    intersection.object.copy(intersects[0].object)
    mouseHelper?.lookAt(n);

    const positions = line?.geometry.attributes.position;
    positions.setXYZ(0, p.x, p.y, p.z);
    positions.setXYZ(1, n.x, n.y, n.z);
    positions.needsUpdate = true;

    intersection.intersects = true;

    intersects.length = 0;

  } else {

    intersection.intersects = false;

  }

}


function handleResize() {

  if (!camera || !renderer || !canvas) {
    return
  }

  // Update sizes
  w = canvas.clientWidth
  h = canvas.clientHeight
  // Update camera
  camera.aspect = w / h
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

function onPointerMove(event: PointerEvent) {
  if (event.isPrimary) {
    checkIntersection(event.clientX, event.clientY);

    if (isDrawing && intersection.intersects) {
      // Only draw if the point has moved enough distance
      if (lastDrawPosition.distanceTo(intersection.point) > params.brushSize * 0.5) {
        shoot();
        lastDrawPosition.copy(intersection.point);
      }
    }
  }
}

function shoot() {

  if (!truck || !mouseHelper || !decalMaterial) {
    return
  }

  position.copy(intersection.point);
  orientation.copy(mouseHelper.rotation);
  const targetMesh = intersection.object

  if (params.rotate) orientation.z = Math.random() * 2 * Math.PI;

  // Use brushSize parameter to control the size of the decal
  const brushScale = params.brushSize;
  size.set(brushScale, brushScale, brushScale);

  const material = decalMaterial.clone();
  const color = new THREE.Color(globalThis.settings.color);
  material.color.set(color);

  const m = new THREE.Mesh(new DecalGeometry(targetMesh, position, orientation, size), material);
  m.renderOrder = decals.length; // give decals a fixed render order

  decals.push(m);

  truck.attach(m);

}
