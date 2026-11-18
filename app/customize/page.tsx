import {getCatalog} from '@/lib/catalog';
import {Configurator} from '@/components/products/Configurator';
export const metadata={title:'Color Lab — Customize Your Filament'};
export default async function Customize(){const products=await getCatalog();return <main className="inner-main"><div className="inner-container"><div className="micro">INTERACTIVE STUDIO / 002</div><h1 className="site-heading">THE <em>COLOR LAB.</em></h1><p className="lead" style={{marginBottom:35}}>Made personal. Choose a material, make it yours, and see your filament come to life.</p><Configurator products={products}/></div></main>}
