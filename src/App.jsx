import * as THREE from 'three'
import { Suspense, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF, Environment } from '@react-three/drei'
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'

function Apple({ z }) {
  const ref = useRef()
  const { nodes, materials } = useGLTF('../../public/untitled-v1-transformed.glb')
  const { viewport, camera } = useThree()
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, z])
  const [data] = useState({
    x: THREE.MathUtils.randFloatSpread(2),
    y: THREE.MathUtils.randFloatSpread(height),
    rX: Math.random() * Math.PI,
    rY: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI,
  })
  useFrame((state) => {
    ref.current.rotation.set((data.rX += 0.005), (data.rY += 0.005), (data.rZ += 0.005))
    ref.current.position.set(data.x*(width / 2), (data.y -= 0.01), z)
    if (data.y < -height/1.7) data.y = height/1.7
  })
  return (
    <mesh 
      ref={ref}
      geometry={nodes.Apol001.geometry} 
      material={materials.skin} 
      scale={[0.522, 0.811, 0.85]} 
      material-emissive='red' 
    />
  )
}

export default function App({ count = 100, depth = 80 }) {
  return (
    <Canvas gl={{ alpha: false }} camera={{ near: 0.01, far: 110, fov: 30 }} >
      <color attach='background' args={['#ffbf40']} />
      <ambientLight intensity={1} />
      <Environment preset='sunset' />
      <EffectComposer>
        <DepthOfField target={[0, 0, depth / 2]} focalLength={0.5} bokehScale={8} height={700} />
      </EffectComposer>
      <Suspense fallback={null}>
        {Array.from({ length: count }, (_, i) => (<Apple key={i} z={-(i / count) * depth - 20} />))}
      </Suspense>
    </Canvas>
  )
}
