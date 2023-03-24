import dynamic from 'next/dynamic'

// Dynamic import is used to prevent a payload when the website starts, that includes threejs, r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: true })
const Game = dynamic(() => import('@/components/canvas/Game'), { ssr: false })

export default function Page({sceneRef, ...props}) {
  return (
    <Scene className='pointer-events-none' eventSource={sceneRef} eventPrefix='client'>
      <Game />
    </Scene>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Index' } }
}
