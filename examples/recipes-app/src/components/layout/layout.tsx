
import { getRouter } from 'sig/router';
import { ComponentFunction } from 'sig';
import Facebook from './../../../assets/icons/facebook_icon.svg';
import TwitterIcon from './../../../assets/icons/twitter_icon.svg';
import YoutubeIcon from './../../../assets/icons/youtube_icon.svg';
import ShoppingBag from './../../../assets/icons/shopping-bag.svg';
import PinterestBag from './../../../assets/icons/pinterest-icon.svg';

export const AppLayout = ((_props) => {
    return (<div>
        <NavBar />
        <SecondaryNavBar />
        <router-outlet></router-outlet>
    </div>)
}) as ComponentFunction;

function NavBar() {
    return (<nav className='flex flex-row items-center h-14 bg-[#faf4eb] px-8'>
        {/* <p className='flex flex-1'>Search</p> */}
        <ul className='flex flex-row justify-end gap-6 items-center'>
            <li className='flex h-5 w-5'>{ShoppingBag()}</li>
            <li className='flex h-5 w-5'>{PinterestBag()}</li>
            <li className='flex h-5 w-5'>{Facebook()}</li>
            <li className='flex h-5 w-5'>{TwitterIcon()}</li>
            <li className='flex h-5 w-5'>{YoutubeIcon()}</li>
        </ul>
    </nav>);
}

function SecondaryNavBar() {
    const { push } = getRouter();
    return (<nav className='flex flex-row justify-around items-center bg-yellow-100/10 h-20 px-14'>
        <div className='flex justify-around w-1/4'>
            <div onClick={() => push('/app/about')} className='flex font-thin text-neutral-700 hover:text-neutral-500 cursor-pointer'>About</div>
            <div onClick={() => push('/app/recipes')} className='flex font-thin text-neutral-700 hover:text-neutral-500 cursor-pointer'>Recipes</div>
            <div onClick={() => push('/app/videos')} className='flex font-thin text-neutral-700 hover:text-neutral-500 cursor-pointer'>Videos</div>
        </div>
        <div className='flex justify-center text-4xl font-serif capitalize font-thin text-center w-1/5'>Recipes App</div>
        <div className='flex justify-around w-1/4'>
            <div onClick={() => push('/app/cookbook')} className='flex font-thin text-neutral-700 hover:text-neutral-500 cursor-pointer'>Cookbook</div>
            <div onClick={() => push('/app/press')} className='flex font-thin text-neutral-700 hover:text-neutral-500 cursor-pointer'>Press</div>
            <div onClick={() => push('/app/contact')} className='flex font-thin text-neutral-700 hover:text-neutral-500 cursor-pointer'>Contact</div>
        </div>
    </nav>);
}
