import * as React from "react"
import { useFormHook } from ".."
import { _noop } from "../utils"
import { MultiThemeFormView } from "./helpers"
import { ReadonlyRadioInput } from "./ReadonlyRenderMap"

export type Info = { sex: string }

const sexes: Array<[string, string]> = [
    ["Male", "male"],
    ["Female", "female"]
]

const schema: FormSchema<Info> = { sex: { type: "radio", values: sexes } }
const customRenderMap: Partial<InputRenderMap> = { radio: ReadonlyRadioInput }

export const RadioForm: React.FC = () => {
    const { formViewProps } = useFormHook({ initialValue: { sex: sexes[0][1] }, onSubmit: _noop, schema })
    return <MultiThemeFormView title="Text" {...formViewProps} customRenderMap={customRenderMap} />
}
