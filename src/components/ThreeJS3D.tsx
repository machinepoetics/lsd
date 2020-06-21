import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Default properties for dimensions
const HEIGHT = 400
const WIDTH = 400

type Props = {
  height?: number
  width?: number
}

export const ThreeJS3D: React.FC<Props> = ({
  // height = HEIGHT,
  // width = WIDTH
}) => {
  const mount = useRef(null)

  // ThreeJS setup
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(WIDTH, HEIGHT)

  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({
    alphaTest: 0.5,
    color: "white",
    transparent: true
  })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
  camera.position.z = 5

  const animate = () => {
    requestAnimationFrame(animate)

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera)
  }

  useEffect(() => {

    (mount.current as any).appendChild(renderer.domElement)
    animate()

  }, [])


  return <div ref={mount} />
}

