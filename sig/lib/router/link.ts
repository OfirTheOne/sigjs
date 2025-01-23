import { getRouter, match } from '@/router';
import { createElement } from '@/jsx';
import { createSignal } from '@/core/signal';

export interface LinkProps {
    to: string;
    onClick?: (e: MouseEvent) => void;
    className?: string;
    /**
     * The class to apply when the link is active
     * @default 'active'
     */
    activeClass?: string;
}

const DEFAULT_ACTIVE_CLASS = 'active';

/**
 * A link component that navigates using the app router, preventing the default behavior.
 * Anchor elements resulting from this component will have the class 'router-link'.
 * @param {LinkProps} props The props of the component
 * @throws {Error} If being called outside of a router context
 * 
 * using {@link LinkProps}
 * 
 * @example
 * <Link to="/categories">Categories</Link> // A link to the categories route
 * <Link to="/categories" className="link">Categories</Link> // A link to the categories route with a class of link
 * 
 */
export function Link({ 
    to, 
    onClick,
    className,
    activeClass
}: LinkProps, children?: any) {
    const router = getRouter();
    const [activeClass$, setActiveClass] = createSignal('');
    router.events.onRouteChange((e) => {
        const matchResult = match(to, e.path);
        if(matchResult.isMatch) {
            setActiveClass(activeClass ?? DEFAULT_ACTIVE_CLASS);
        } else {
            setActiveClass('');
        }
    });

    return (createElement('a',{ 
        href: to,
        className: ['router-link', (className ?? ''), activeClass$],
        onClick: (e: MouseEvent) => {
            e.preventDefault();
            router.push(to);
            onClick?.(e);
        }
    }, children));
}