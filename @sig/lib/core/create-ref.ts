import { ElementRef } from "@/types";

function createRef<T = HTMLElement>(initValue?: T): ElementRef<T> {
    return {
        current: initValue
    };
}

export { createRef };