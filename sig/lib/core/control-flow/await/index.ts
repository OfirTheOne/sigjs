
import { KeyBuilder } from "@/common/key-builder/key-builder";
import { getRenderedRoot, setRenderedRoot } from "@/core/global";
import { DOM } from "@/core/html";
import { AwaitControlFlow } from "@/symbols";
import { CONTROL_FLOW_TAG, ELEMENT_TYPE } from "@/constants";
import { adaptVirtualElementChild } from "@/core/dom-render/create-element/adapt-virtual-element-child";
import { createElement } from "@/jsx";
import { fragmentExtraction } from "../fragment-extraction";
import type { RenderFunction } from "@/core/dom-render/render";
import type { AsyncComponentFunction, Renderable, VirtualElement, ComponentFunction } from "@/types";
import { isPromise } from "@/common/is-promise";

type LazyAsyncComponentFunction = () => Promise<{ default: AsyncComponentFunction }>;
type LazyComponentFunction = () => Promise<{ default: ComponentFunction }>;

interface AwaitProps {
    component: ComponentFunction | AsyncComponentFunction | LazyAsyncComponentFunction | LazyComponentFunction;
    fallback: Renderable,
    error?: Renderable,
    onError?: (error: Error) => void,
    onResolve?: () => void,
}

function Await(props: AwaitProps): VirtualElement {
    return {
        type: ELEMENT_TYPE.CONTROL_FLOW,
        props: {
            children: [],
            ...props,
            controlTag: CONTROL_FLOW_TAG.AWAIT,
        }
    };
}

Await['$$type'] = AwaitControlFlow;


function renderAwait(
    element: VirtualElement,
    container: HTMLElement,
    render: RenderFunction,
    key: KeyBuilder
): HTMLElement | Text {
    const renderSandboxContainer = render(
        createElement('div', {}),
        undefined,
        key.clone().push('sandbox')
    ) as HTMLElement;

    const root = getRenderedRoot();
    const props = element.props as unknown as AwaitProps;
    const component = props.component;

    let memoAwaitElementDom: HTMLElement | Text | (HTMLElement | Text)[] | null = null;


    if (typeof component !== 'function' && !isPromise(component)) {
        throw new Error(`Invalid Await argument, invalid component type: ${component}`);
    }

    const currentKey = key.clone().push(element.props.controlTag as string);
    const currentKeyString = currentKey.toString();

    const startComment = DOM.createComment('await;start;key:' + currentKeyString);
    const endComment = DOM.createComment('await;end;key:' + currentKeyString);

    DOM.appendChild(container, startComment);
    DOM.appendChild(container, endComment);

    const { fallback, onError, onResolve, error: errorElm } = props;

    const fallbackDom = render(adaptVirtualElementChild(fallback), container, currentKey);

    const executeRender = (component: LazyAsyncComponentFunction | AsyncComponentFunction | ComponentFunction | LazyComponentFunction) => {
        DOM.insertBefore(endComment, fallbackDom);
        if (memoAwaitElementDom) {
            DOM.removeElementsBetween(startComment, endComment);
            DOM.insertBefore(endComment, memoAwaitElementDom);
            return;
        }
        Promise.resolve(component())
            .then((moduleOrElement) => {
                if (moduleOrElement &&
                    typeof moduleOrElement == 'object' &&
                    'default' in moduleOrElement) {
                    if (typeof moduleOrElement.default != 'function') {
                        throw new Error('Component inferred as a lazy async component, but default export is not a function');
                    }
                    return moduleOrElement.default();
                } else {
                    return moduleOrElement;
                }
            })
            .then((componentElement) => {
                setRenderedRoot(root.id);
                DOM.removeElementsBetween(startComment, endComment);

                const renderedResult = render(adaptVirtualElementChild(componentElement), container, currentKey);
                const awaitElementDom = fragmentExtraction(renderedResult, renderSandboxContainer);
                memoAwaitElementDom = awaitElementDom;
                DOM.insertBefore(endComment, awaitElementDom);
            })
            .catch((error) => {
                if (onError) {
                    onError(error);
                }
                if (errorElm) {
                    const errorDom = render(adaptVirtualElementChild(errorElm), container, currentKey);
                    DOM.insertBefore(endComment, errorDom);
                }
            })
            .finally(() => {
                if (onResolve) {
                    onResolve();
                }
            });
    }

    if (typeof component == 'function') {
        executeRender(component)
    } else {
        throw new Error('Component must be a either a lazy async component, async component, or a component function');
    }
    return container;
}

export type { AwaitProps };
export { Await, renderAwait };