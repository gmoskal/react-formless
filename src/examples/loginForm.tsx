import * as React from "react"
import { useFormHook, FormHookProps, FormView, InputRenderMap } from ".."

export type Credentials = { email: string; password: string }

const schema: FormSchema<Credentials> = {
    email: { type: "text", placeholder: "Email" },
    password: { type: "password", placeholder: "Secret" }
}

const style: React.CSSProperties = { border: "1px solid #ddd", borderRadius: 5, background: "#fafafa", padding: 5 }

const customRenderMap: Partial<InputRenderMap> = {
    text: p => <h4 style={style}>+{p.schema.placeholder + " " + p.state.value}</h4>,
    password: ({ state: { value } }) => <h4 style={style}>{`${value || ""} (${value?.length || 0})`}</h4>
}

export type LoginFormProps = Pick<FormHookProps<Credentials>, "initialValue" | "onSubmit">
export const LoginForm: React.FC<LoginFormProps> = p => {
    const { formViewProps, onSubmitClick } = useFormHook({ ...p, schema })
    return (
        <>
            <h2>Login Forms</h2>
            <h3>using html Render map</h3>
            <FormView {...formViewProps} />
            <h3>using AntDesign Render map</h3>
            <FormView {...formViewProps} rendeType="AntDesign" />
            <h3>usign custom readonly renderer</h3>
            <FormView {...formViewProps} customRenderMap={customRenderMap} />
            <pre>state: {JSON.stringify(formViewProps.state, null, 2)}</pre>
            <button onClick={onSubmitClick}>Login</button>
        </>
    )
}
