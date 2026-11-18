'use client';
import dynamic from 'next/dynamic';
import {useEffect,useState} from 'react';
export const sceneMotion={progress:0,phase:'arrival',unwind:0,heroScroll:0,dragYaw:0,dragPitch:0,dragging:false};
const WebGL=dynamic(()=>import('./HeroWebGL'),{ssr:false,loading:()=> <div className="webgl-fallback" aria-hidden="true"><img src="/images/spool.svg" alt=""/></div>});
export default function CinematicCanvas(){const [supported,setSupported]=useState(false);useEffect(()=>{try{let canvas=document.createElement('canvas');setSupported(Boolean(canvas.getContext('webgl2')||canvas.getContext('webgl')))}catch{setSupported(false)}},[]);return <div className="cinema-canvas" aria-label="Interactive 3D filament spool" role="img">{supported?<WebGL/>:<div className="webgl-fallback"><img src="/images/spool.svg" alt="Decorative illustration of the UFILL3D spool"/></div>}</div>}
