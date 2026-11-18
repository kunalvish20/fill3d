'use client';
import dynamic from 'next/dynamic';
import {useEffect,useState} from 'react';
const Inner=dynamic(()=>import('./ProductViewerInner'),{ssr:false,loading:()=> <div className="model-placeholder"><img alt="Spool product" src="/images/spool.svg"/></div>});
export function ProductViewer({color,compact=false}:{color?:string;compact?:boolean}){const [webgl,setWebgl]=useState(false);useEffect(()=>{try{const c=document.createElement('canvas');setWebgl(Boolean(c.getContext('webgl2')||c.getContext('webgl')))}catch{setWebgl(false)}},[]);return <div className="product-viewer">{webgl?<Inner color={color} compact={compact}/>:<div className="model-placeholder"><img alt="UFILL3D filament spool illustration" src="/images/spool.svg"/></div>}<div className="viewer-hint">{webgl?'DRAG TO ROTATE · SCROLL TO ZOOM':'STATIC PREVIEW · WEBGL UNAVAILABLE'}</div></div>}
