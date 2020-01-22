import * as React from "react"
import { InputProps, getInputProps } from "../forms"
import { toArray } from "../utils/map"

const ErrorLabel: React.FC<InputState<any>> = ({ validationResult, visited }) => (
    <div className="ErrorLabel">
        {validationResult && visited && validationResult.type === "Err" ? validationResult.value : ""}
    </div>
)

export const renderBasicInput = (p: InputProps<any>) => (
    <>
        {p.schema.sectionTitle ? <h1>{p.schema.sectionTitle}</h1> : null}
        <div className="InputWrapper">
            <p>{p.schema.name}</p>
            <input {...getInputProps(p)} type={p.schema.type === "number" ? "text" : p.schema.type} />
            <ErrorLabel {...p.state} />
        </div>
    </>
)

type FormInputProps<T> = { schema: InputSchema<T>; state: InputState<T>; setDelta: F1<any> }
type Payload<T> = T extends State<any, infer T> ? T : never

export type InputRenderer<T, P extends Type<InputSchema<any>>> = (
    p: FormInputProps<T> & { schema: State<P, Payload<InputSchema<any>>> }
) => React.ReactElement

export type InputRenderMap = { [P in Type<InputSchema<any>>]: InputRenderer<any, P> }

export const defaultRenderMap: Partial<InputRenderMap> = {
    email: renderBasicInput,
    password: renderBasicInput,
    text: renderBasicInput
}

const defaultRenderer: InputRenderer<any, any> = p => <h3>Schema type not supported {JSON.stringify(p.schema)}</h3>

export const FormInput = <T extends any>(p: FormInputProps<T>): React.ReactElement =>
    (defaultRenderMap[p.schema.type] || defaultRenderer)(p as any)

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
