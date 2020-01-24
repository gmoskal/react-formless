import * as React from "react"
import { useFormHook } from ".."
import { _noop } from "../utils"
import { MultiThemeFormView } from "./helpers"
import { ReadonlyInputWithLength } from "./ReadonlyRenderMap"

export type Credentials = { email: string; password: string }

const schema: FormSchema<Credentials> = {
    email: { type: "text", placeholder: "Email" },
    password: { type: "password", placeholder: "Secret" }
}

const customRenderMap: Partial<InputRenderMap> = { text: ReadonlyInputWithLength, password: ReadonlyInputWithLength }

export const LoginForm: React.FC = () => {
    const { formViewProps } = useFormHook({ initialValue: { email: "", password: "" }, onSubmit: _noop, schema })
    return <MultiThemeFormView title="Text" {...formViewProps} customRenderMap={customRenderMap} />
}
