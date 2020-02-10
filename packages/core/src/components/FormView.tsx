import * as React from "react"

import { F1, pickObject, mapOn2 } from "@react-formless/utils"

import {
    plainHtmlRenderMap,
    plainHtmlElementRenderMap,
    RenderOptions,
    ElementsRenderMap,
    RenderFn,
    FormLeafState,
    InputState,
    FormViewProps,
    InputPropsBase,
    InputSchema,
    FormSchema
} from ".."

const getRenderMap = (p: RenderOptions) => p.inputsRenderMap || plainHtmlRenderMap

export const getElementsRenderMap = (p: RenderOptions): ElementsRenderMap => ({
    ...plainHtmlElementRenderMap,
    ...(p.elementsRenderMap || {})
})

const DefaultRenderFn: RenderFn<any, any> = p => <h3>Not supported {JSON.stringify(p.schema)}</h3>

type InputViewProps = InputPropsBase<InputSchema<any>, FormLeafState<any>, F1<InputState<any>>>
export const FormItemView: React.FC<InputViewProps> = p => {
    const customRenderMap = { ...plainHtmlRenderMap, ...getRenderMap(p.renderOptions) }
    const { ItemWrapper, DefaultFormItem } = getElementsRenderMap(p.renderOptions)
    const FormItem = customRenderMap[p.schema.type] || DefaultFormItem || DefaultRenderFn

    return (
        <ItemWrapper>
            <FormItem {...(p as any)} />
        </ItemWrapper>
    )
}

export const FormView = <T extends any>(p: FormViewProps<T>): React.ReactElement => {
    const setDelta = (key: keyof T) => (value: any) => p.setState({ ...p.state, [key]: value })
    const renderOptions: RenderOptions = pickObject(p, ["elementsRenderMap", "inputsRenderMap"])

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
                    <FormItemView {...p} />
                </React.Fragment>
            ))}
        </>
    )
}
