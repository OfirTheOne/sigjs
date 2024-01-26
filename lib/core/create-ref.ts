import { ElementRef } from "@/types";

function createRef(initValue?: HTMLElement): ElementRef {
    return {
        current: initValue
    };
}

export { createRef };