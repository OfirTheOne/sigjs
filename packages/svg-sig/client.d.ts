
declare module "*.svg" {
    import * as SigType from "@sigjs/sig/types";
  
    const SvgComponent: () => SigType.Renderable;
  
    export { SvgComponent };
}