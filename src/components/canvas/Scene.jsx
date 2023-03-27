import { OrbitControls, Preload } from '@react-three/drei'
import {useEffect, useRef} from "react";

export default function Scene({ children, ...props }) {
  // Everything defined in here will persist between route changes, only children are swapped

  const orbitControls = useRef()
  useEffect(() => {
    orbitControls.current.listenToKeyEvents(window);
  } ,[]);

  return (
    <>
      <directionalLight intensity={0.75} />
      <ambientLight intensity={0.75} />
      {children}
      <Preload all />
      <OrbitControls ref={orbitControls} />
    </>
  )
}
