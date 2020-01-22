import * as React from "react"
import { toArray } from "../utils/map"
import { htmlRenderMap } from "./renderMaps/html"

type FormInputProps<T> = { schema: InputSchema<T>; state: InputState<T>; setDelta: F1<any> }
type Payload<T> = T extends State<any, infer T> ? T : never

export type InputRenderer<P extends Type<InputSchema<any>>, T = any> = (
    p: FormInputProps<T> & { schema: State<P, Payload<InputSchema<any>>> }
) => React.ReactElement

export type InputRenderMap = { [P in Type<InputSchema<any>>]: InputRenderer<P> }

const defaultRenderer: InputRenderer<any, any> = p => <h3>Schema type not supported {JSON.stringify(p.schema)}</h3>
const defaultRenderMap = htmlRenderMap

export type FormViewProps<T> = {
    setState: F1<FormState<T>>
    state: FormState<T>
    schema: FormSchema<T>
    columns?: number
    customRenderMap?: Partial<InputRenderMap>
}

export function FormView<T extends any>({ customRenderMap = {}, ...p }: FormViewProps<T>): React.ReactElement {
    const setDelta = (key: keyof T) => (value: any) => p.setState({ ...p.state, [key]: value })
    return (
        <>
            {toArray(p.schema, (schema, key) => ({ schema, key, state: p.state[key] as any })).map(s => {
                const props = { ...s, setDelta: setDelta(s.key) }
                const renderer = customRenderMap[s.schema.type] || defaultRenderMap[s.schema.type] || defaultRenderer
                return renderer(props as any)
            })}
        </>
    )
}
