'use client';
import {Canvas} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';
import {Spool} from './Spool';
export default function ProductViewerInner({color,compact}:{color?:string;compact?:boolean}){return <Canvas dpr={[1,1.75]} camera={{position:[4,2.0,5.6],fov:37}} gl={{alpha:true,antialias:true}}>
 <ambientLight intensity={1.9} color="#ded0ff"/><directionalLight position={[-4,5,6]} intensity={4.7} color="#ffffff"/><pointLight position={[4,2,-3]} intensity={60} color="#7d38ff" distance={15}/>
 <Spool size={compact?.76:1} color={color}/><OrbitControls enablePan={false} minDistance={4.7} maxDistance={11} enableDamping dampingFactor={.07} autoRotate autoRotateSpeed={.5}/>
 </Canvas>}
