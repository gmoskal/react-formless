import * as React from "react"
import { useFormHook, FormSchema, StyledFormSchema, StyledFormView } from "@react-formless/core"

type Address = { name: string; street: string; postal: string; city: string }
type User = Address & { login: string; email: string; password: string; bio: string }

const schema: FormSchema<User> = {
    login: { name: "Login", type: "text", id: "name" },
    email: { name: "Email", type: "text", readOnly: true },
    password: { name: "Password", type: "password" },
    name: { name: "Name", type: "text" },
    street: { name: "Street", type: "text" },
    city: { name: "Street", type: "text" },
    postal: { name: "Postal", type: "text" },
    bio: { name: "Bio", type: "textarea", placeholder: "Bio" }
}

export const styledSchema: StyledFormSchema<User> = [
    { type: "Title", text: "Basic info" },
    { type: "Row", fields: ["login", "email", "password"] },

    { type: "Title", text: "Address" },
    { type: "Row", fields: ["name", "street", "postal", "city"] },

    { type: "Title", text: "Additional" },
    "bio"
]

export const LayoutForm: React.FC = () => {
    const { formViewProps: p, result } = useFormHook({ schema })
    return (
        <>
            <StyledFormView {...p} styledSchema={styledSchema} />
            <h3>Result</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
            <h3>State</h3>
            <pre>{JSON.stringify(p.state, null, 2)}</pre>
        </>
    )
}
