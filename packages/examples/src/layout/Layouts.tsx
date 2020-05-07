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

type CustomFields = { type: "star" } | { type: "emoji"; text: string; repeat?: number }

export const styledSchema: StyledFormSchema<User, CustomFields> = [
    { type: "Title", value: "Basic info" },
    {
        type: "Row",
        value: ["login", "email", { type: "Custom", value: { type: "emoji", text: "🦾" } }, "password"]
    },
    {
        type: "Row",
        value: [
            { type: "Title", value: "Emoji row" },
            { type: "Custom", value: { type: "emoji", text: "🦄", repeat: 2 } },
            { type: "Custom", value: { type: "emoji", text: "😀", repeat: 3 } },
            { type: "Custom", value: { type: "emoji", text: "🤖", repeat: 4 } }
        ]
    },
    { type: "Title", value: "Address" },
    { type: "Row", value: ["name", "street", "postal", "city"] },
    { type: "Title", value: "Additional" },
    "bio"
]

export const LayoutForm: React.FC = () => {
    const { formViewProps: p, result } = useFormHook({ schema })
    return (
        <>
            <StyledFormView
                {...p}
                styledSchema={styledSchema}
                styledInputsRenderMap={{
                    Custom: p2 => <p>{p2.value.type === "star" ? "⭐" : p2.value.text.repeat(p2.value.repeat || 1)}</p>
                }}
            />
            <h3>Result</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
        </>
    )
}
