export { validators, guards } from "./utils/validators"
export { useFormHook, FormHookProps } from "./useFormHook"
export { getInputProps } from "./forms"
export { FormView, InputRenderMap, InputRenderer } from "./components/FormView"
import { htmlRenderMap } from "./components/renderMaps/html"
import { antDesignRenderMap } from "./components/renderMaps/antDesign"
export const renderMaps = { htmlRenderMap, antDesignRenderMap }
