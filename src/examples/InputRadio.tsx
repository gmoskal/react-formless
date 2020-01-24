import * as React from "react"
import { useFormHook } from ".."
import { MultiRenderFormView } from "./MultiRenderFormView"

export type Info = { sex: string }

const sexes: Array<[string, string]> = [
    ["Male", "male"],
    ["Female", "female"]
]

const schema: FormSchema<Info> = { sex: { type: "radio", values: sexes } }

export const InputRadioForm: React.FC = () => {
    const { formViewProps } = useFormHook({ initialValue: { sex: sexes[0][1] }, schema })
    return <MultiRenderFormView title="Text" {...formViewProps} />
}
