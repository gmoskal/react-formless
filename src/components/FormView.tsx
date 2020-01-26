import * as React from "react"
import { mapOn2, pickObject } from "../utils/map"
import { plainHtmlRenderMap } from "./PlainHtmlRenderMap"
import { antDesignRenderMap, AntDesignInputWrapper } from "./AntDesignRenderMap"

const getRenderMap = (p: RenderMapProps) => {
    if (p.customRenderMap) return p.customRenderMap
    return p.rendeType === "AntDesign" ? antDesignRenderMap : plainHtmlRenderMap
}

const getItemWrapper = (p: RenderMapProps) => {
    if (p.ItemWrapper) return p.ItemWrapper
    if (p.rendeType === "AntDesign") return AntDesignInputWrapper as any
    return React.Fragment
}

const DefaultRenderer: RenderFn<any, any> = p => <h3>Not supported {JSON.stringify(p.schema)}</h3>

type InputViewProps = InputPropsBase<InputSchema<any>, FormLeafState<any>, F1<InputState<any>>>
export const InputView: React.FC<InputViewProps> = p => {
    const customRenderMap = { ...plainHtmlRenderMap, ...getRenderMap(p.extra) }
    const RenderFn = customRenderMap![p.schema.type] || DefaultRenderer
    const ItemWrapper = getItemWrapper(p.extra)
    return (
        <ItemWrapper>
            <RenderFn {...(p as any)} />
        </ItemWrapper>
    )
}

export const FormView = <T extends any>(p: FormViewProps<T>): React.ReactElement => {
    const setDelta = (key: keyof T) => (value: any) => p.setState({ ...p.state, [key]: value })
    const extra: RenderMapProps = pickObject(p, ["customRenderMap", "ItemWrapper", "rendeType"])

    const getProps = <TKey extends keyof FormSchema<T>>(key: TKey, schema: FormSchema<T>[TKey]): InputViewProps => {
        return { schema, state: p.state[key], setDelta: setDelta(key), extra }
    }

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
