import * as React from "react"
import { useFormHook, FormView } from ".."

type Credentials = { email: string; password: string }

const schema: FormSchema<Credentials> = {
    email: { name: "Email", type: "text" },
    password: { name: "Password", type: "password" }
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
