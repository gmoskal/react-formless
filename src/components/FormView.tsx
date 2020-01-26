import * as React from "react"
import { mapOn2, pickObject } from "../utils/map"
import { plainHtmlRenderMap, plainHtmlElementRenderMap } from "./PlainHtmlRenderMap"
import { antDesignRenderMap, antDesignElementRenderMap } from "./AntDesignRenderMap"

const getRenderMap = (p: RenderOptions) => {
    if (p.inputsRenderMap) return p.inputsRenderMap
    return p.renderType === "AntDesign" ? antDesignRenderMap : plainHtmlRenderMap
}

export const getElementsRenderMap = (p: RenderOptions): ElementsRenderMap => {
    const map: Partial<ElementsRenderMap> =
        p.elementsRenderMap || (p.renderType === "AntDesign" ? antDesignElementRenderMap : {})
    return { ...plainHtmlElementRenderMap, ...map }
}

type ElementName = keyof ElementsRenderMap
type ElementProps<K extends ElementName> = RenderOptionsProps & RProps<ElementsRenderMap[K]>
export const renderElement = <K extends ElementName>(name: K) => ({
    renderOptions,
    ...p
}: ElementProps<K>): React.ReactElement => {
    const E = getElementsRenderMap(renderOptions)[name] as any
    return <E {...p} />
}

export const ButtonRF = renderElement("Button")
export const ItemWrapperRF = renderElement("ItemWrapper")
export const ItemChildrenWrapperRF = renderElement("ItemChildrenWrapper")
export const TitleRF = renderElement("Title")
export const LabelRF = renderElement("Label")
export const ErrorRF = renderElement("Error")

const DefaultRenderFn: RenderFn<any, any> = p => <h3>Not supported {JSON.stringify(p.schema)}</h3>

type InputViewProps = InputPropsBase<InputSchema<any>, FormLeafState<any>, F1<InputState<any>>>
export const InputView: React.FC<InputViewProps> = p => {
    const customRenderMap = { ...plainHtmlRenderMap, ...getRenderMap(p.renderOptions) }
    const RenderFn = customRenderMap![p.schema.type] || DefaultRenderFn
    return (
        <ItemWrapperRF renderOptions={p.renderOptions}>
            <RenderFn {...(p as any)} />
        </ItemWrapperRF>
    )
}

export const FormView = <T extends any>(p: FormViewProps<T>): React.ReactElement => {
    const setDelta = (key: keyof T) => (value: any) => p.setState({ ...p.state, [key]: value })
    const renderOptions: RenderOptions = pickObject(p, ["elementsRenderMap", "inputsRenderMap", "renderType"])

    const getProps = <TKey extends keyof FormSchema<T>>(key: TKey, schema: FormSchema<T>[TKey]): InputViewProps => ({
        schema,
        state: p.state[key],
        setDelta: setDelta(key),
        renderOptions
    })

    return (
        <>
            {mapOn2(p.schema, getProps, (key, p) => (
                <React.Fragment key={key}>
                    <InputView {...p} />
                </React.Fragment>
            ))}
        </>
    )
}
