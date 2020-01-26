import * as React from "react"
import { FormViewProps, useFormHook } from "../useFormHook"
import { FormView } from "../components/FormView"
import { readOnlyRenderMap } from "./ReadonlyRenderMap"
import { toResult } from "../forms"

const themes: Array<[string, RenderType]> = [
    ["Plain Html", "Plain"],
    ["Ant Design", "AntDesign"],
    ["Readonly", "Custom"]
]

const schema: FormSchema<{ renderType: RenderType }> = {
    renderType: { type: "select", values: themes }
}

type Props = React.FC<FormViewProps<any> & { title: string }>

export const MultiRenderFormView: Props = ({ title, ...p }) => {
    const { formViewProps } = useFormHook({ initialValue: { renderType: "Plain" }, schema })
    const [renderOptions, setRenderOptions] = React.useState<RenderOptions>({ renderType: "Plain" })
    React.useEffect(() => {
        const renderType: RenderType = formViewProps.state.renderType.value || "Plain"
        setRenderOptions({ renderType, ...(renderType === "Custom" ? { inputsRenderMap: readOnlyRenderMap } : {}) })
    }, [formViewProps.state, formViewProps.state.renderType.value])

    return (
        <>
            <h2>Select render type</h2>
            <FormView {...formViewProps} renderType="AntDesign" />
            <h2>{title}</h2>
            <div style={{ border: "1px solid #eee", padding: 10, margin: "5px 0" }}>
                <FormView {...p} {...renderOptions} />
            </div>
            <h3>Validation result</h3>
            <pre>{JSON.stringify(toResult(p.schema, p.state), null, 2)}</pre>
            <h3>State</h3>
            <pre>{JSON.stringify(p.state, null, 2)}</pre>
        </>
    )
}
