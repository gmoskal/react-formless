import * as React from "react"
import { mapOn2 } from "../utils/map"
import { plainRenderMap } from "./renderMaps/plain"
import { antDesignRenderMap, AntDesignInputWrapper } from "./renderMaps/antDesign"

type FormInputProps<T> = { schema: InputSchema<T>; state: InputState<T>; setDelta: F1<any> }
type Payload<T> = T extends State<any, infer T> ? T : never

export type InputRenderer<P extends Type<InputSchema<any>>, T = any> = (
    p: FormInputProps<T> & { schema: State<P, Payload<InputSchema<any>>> }
) => React.ReactElement

export type InputRenderMap = { [P in Type<InputSchema<any>>]: InputRenderer<P> }

type RenderMapProps = {
    ItemWrapper?: () => React.ReactElement
    customRenderMap?: Partial<InputRenderMap>
    rendeType?: "Plain" | "AntDesign"
}

export type FormViewProps<T> = RenderMapProps & {
    setState: F1<FormState<T>>
    state: FormState<T>
    schema: FormSchema<T>
}

const getRenderMap = (p: RenderMapProps) => {
    if (p.customRenderMap) return p.customRenderMap
    return p.rendeType === "AntDesign" ? antDesignRenderMap : plainRenderMap
}

const getItemWrapper = (p: RenderMapProps) => {
    if (p.ItemWrapper) return p.ItemWrapper
    if (p.rendeType === "AntDesign") return AntDesignInputWrapper
    return React.Fragment
}

const DefaultRenderer: InputRenderer<any> = p => <h3>Not supported {JSON.stringify(p.schema)}</h3>

export function FormView<T extends any>(p: FormViewProps<T>): React.ReactElement {
    const setDelta = (key: keyof T) => (value: any) => p.setState({ ...p.state, [key]: value })
    const renderMap = { ...plainRenderMap, ...getRenderMap(p) }
    const ItemWrapper = getItemWrapper(p)
    return (
        <>
            {mapOn2(
                p.schema,
                (key, schema) => ({
                    Renderer: renderMap[schema.type] || DefaultRenderer,
                    props: { schema, state: p.state[key], setDelta: setDelta(key) } as any
                }),
                (key, { Renderer, props }) => (
                    <ItemWrapper key={key}>
                        <Renderer {...props} />
                    </ItemWrapper>
                )
            )}
        </>
    )
}
