import type {Metadata} from 'next';
import {getCatalog} from '@/lib/catalog';
import {CatalogGrid} from '@/components/products/CatalogGrid';
export const metadata:Metadata={title:'Shop Filaments'};
export default async function Shop(){const products=await getCatalog();return <main className="inner-main"><div className="inner-container"><div className="micro">THE COLLECTION / 001 — 009</div><h1 className="site-heading">YOUR IDEAS.<br/><em>OUR MATERIAL.</em></h1><p className="lead">Nine ways to bring what&apos;s in your head into the real world. Explore a collection made for the next generation of makers.</p><CatalogGrid products={products}/></div></main>}
