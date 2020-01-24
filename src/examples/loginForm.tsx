import * as React from "react"
import { useFormHook, FormView } from ".."
import { _noop } from "../utils"

export type Credentials = { email: string; password: string }

const schema: FormSchema<Credentials> = {
    email: { type: "text", placeholder: "Email" },
    password: { type: "password", placeholder: "Secret" }
}

export const ReadonlyInputWithLength: InputBoxRenderFn<any> = p => (
    <>
        <h4 style={{ border: "1px solid #ddd", borderRadius: 5, background: "#fafafa", padding: 5 }}>
            {p.state.value || p.schema.placeholder || ""}
        </h4>
        <h5>{`length: ${p.state.value?.length || 0}`}</h5>
    </>
)

const customRenderMap: Partial<InputRenderMap> = { text: ReadonlyInputWithLength, password: ReadonlyInputWithLength }

export const LoginForm: React.FC = p => {
    const initialValue: Credentials = { email: "", password: "" }
    const { formViewProps, onSubmitClick } = useFormHook({ initialValue, onSubmit: _noop, schema })
    return (
        <>
            <h2>Login Forms</h2>
            <h3>using Plain renderer</h3>
            <FormView {...formViewProps} />
            <h3>using AntDesign renderer</h3>
            <FormView {...formViewProps} rendeType="AntDesign" />
            <h3>usign Custom renderer</h3>
            <FormView {...formViewProps} customRenderMap={customRenderMap} />
            <button onClick={onSubmitClick}>Login</button>
            <h3>state</h3>
            <pre>{JSON.stringify(formViewProps.state, null, 2)}</pre>
        </>
    )
}
