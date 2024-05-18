
import { getRouter } from 'sig/router';
import Facebook from './../../../assets/icons/facebook_icon.svg';
import TwitterIcon from './../../../assets/icons/twitter_icon.svg';
import YoutubeIcon from './../../../assets/icons/youtube_icon.svg';
import ShoppingBag from './../../../assets/icons/shopping-bag.svg';
import { ComponentFunction } from 'sig';

export const Layout = ((_props, children) => {
    return (<div>
        <NavBar />
        <SecondaryNavBar />
        {children}
    </div>)
}) as ComponentFunction;


function NavBar() {
    return (<nav className='flex flex-row items-center h-14 bg-yellow-200/30 px-8'>
        <p className='flex flex-1'>Search</p>
        <ul className='flex flex-row justify-end gap-6 items-center'>
            <li className='flex h-6 w-6'>{ShoppingBag()}</li>
            <li className='flex h-6 w-6'>{Facebook()}</li>
            <li className='flex h-6 w-6'>{TwitterIcon()}</li>
            <li className='flex h-6 w-6'>{YoutubeIcon()}</li>
        </ul>
    </nav>);
}

function SecondaryNavBar() {
    const { push } = getRouter();
    return (<nav className='flex flex-row justify-around items-center bg-yellow-100/10 h-20 px-14'>
        <div className='flex justify-around w-1/4'>
            <div onClick={() => push('/about')} className='flex'>About</div>
            <div onClick={() => push('/recipes')} className='flex'>Recipes</div>
            <div onClick={() => push('/videos')} className='flex'>Videos</div>
        </div>
        <div className='flex justify-center text-4xl text-center w-1/5'>Recipes App</div>
        <div className='flex justify-around w-1/4'>
            <div onClick={() => push('/cookbook')} className='flex'>Cookbook</div>
            <div onClick={() => push('/press')} className='flex'>Press</div>
            <div onClick={() => push('/contact')} className='flex'>Contact</div>
        </div>
    </nav>);
}
