'use client';

import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {Suspense,useLayoutEffect,useMemo,useRef} from 'react';
import * as THREE from 'three';
import {Spool} from './Spool';
import {sceneMotion} from './CinematicCanvas';

const smooth=(t:number,a:number,b:number)=>THREE.MathUtils.smoothstep(t,a,b);
const mix=THREE.MathUtils.lerp;
const HERO_YAW=1.28;
const HERO_PITCH=.03;
const HERO_ROLL=0;

/** One WebGL spool travels from the hero through the color chapter.
 * Scroll is the source of truth; pointer drag provides an additive orientation.
 * Both smoothly damp inside the render loop, so there are no hard jumps.
 */
function StoryRig(){
  const root=useRef<THREE.Group>(null);
  const spool=useRef<THREE.Group>(null);
  const {camera,size}=useThree();
  useLayoutEffect(()=>{
    if(!root.current||!spool.current)return;
    const compact=size.width<760;
    root.current.position.set(compact?0:2.3,compact?-.8:0,0);
    root.current.scale.setScalar(compact?.75:1.22);
    spool.current.rotation.set(HERO_PITCH,HERO_YAW,HERO_ROLL);
  },[size.width]);
  useFrame((state,delta)=>{
    if(!root.current||!spool.current)return;
    const compact=size.width<760;
    const viewportLine=size.height*.5;
    let phase=sceneMotion.phase;
    let colorRect:DOMRect|undefined;
    // The section under the viewport decides visibility, including after fast scrolls.
    for(const [id,sectionPhase] of [
      ['engineered','engineered'],['color-universe','colors'],
      ['collection','hidden'],['creation','hidden'],
      ['showcase','hidden'],['finale','hidden']
    ]){
      const rect=document.getElementById(id)?.getBoundingClientRect();
      if(id==='color-universe')colorRect=rect;
      if(rect&&rect.top<=viewportLine&&rect.bottom>=viewportLine){phase=sectionPhase;break;}
    }
    const p=THREE.MathUtils.clamp(sceneMotion.progress,0,1);
    const damp=THREE.MathUtils.damp;
    let x=compact?0:2.3,y=compact?-.8:0,scale=compact?.75:1.22;
    let yaw=HERO_YAW+sceneMotion.dragYaw+sceneMotion.heroScroll*.72;
    let pitch=HERO_PITCH+sceneMotion.dragPitch+sceneMotion.heroScroll*.72;
    let roll=HERO_ROLL;

    if(phase==='arrival'){
      // Hold the same front-facing pose from the first rendered frame.
    }else if(phase==='unwind'){
      const arrive=smooth(p,.01,.28);
      const depart=smooth(p,.72,.93);
      x=mix(compact?0:2.3,0,arrive);
      y=mix(compact?-.8:0,compact?1.65:1.50,arrive)+depart*.34;
      scale=mix(compact?.75:1.22,compact?.52:.78,arrive)*(1-depart*.40);
      yaw=HERO_YAW+sceneMotion.dragYaw+sceneMotion.heroScroll*.72+p*.64;
      pitch=HERO_PITCH+sceneMotion.dragPitch+sceneMotion.heroScroll*.72+p*4.2;
      roll=mix(HERO_ROLL,.04,arrive);
    }else if(phase==='engineered'){
      x=compact?0:Math.max(.8,Math.min(4.25,(size.width-900)*.0053-1));y=0;scale=compact?.60:1.08;yaw=3.45+sceneMotion.dragYaw;pitch=5.0+sceneMotion.dragPitch;roll=.31;
    }else if(phase==='colors'){
      // Keep the color-section pose in place, then turn it gently on the last scroll.
      const colorProgress=colorRect?THREE.MathUtils.clamp((viewportLine-colorRect.top)/colorRect.height,0,1):0;
      const turn=smooth(colorProgress,.62,.98);
      const worldPerPixel=2*8.5*Math.tan(THREE.MathUtils.degToRad(21))/size.height;
      x=compact?0:THREE.MathUtils.clamp(2.05+(size.width-1200)*.0033,2.05,4.2)-100*worldPerPixel;y=0;scale=compact?.73:1.20;
      yaw=5.12+sceneMotion.dragYaw+turn*.28;
      pitch=6.7+sceneMotion.dragPitch+turn*.08;
      roll=turn*.04;
    }else{
      x=0;y=0;scale=.001;
    }
    // Damping remains frame-rate-independent on every channel.
    const f=scale===.001?12:phase==='unwind'?5.3:3.4;
    root.current.position.x=damp(root.current.position.x,x,f,delta);
    root.current.position.y=damp(root.current.position.y,y,f,delta);
    const nextScale=damp(root.current.scale.x,scale,f,delta);
    root.current.scale.setScalar(nextScale);
    root.current.visible=scale!==.001||nextScale>.015;
    spool.current.rotation.x=damp(spool.current.rotation.x,pitch,5.5,delta);
    spool.current.rotation.y=damp(spool.current.rotation.y,yaw,5.5,delta);
    spool.current.rotation.z=damp(spool.current.rotation.z,roll,5.5,delta);
    const cp=camera as THREE.PerspectiveCamera;
    cp.position.z=damp(cp.position.z,compact?9:8.5,2,delta);
    cp.lookAt(0,0,0);
  });
  return <group ref={root}><group ref={spool}><Spool/></group></group>;
}

function Atmosphere(){
  const particles=useMemo(()=>{
    const positions=new Float32Array(125*3);
    for(let i=0;i<125;i++){
      positions[i*3]=Math.sin(i*35.45)*9;
      positions[i*3+1]=Math.cos(i*17.93)*6;
      positions[i*3+2]=-3-Math.abs(Math.sin(i*8.17))*7;
    }
    return positions;
  },[]);
  return <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[particles,3]}/></bufferGeometry><pointsMaterial size={.014} color="#bc9cf6" sizeAttenuation transparent opacity={.40}/></points>;
}

export default function HeroWebGL(){
  return <Canvas dpr={[1,1.65]} gl={{antialias:true,alpha:true,powerPreference:'high-performance'}}
    camera={{position:[0,0,8.5],fov:42,near:.1,far:100}}
    style={{pointerEvents:'none'}} onCreated={({gl})=>gl.setClearColor('#000000',0)}>
    <ambientLight intensity={1.5} color="#ac9cd4"/>
    <directionalLight position={[-4,6,5]} color="#e2d4ff" intensity={5}/>
    <pointLight position={[4,2,2]} color="#a456ff" intensity={80} distance={20}/>
    <pointLight position={[-3,-4,0]} color="#5122ab" intensity={65} distance={15}/>
    <Suspense fallback={null}><StoryRig/><Atmosphere/></Suspense>
  </Canvas>;
}
