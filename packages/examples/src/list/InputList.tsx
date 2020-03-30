import * as React from "react"
import { FormSchema, FormView, useFormHook } from "@react-formless/core"

export type Info = { sex: string }
type Bag = { items: string[] }

const schema: FormSchema<Bag> = {
    items: {
        name: "Items",
        type: "list",
        field: { name: "Item", type: "text" },
        sectionTitle: "Items",
        mutate: { addNextLabel: "Add Item", createValue: "" }
    }
}

export const InputListForm: React.FC = () => {
    const { formViewProps: p, result } = useFormHook({ schema })
    return (
        <>
            <FormView {...p} />
            <h3>Validation result</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
            <h3>State</h3>
            <pre>{JSON.stringify(p.state, null, 2)}</pre>
        </>
    )
}
