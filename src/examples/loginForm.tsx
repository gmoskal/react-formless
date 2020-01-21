import * as React from "react"
import { validators, useFormHook, FormView } from ".."

type Credentials = { email: string; password: string }

const schema: FormSchema<Credentials> = {
    email: { name: "Email", type: "text", validators: validators.Ok },
    password: { name: "Password", type: "password", validators: validators.validString }
}

export const LoginForm: React.FC<{ tryLogin: (data: Credentials) => void }> = p => {
    const { formViewProps, onSubmitClick } = useFormHook({
        schema,
        initialValue: { email: "", password: "" },
        onSubmit: p.tryLogin
    })

    return (
        <>
            <FormView {...formViewProps} />
            <button onClick={onSubmitClick}>Login</button>
        </>
    )
}
