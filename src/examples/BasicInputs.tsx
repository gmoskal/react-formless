import * as React from "react"
import { useFormHook } from ".."
import { _noop } from "../utils"
import { MultiThemeFormView } from "./helpers"
import { ReadonlyInputWithLength } from "./ReadonlyRenderMap"

export type BasicInputs = { name: string; password: string; age: number; bio: string }

const schema: FormSchema<BasicInputs> = {
    name: { type: "text", placeholder: "Name" },
    password: { type: "password", placeholder: "Password" },
    age: { type: "number", placeholder: "Age" },
    bio: { type: "textarea", placeholder: "Bio" }
}

const customRenderMap: Partial<InputRenderMap> = {
    text: ReadonlyInputWithLength,
    password: ReadonlyInputWithLength,
    number: ReadonlyInputWithLength,
    textarea: ReadonlyInputWithLength
}

export const BasicInputsForms: React.FC = () => {
    const { formViewProps } = useFormHook({ initialValue: {} as any, onSubmit: _noop, schema })
    return <MultiThemeFormView title="Basic Inputs" {...formViewProps} customRenderMap={customRenderMap} />
}
