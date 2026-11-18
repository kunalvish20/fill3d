import type {Metadata} from 'next';
import '@fontsource-variable/dm-sans/wght.css';
import './globals.css';
import './unwind.css';
import {Header} from '@/components/layout/Header';
import {Footer} from '@/components/layout/Footer';
import {CustomCursor} from '@/components/layout/CustomCursor';
export const metadata:Metadata={title:{default:'UFILL3D — Print Beyond Limits',template:'%s | UFILL3D'},description:'The future is made layer by layer. Explore premium 3D printing filaments by UFILL3D.',robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Header/><CustomCursor/>{children}<Footer/></body></html>}
