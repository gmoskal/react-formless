import * as React from "react"
import { FormView, useFormHook, toResult } from "../../.."

type User = { name: string; skills: Skill[] }
type Skill = { name: string; level: number; tags: Tag[] }
type Tag = { name: string }

const skillSchema: FormSchema<Skill> = {
    name: { name: "Skill Name", type: "text" },
    level: { name: "Level", type: "number" },
    tags: {
        name: "Tags",
        type: "collection",
        sectionTitle: "Tags",
        mutate: { addNextLabel: "Add Tag", createValue: { name: "" } },
        fields: { name: { name: "Tag Name", type: "text" } }
    }
}

const userSchema: FormSchema<User> = {
    name: { name: "User Name", type: "text" },
    skills: {
        name: "Skills",
        type: "collection",
        sectionTitle: "Skills",

        mutate: { addNextLabel: "Add skill", createValue: { name: "", level: 0, tags: [] } },
        fields: skillSchema
    }
}

export const InputCollectionForm: React.FC = () => {
    const { formViewProps: p } = useFormHook({ schema: userSchema })
    return (
        <>
            <FormView {...p} />
            <pre>{JSON.stringify(toResult(p.schema, p.state), null, 2)}</pre>
            <h3>State</h3>
            <pre>{JSON.stringify(p.state, null, 2)}</pre>
        </>
    )
}
