import * as React from "react"
import { useFormHook } from ".."
import { MultiRenderFormView } from "./MultiRenderFormView"

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

export const InputList: React.FC = () => {
    const { formViewProps } = useFormHook({ schema })
    return <MultiRenderFormView title="Text" {...formViewProps} />
}
