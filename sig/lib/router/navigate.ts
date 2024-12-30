import { VirtualElement } from "@/types";
import { getRouter } from "./router.v2";
import { createFragment } from "@/jsx";

export interface NavigateProps {
    to: string;
    replace?: boolean;
}

/** @publicApi **/
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