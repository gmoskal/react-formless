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
    if (p.rendeType === "AntDesign") return AntDesignInputWrapper
    return React.Fragment
}

const DefaultRenderer: RenderFn<any, any> = p => <h3>Not supported {JSON.stringify(p.schema)}</h3>

export const FormView = <T extends any>(p: FormViewProps<T>): React.ReactElement => {
    const setDelta = (key: keyof T) => (value: any) => p.setState({ ...p.state, [key]: value })
    const renderMap = { ...plainHtmlRenderMap, ...getRenderMap(p) }
    const ItemWrapper = getItemWrapper(p)

    const render = <TKey extends keyof FormSchema<T>>(key: TKey, schema: FormSchema<T>[TKey]) => {
        const extra = schema.type === "collection" ? pickObject(p, ["ItemWrapper", "customRenderMap", "rendeType"]) : {}
        const props = { schema, state: p.state[key], setDelta: setDelta(key), extra }
        const RenderFn = renderMap[schema.type] || DefaultRenderer
        return <RenderFn {...(props as any)} />
    }

    return (
        <>
            {mapOn2(p.schema, render, (key, r) => (
                <ItemWrapper key={key}>{r}</ItemWrapper>
            ))}
        </>
    )
}
