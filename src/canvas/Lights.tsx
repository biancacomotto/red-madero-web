import { Environment, Lightformer } from '@react-three/drei'

/** The same soft studio light for every phone stage: a key from the top right, a cool fill, a bright ceiling. */
export function Lights() {
  return (
    <>
      <ambientLight intensity={2.1} />
      <directionalLight position={[3, 5, 5]} intensity={3.6} />
      <directionalLight position={[-4, 1, 2]} intensity={1.8} color="#dfe8ff" />
      <Environment resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.5}
          position={[0, 5, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[10, 10, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          position={[-5, 2, 3]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[5, 6, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1}
          position={[4, 0, -3]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[4, 5, 1]}
        />
      </Environment>
    </>
  )
}
