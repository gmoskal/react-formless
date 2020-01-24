import * as React from "react"
import { useFormHook } from ".."
import { MultiRenderFormView } from "./MultiRenderFormView"

export type BasicInputs = { name: string; password: string; age: number; bio: string }

const schema: FormSchema<BasicInputs> = {
    name: { type: "text", placeholder: "Name" },
    password: { type: "password", placeholder: "Password" },
    age: { type: "number", placeholder: "Age" },
    bio: { type: "textarea", placeholder: "Bio" }
}

export const InputsForms: React.FC = () => {
    const { formViewProps } = useFormHook({ schema })
    return <MultiRenderFormView title="Basic Inputs" {...formViewProps} />
}
