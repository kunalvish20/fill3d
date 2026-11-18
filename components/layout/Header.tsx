'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState,useEffect} from 'react';
import {ArrowUpRight,Menu,ShoppingBag,X,UserRound} from 'lucide-react';
import {useCart} from '@/stores/cart';
export function Header(){const pathname=usePathname();const [open,setOpen]=useState(false),[mounted,setMounted]=useState(false);const items=useCart(s=>s.items);useEffect(()=>setMounted(true),[]);useEffect(()=>setOpen(false),[pathname]);const count=mounted?items.reduce((n,i)=>n+i.quantity,0):0;return <>
<div className="announcement">THE MATERIAL OF POSSIBILITY <span>—</span> FREE SHIPPING ON DEMO ORDERS ABOVE ₹2,999</div>
<header className={"site-nav "+(pathname!=='/'?'inner-nav':'')}><Link className="wordmark" href="/" aria-label="UFILL3D home"><span className="mark-symbol">◈</span>UFILL<span>3D</span><span className="wordmark-dot">.</span></Link><nav className="desktop-links"><Link href="/shop">THE COLLECTION</Link><Link href="/customize">COLOR LAB</Link><Link href="/about">OUR WORLD</Link></nav><div className="nav-right"><Link className="nav-account" href="/account" aria-label="Account"><UserRound size={19}/></Link><Link href="/cart" className="cart-link" aria-label={`Cart with ${count} items`}><ShoppingBag size={19}/><small>{count}</small></Link><button className="menu-toggle" onClick={()=>setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">{open?<X/>:<Menu/>}</button><Link href="/shop" className="nav-shop">SHOP NOW <ArrowUpRight size={16}/></Link></div></header>
{open&&<nav className="mobile-menu" aria-label="Mobile"><Link href="/shop">Shop filaments</Link><Link href="/customize">Color lab</Link><Link href="/about">Our story</Link><Link href="/faq">FAQs</Link><Link href="/contact">Contact</Link><Link href="/account">My account</Link></nav>}</>}
