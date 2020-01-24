import * as React from "react"
import { FormViewProps } from "../useFormHook"
import { FormView } from "../components/FormView"

export const selectCreateDiv = (id: string) => {
    let d: any = document.getElementById(id)
    if (d) return d
    d = document.createElement("div")
    document.body.appendChild(d)
    d.setAttribute("id", id)
    return d
}

type MultiThemeFormView = React.FC<
    FormViewProps<any> & {
        title: string
        onSubmitClick?: F0
        customRenderMap: Partial<InputRenderMap>
    }
>

export const MultiThemeFormView: MultiThemeFormView = ({ title, onSubmitClick, customRenderMap, ...p }) => (
    <>
        <h2>{title}</h2>
        <h3>using Plain renderer</h3>
        <FormView {...p} />
        <h3>using AntDesign renderer</h3>
        <FormView {...p} rendeType="AntDesign" />
        <h3>usign Custom renderer</h3>
        <FormView {...p} customRenderMap={customRenderMap} />
        {onSubmitClick ? <button onClick={onSubmitClick}>Login</button> : null}
        <h3>state</h3>
        <pre>{JSON.stringify(p.state, null, 2)}</pre>
    </>
)
