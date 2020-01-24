import * as React from "react"
import { FormViewProps } from "../useFormHook"
import { FormView } from "../components/FormView"
import { readOnlyRenderMap } from "./ReadonlyRenderMap"

type Props = React.FC<FormViewProps<any> & { title: string; onSubmitClick?: F0 }>

export const MultiRenderFormView: Props = ({ title, onSubmitClick, ...p }) => (
    <>
        <h2>{title}</h2>

        <h3>Plain HTML renderer</h3>
        <FormView {...p} />

        <h3>Ant Design renderer</h3>
        <FormView {...p} rendeType="AntDesign" />

        <h3>Custom (Readonly) renderer</h3>
        <FormView {...p} customRenderMap={readOnlyRenderMap} />

        {onSubmitClick ? <button onClick={onSubmitClick}>Login</button> : null}

        <h3>state</h3>
        <pre>{JSON.stringify(p.state, null, 2)}</pre>
    </>
)
