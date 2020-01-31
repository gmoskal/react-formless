import * as React from "react"
import { useFormHook, toResult, FormView, FormSchema, RenderOptions } from "@formless/core"
import { readOnlyRenderMap } from "./ReadonlyRenderMap"
import { react95Inputs, react95Elements } from "./React95"
import { FormViewProps } from "@formless/core/src/useFormHook"
import { antDesignRenderMap } from "@formless/antd"
import { labelize } from "@formless/utils"

const renderTypes = ["Plain", "AntDesign", "Readonly", "React95"] as const
const themes: Array<[string, string]> = renderTypes.map(v => [labelize(v), v])

const schema: FormSchema<{ renderType: string }> = {
    renderType: { type: "select", values: themes }
}

type Props = React.FC<FormViewProps<any> & { title: string }>

export const MultiRenderFormView: Props = ({ title, ...p }) => {
    const { formViewProps } = useFormHook({ initialValue: { renderType: "Plain" }, schema })
    const [renderOptions, setRenderOptions] = React.useState<RenderOptions>({})
    React.useEffect(() => {
        const selectedRender = formViewProps.state.renderType.value
        const options = ((): RenderOptions => {
            switch (selectedRender) {
                case "React95":
                    return { inputsRenderMap: react95Inputs, elementsRenderMap: react95Elements }
                case "AntDesign":
                    return { inputsRenderMap: antDesignRenderMap }
                case "Readonly":
                    return { inputsRenderMap: readOnlyRenderMap }
            }
            return {}
        })()

        setRenderOptions(options)
    }, [formViewProps.state, formViewProps.state.renderType.value])

    return (
        <>
            <h2>Select render type</h2>
            <FormView {...formViewProps} inputsRenderMap={antDesignRenderMap} />
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
