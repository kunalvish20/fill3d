import {CartPage} from '@/components/cart/CartPage';
export const metadata={title:'Your Bag'};
export default function Cart(){return <main className="inner-main"><div className="inner-container"><div className="micro">YOUR SELECTION / THE NEXT LAYER</div><h1 className="site-heading">YOUR <em>BAG.</em></h1><CartPage/></div></main>}
