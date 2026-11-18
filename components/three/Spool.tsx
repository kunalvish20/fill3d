'use client';
import {useEffect,useLayoutEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {useConfigurator} from '@/stores/configurator';

function flangeGeometry(){
  const shape=new THREE.Shape();shape.absarc(0,0,1.59,0,Math.PI*2,false);
  const hub=new THREE.Path();hub.absarc(0,0,.43,0,Math.PI*2,true);shape.holes.push(hub);
  for(let n=0;n<6;n++){
    const a=n*Math.PI/3+.04,b=(n+1)*Math.PI/3-.04;
    const hole=new THREE.Path();
    hole.moveTo(.88*Math.cos(a),.88*Math.sin(a));
    hole.absarc(0,0,.88,a,b,false);hole.lineTo(1.37*Math.cos(b),1.37*Math.sin(b));
    hole.absarc(0,0,1.37,b,a,true);hole.closePath();shape.holes.push(hole);
  }
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:.09,steps:1,bevelEnabled:true,bevelSegments:2,bevelSize:.024,bevelThickness:.016,curveSegments:48});
  geometry.computeVertexNormals();return geometry;
}
function drawCurvedBrand(ctx:CanvasRenderingContext2D,text:string){
  const radius=178;
  const tracking=2;
  ctx.font='900 49px Arial';
  ctx.textAlign='center';
  ctx.textBaseline='alphabetic';
  const letters=[...text];
  const widths=letters.map(letter=>ctx.measureText(letter).width);
  const total=widths.reduce((sum,width)=>sum+width,0)+tracking*(letters.length-1);
  let distance=-total/2;
  for(let i=0;i<letters.length;i++){
    const angle=-Math.PI/2+(distance+widths[i]/2)/radius;
    ctx.save();
    ctx.translate(256+radius*Math.cos(angle),256+radius*Math.sin(angle));
    ctx.rotate(angle+Math.PI/2);
    ctx.fillText(letters[i],0,0);
    ctx.restore();
    distance+=widths[i]+tracking;
  }
}
function makeLabelTexture(){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;const ctx=canvas.getContext('2d')!;
ctx.fillStyle='#34145e';ctx.fillRect(0,0,512,512);const gradient=ctx.createRadialGradient(250,230,90,260,250,300);gradient.addColorStop(0,'#a26cfc');gradient.addColorStop(.62,'#59229c');gradient.addColorStop(1,'#1c0e31');ctx.fillStyle=gradient;ctx.fillRect(0,0,512,512);
ctx.beginPath();ctx.arc(256,256,231,0,Math.PI*2);ctx.lineWidth=3;ctx.strokeStyle='#cbb7ef';ctx.stroke();ctx.beginPath();ctx.arc(256,256,205,0,Math.PI*2);ctx.strokeStyle='#8057bb';ctx.stroke();
ctx.fillStyle='#fff';ctx.textAlign='center';drawCurvedBrand(ctx,'UFILL3D');ctx.textBaseline='alphabetic';ctx.font='bold 24px Arial';ctx.fillText('PRECISION FILAMENT',256,454);ctx.font='bold 19px Arial';ctx.fillText('1.75MM / 1KG',256,419);
const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;return tex;}
export type SpoolProps={size?:number;interactive?:boolean; animated?:boolean; color?:string};
export function Spool({size=1,interactive=false,animated=false,color}:SpoolProps){
 const group=useRef<THREE.Group>(null);const wire=useRef<THREE.InstancedMesh>(null);const materialRef=useRef<THREE.MeshPhysicalMaterial>(null);const configured=useConfigurator(s=>s.color.hex);
 const wireMaterial=useMemo(()=>new THREE.MeshPhysicalMaterial({color:'#9a5cff',metalness:.12,roughness:.24,clearcoat:.85,clearcoatRoughness:.14}),[]);
 const flangeMat=useMemo(()=>new THREE.MeshPhysicalMaterial({color:'#23202f',metalness:.58,roughness:.32,clearcoat:.6}),[]);
 const flange=useMemo(flangeGeometry,[]);
 const torus=useMemo(()=>new THREE.TorusGeometry(1,.0115,6,52),[]);
 const label=useMemo(()=>typeof document==='undefined'?null:makeLabelTexture(),[]);
 useLayoutEffect(()=>{
   if(!wire.current)return;
   const matrix=new THREE.Matrix4(),rotation=new THREE.Quaternion().setFromEuler(new THREE.Euler(0,Math.PI/2,0)),scale=new THREE.Vector3();let index=0;
   for(let layer=0;layer<11;layer++)for(let x=0;x<48;x++){
     const r=1.145+layer*.021;const offset=-.512+x*(1.024/47)+(layer%2)*.004;
     matrix.compose(new THREE.Vector3(offset,0,0),rotation,scale.set(r,r,1));
     wire.current.setMatrixAt(index++,matrix);
   }
   wire.current.instanceMatrix.needsUpdate=true;
 },[]);
 useFrame((state,delta)=>{
   if(!group.current)return;
   const target=new THREE.Color(color||configured);wireMaterial.color.lerp(target,Math.min(1,delta*5));
   if(interactive&&!animated){group.current.rotation.y+=delta*.06;}
 });
 useEffect(()=>()=>{torus.dispose();flange.dispose();flangeMat.dispose();wireMaterial.dispose();label?.dispose()},[torus,flange,flangeMat,wireMaterial,label]);
 return <group ref={group} scale={size}>
  <mesh rotation={[0,0,Math.PI/2]} material={flangeMat} receiveShadow castShadow><cylinderGeometry args={[1.14,1.14,1.10,80,1,true]}/></mesh>
  <mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.435,.435,1.34,64,1,true]}/><meshStandardMaterial color="#171120" metalness={.35} roughness={.51} side={THREE.DoubleSide}/></mesh>
  <instancedMesh ref={wire} args={[torus,wireMaterial,528]} castShadow receiveShadow frustumCulled={false}/>
  {[-.62,.54].map((x,i)=><group key={i} position={[x,0,0]} rotation={[0,Math.PI/2,0]}>
   <mesh geometry={flange} material={flangeMat} castShadow receiveShadow/>
   <mesh rotation={[0,0,0]} position={[0,0,.116]}><torusGeometry args={[1.46,.024,8,96]}/><meshStandardMaterial color="#a59bab" metalness={.7} roughness={.29}/></mesh>
   <mesh position={[0,0,.124]}><torusGeometry args={[.48,.10,16,72]}/><meshStandardMaterial color="#655a74" metalness={.74} roughness={.31}/></mesh>
   {Array.from({length:8},(_,j)=><mesh key={j} position={[1.47*Math.cos(j*Math.PI/4),1.47*Math.sin(j*Math.PI/4),.133]}><sphereGeometry args={[.018,8,8]}/><meshStandardMaterial color="#d5c6e3" metalness={.75} roughness={.25}/></mesh>)}
  </group>)}
  {label&&<mesh position={[.717,0,0]} rotation={[0,Math.PI/2,0]}>
   <ringGeometry args={[.51,.79,80]}/><meshBasicMaterial map={label} side={THREE.DoubleSide}/>
  </mesh>}
 </group>
}
