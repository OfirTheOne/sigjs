import { getRouter } from '@/router';
import { createElement } from '@/jsx';

export interface LinkProps {
    to: string;
    onClick?: (e: MouseEvent) => void;
    className?: string;
}

/**
 * A link component that navigates using the app router, preventing the default behavior.
 * Anchor elements resulting from this component will have the class 'router-link'.
 * @param {LinkProps} props The props of the component
 * @throws {Error} If being called outside of a router context
 * 
 * @example
 * <Link to="/categories">Categories</Link> // A link to the categories route
 * <Link to="/categories" className="link">Categories</Link> // A link to the categories route with a class of link
 * 
 */
export function Link({ 
    to, 
    onClick,
    className
}: LinkProps, children?: any) {
    const router = getRouter();
    return (createElement('a',{ 
        href: to,
        className: 'router-link ' + (className ?? ''),
        onClick: (e: MouseEvent) => {
            e.preventDefault();
            router.push(to);
            onClick?.(e);
        }
    }, children));
}