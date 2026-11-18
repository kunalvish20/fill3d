'use client';
import {Canvas,useFrame} from '@react-three/fiber';
import {useLayoutEffect,useRef} from 'react';
import * as THREE from 'three';
import {printerMotion} from './PrinterScene';
function Printer(){const rings=useRef<THREE.InstancedMesh>(null),tip=useRef<THREE.Group>(null);
useLayoutEffect(()=>{if(!rings.current)return;const m=new THREE.Matrix4(),q=new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/2,0,0));for(let i=0;i<55;i++){const scale=.85+.18*Math.sin((i/55)*Math.PI);m.compose(new THREE.Vector3(0,i*.035-1,0),q,new THREE.Vector3(scale,scale,1));rings.current.setMatrixAt(i,m)}rings.current.instanceMatrix.needsUpdate=true},[]);
useFrame((_,delta)=>{const count=Math.max(1,Math.round(printerMotion.progress*55));if(rings.current)rings.current.count=count;if(tip.current)tip.current.position.y=THREE.MathUtils.damp(tip.current.position.y,1-count*.035,4,delta)});
return <group rotation={[.04,.4,0]}><mesh position={[0,-1.1,0]}><boxGeometry args={[3.6,.16,3.2]}/><meshStandardMaterial color="#261936" metalness={.32} roughness={.4}/></mesh><instancedMesh ref={rings} args={[new THREE.TorusGeometry(1,.018,7,80),new THREE.MeshStandardMaterial({color:'#a778fa',metalness:.20,roughness:.23}),55]}/><group ref={tip} position={[0,.95,0]}><mesh position={[0,.58,0]}><cylinderGeometry args={[.52,.36,.8,8]}/><meshStandardMaterial color="#81669b" metalness={.38} roughness={.32}/></mesh><mesh><coneGeometry args={[.19,.46,20]}/><meshStandardMaterial color="#e6d3f5" metalness={.55} roughness={.24}/></mesh><pointLight position={[0,-.2,0]} intensity={2} color="#ba8cff"/></group></group>}
export default function PrinterSceneInner(){return <Canvas camera={{position:[4,2.3,6.5],fov:41}} dpr={[1,1.5]} gl={{alpha:true}}><ambientLight intensity={1.7}/><directionalLight intensity={4} color="#c6aaff" position={[2,5,4]}/><directionalLight intensity={2.5} color="#f2e4ff" position={[0,2,7]}/><pointLight intensity={35} color="#7134c6" position={[-3,1,1]}/><Printer/></Canvas>}
