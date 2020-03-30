import * as React from "react"
import { FormView, useFormHook, FormSchema } from "@react-formless/core"

type User = { name: string; skills: Skill[] }
type Skill = { name: string; level: number; tags: Tag[] }
type Tag = { name: string; ts: number }

const skillSchema: FormSchema<Skill> = {
    name: { name: "Skill Name", type: "text" },
    level: { name: "Level", type: "number" },
    tags: {
        name: "Tags",
        type: "collection",
        mutate: { addNextLabel: "Add Tag", createValue: () => ({ name: "", ts: new Date().getTime() }) },
        fields: { name: { name: "Tag Name", type: "text" }, ts: { type: "hidden" } }
    }
}

const userSchema: FormSchema<User> = {
    name: { name: "User Name", type: "text" },
    skills: {
        name: "Skills",
        type: "collection",
        mutate: { addNextLabel: "Add skill", createValue: () => ({ name: "", level: 0, tags: [] }) },
        fields: skillSchema
    }
}

export const InputCollectionForm: React.FC = () => {
    const { formViewProps: p, result } = useFormHook({ schema: userSchema })
    return (
        <>
            <FormView {...p} />
            <pre>{JSON.stringify(result, null, 2)}</pre>
        </>
    )
}
