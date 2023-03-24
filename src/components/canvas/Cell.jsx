import {Box} from "@react-three/drei";

export default function Cell({ ...props }) {
  return (
    <Box args={[1,1,1]} position={[0.5, 0.5, 0.5]} {...props}>
      <meshStandardMaterial color={0xaaaaaa}/>
    </Box>
  )
}
