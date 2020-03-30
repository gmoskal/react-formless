import * as React from "react"
import { FormView, useFormHook, FormSchema } from "@react-formless/core"
import { validNumber } from "@react-formless/utils"

export type User = { name: string; password: string; age: number; bio: string }

const schema: FormSchema<User> = {
    name: { type: "text", placeholder: "Name ...", name: "Name", id: "name" },
    password: { type: "password", placeholder: "Password ...", name: "Password" },
    age: { type: "number", placeholder: "Age ...", name: "Age", validators: validNumber },
    bio: { type: "textarea", placeholder: "Bio...", name: "Biography" }
}

export const InputsForms: React.FC = () => {
    const { formViewProps: p, result } = useFormHook({ schema })
    return (
        <>
            <FormView {...p} />
            <h3>Result</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
            <h3>State</h3>
            <pre>{JSON.stringify(p.state, null, 2)}</pre>
        </>
    )
}
