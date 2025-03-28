import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// Canvas
let canvas: HTMLCanvasElement | undefined
let camera: THREE.PerspectiveCamera | undefined
let renderer: THREE.WebGLRenderer | undefined
let scene: THREE.Scene | undefined
let controls: OrbitControls | undefined
let mesh: THREE.Mesh | undefined
let geometry: THREE.BoxGeometry | undefined
let material: THREE.MeshBasicMaterial | undefined
let loader: GLTFLoader | undefined
let directionalLight: THREE.DirectionalLight | undefined
let ambientLight: THREE.AmbientLight | undefined
let floor: THREE.Mesh | undefined

const sizes = {
  width: 800,
  height: 600
}

export function init(canvasElement: HTMLCanvasElement) {
  canvas = canvasElement
  canvas.width = sizes.width
  canvas.height = sizes.height

  scene = new THREE.Scene()
  geometry = new THREE.BoxGeometry(1, 1, 1)
  material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = 5
  mesh.position.x = 5


  camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
  camera.position.z = 5
  camera.position.y = 1
  scene.add(camera)

  loader = new GLTFLoader()
  loader.load(
    'cybertruck.glb',
    (gltf) => {
      console.log('gltf', gltf)
      while (gltf.scene.children.length > 0) {
        const child = gltf.scene.children[0]
        child.receiveShadow = true
        child.castShadow = true

        if (child.name === "Body") {
          const childCopy = child.clone()
          childCopy.name = "BodyCopy"
          childCopy.scale.set(1, 1, -1)
          childCopy.receiveShadow = true
          childCopy.castShadow = true
          scene?.add(childCopy)
        }

        scene?.add(child)
      }
    },
    (progress) => { },
    (error) => {
      console.error('Error loading model:', error)
    }
  )

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
  scene.add(floor)

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


  renderer = new THREE.WebGLRenderer({
    canvas: canvas
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.shadowMap.enabled = true
  renderer.render(scene, camera)


  controls = new OrbitControls(camera, renderer.domElement);
  controls.update()
}

let increment = 0.01
export function render() {
  if (!controls || !renderer || !scene || !camera) {
    return
  }
  controls.update()
  renderer.render(scene, camera)
  directionalLight?.position.set(Math.cos(increment) * 5, 5, Math.sin(increment) * 5)
  increment += 0.01
  requestAnimationFrame(render)
}


