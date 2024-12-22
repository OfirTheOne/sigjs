import { getRouter } from '@/router';
import { createElement } from '@/jsx';

export interface LinkProps {
    to: string;
    onClick?: (e: MouseEvent) => void;
    className?: string;
}

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