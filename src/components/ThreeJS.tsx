import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Default properties for dimensions
const HEIGHT = 400
const WIDTH = 400

type Props = {
  height?: number
  width?: number
}

export const ThreeJS: React.FC<Props> = ({
  height = HEIGHT,
  width = WIDTH
}) => {
  const mount = useRef(null)

  // ThreeJS setup
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    500
  )

  const renderer = new THREE.WebGLRenderer()

  const material = new THREE.LineBasicMaterial({ color: "white" })
  const geometry = new THREE.Geometry()

  geometry.vertices.push(new THREE.Vector3(-5, 0, 0))
  geometry.vertices.push(new THREE.Vector3(0, 5, 0))
  geometry.vertices.push(new THREE.Vector3(5, 0, 0))

  camera.position.set(0, 0, 100)
  camera.lookAt(0, 0, 0)

  const line = new THREE.Line(geometry, material)

  scene.add(line)
  renderer.setSize(width, height)

  const animate = () => {
    requestAnimationFrame(animate)

    renderer.render(scene, camera)
  }

  useEffect(() => {

    (mount.current as any).appendChild(renderer.domElement)
    animate()
  }, [])


  return <div ref={mount} />
}

