import * as React from "react"
import { useFormHook, FormHookProps, FormView, InputRenderMap } from ".."

export type Credentials = { email: string; password: string }
type Props = Pick<FormHookProps<Credentials>, "initialValue" | "onSubmit">

const schema: FormSchema<Credentials> = {
    email: { type: "text", placeholder: "Email" },
    password: { type: "password", placeholder: "Secret" }
}

export const LoginForm: React.FC<Props> = p => {
    const { formViewProps, onSubmitClick } = useFormHook({ ...p, schema })
    return (
        <>
            <FormView {...formViewProps} />
            <button onClick={onSubmitClick}>Login</button>
        </>
    )
}

export const CustomLoginForm: React.FC<Props> = p => {
    const { formViewProps, onSubmitClick } = useFormHook({ ...p, schema })
    const customRenderMap: Partial<InputRenderMap> = {
        text: p => <h1>Readonly {p.state.value}</h1>,
        password: p => <h2>Readonly {p.state.value}</h2>
    }
    return (
        <>
            <FormView {...formViewProps} customRenderMap={customRenderMap} />
            <button onClick={onSubmitClick}>Login</button>
        </>
    )
}
