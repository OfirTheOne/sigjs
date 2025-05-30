import { KeyBuilder } from "@/common/key-builder/key-builder";
import { getRenderedRoot } from "@/core/global";
import { VirtualElement, ComponentFunctionWithMeta } from "@/types";
import { createComponentContext, setActiveContext, removeActiveContext, addComponentContext } from "../component-context/component-context";
import { runOnCreateHooks } from "../component-context/hooks/on-create";
import { RenderFunction } from "./render.types";
import { ElementKeySymbol } from "@/symbols";
import { adaptVirtualElementChild } from "../create-element/adapt-virtual-element-child";

type VirtualComponentElement = (VirtualElement & {
    meta: {
        component: ComponentFunctionWithMeta;
    };
})

export function componentRender(
    element: VirtualElement,
    container: HTMLElement,
    key: KeyBuilder,
    render: RenderFunction
): HTMLElement | Text {
    const componentElement = element as VirtualComponentElement;
    const { children = [],  ...props } = componentElement.props
    const { meta: { component } } = componentElement;

    if (typeof component !== 'function') {
        throw new Error('Component must be a function');
    }
    const componentFunction = component as ComponentFunctionWithMeta;
    const currentKey = key.clone().push(componentFunction.name);
    const context = createComponentContext(componentFunction, container, getRenderedRoot(), currentKey.toString());
    setActiveContext(context);
    const componentVirtualElementOutput = componentFunction(props, children as VirtualElement[]);
    removeActiveContext();
    
    const domElement = render(adaptVirtualElementChild(componentVirtualElementOutput), container, currentKey);
    context.element = domElement as Element; 
    context.elementKey = domElement[ElementKeySymbol];
    addComponentContext(context.elementKey || context.key, context);
    runOnCreateHooks(context);
    
    return domElement;
}