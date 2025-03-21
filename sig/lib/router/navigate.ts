import { VirtualElement } from "@/types";
import { createFragment } from "@/jsx";
import { getRouter } from "./router.v2";

export interface NavigateProps {
    to: string;
    replace?: boolean;
}

/**
 * Navigate to a new route
 * @param {NavigateProps} props The props of the component
 * @throws {Error} If being called outside of a router context
 * 
 * using {@link NavigateProps}
 * 
 * @example
 * <Navigate to="/categories" /> // Navigate to the categories route using push
 * <Navigate to="/categories" replace /> // Navigate to the categories route using replace
 * 
 */
export function Navigate({ to, replace }: NavigateProps) {
    const router = getRouter();
    if (replace) {
        router.replace(to);
    }
    else {
        router.push(to);
    }
    return createFragment(null, []) as unknown as VirtualElement;
}