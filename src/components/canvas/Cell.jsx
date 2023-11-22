import {Box} from "@react-three/drei";

export default function Cell({ ...props }) {
  return (
    <Box args={[1,1,1]} position={[0.5, 0.5, 0.5]} {...props}>
      <meshNormalMaterial opacity={0.85} transparent={true}/>
    </Box>
  )
}
