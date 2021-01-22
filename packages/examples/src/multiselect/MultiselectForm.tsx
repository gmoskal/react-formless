import * as React from "react"
import { FormSchema, FormView, plainHtmlRenderMap, useFormHook } from "@react-formless/core"
import { MultiselectRenderer } from "./MultiselectRenderer"

type Item = { tags: string[]; cities: string[] }

const schema: FormSchema<Item> = {
    tags: {
        name: "Tags",
        type: "multiselect",
        creatable: true,
        values: [
            ["Tag1", "tag1"],
            ["Tag2", "tag2"]
        ]
    },
    cities: {
        name: "Citites",
        type: "multiselect",
        values: [
            ["New York", "newyork"],
            ["Wroclaw", "wroclaw"]
        ]
    }
}

export const MultiselectForm = () => {
    const { formViewProps } = useFormHook<Item>({ schema })

    return (
        <form>
            <FormView
                {...formViewProps}
                inputsRenderMap={{ ...plainHtmlRenderMap, multiselect: MultiselectRenderer }}
            />
            <h3>State</h3>
            <pre>{JSON.stringify(formViewProps.state, null, 2)}</pre>
        </form>
    )
}
