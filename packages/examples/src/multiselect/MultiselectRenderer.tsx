import * as React from "react"
import { InputMultiselectRenderFn } from "@react-formless/core"

export const MultiselectRenderer: InputMultiselectRenderFn<string> = p => {
    const [inputValue, setInputValue] = React.useState("")
    const isSelected = (o: [string, string]) => p.state.value?.includes(o[1])
    const addedValues =
        p.state.value?.filter(v => !p.schema.values.find(vs => vs[1] === v)).map(v => [v, v] as [string, string]) || []
    const allValues = p.schema.values.concat(addedValues)
    return (
        <>
            <h2>{p.schema.name}</h2>
            {allValues.map(o => (
                <div
                    key={o[1]}
                    onClick={() => {
                        const key = o[1]
                        p.setDelta({
                            ...p.state,
                            value: isSelected(o) ? p.state.value?.filter(v => v !== key) : p.state.value?.concat(key)
                        })
                    }}>
                    {isSelected(o) ? "[x]" : "[]"} {o[0]}
                </div>
            ))}
            {p.schema.creatable && (
                <>
                    <input value={inputValue} onChange={e => setInputValue(e.target.value)} type="text" />
                    <button
                        onClick={e => {
                            e.preventDefault()
                            if (!inputValue) return
                            p.setDelta({ ...p.state, value: p.state.value?.concat(inputValue) })
                            setInputValue("")
                        }}>
                        Add
                    </button>
                </>
            )}
        </>
    )
}
