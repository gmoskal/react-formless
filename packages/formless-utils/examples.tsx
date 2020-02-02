import * as React from "react"
import { extend } from "@formless/utils"

export const Comp = () => {
    const [state, setState] = React.useState({ foo: 1, bar: 2 })
    return (
        <>
            <h1>foo {state.foo}</h1>
            <button onClick={_ => setState({ ...state, foo: state.foo + 1 })}>+</button>
            <button onClick={_ => setState(s => ({ ...s, foo: 0 }))}>reset</button>
            <h1>bar {state.bar}</h1>
            <button onClick={_ => setState(s => ({ ...s, bar: s.bar + 1 }))}>+</button>
            <button onClick={_ => setState(s => ({ ...s, bra: 0 }))}>reset</button>
        </>
    )
}

export const Comp2 = () => {
    const [state, setState] = React.useState({ foo: 1, bar: 2 })
    return (
        <>
            <h1>foo {state.foo}</h1>
            <button onClick={_ => setState(s => extend(s)({ foo: s.foo + 1 }))}>+</button>
            <button onClick={_ => setState(s => extend(s)({ foo: 0 }))}>reset</button>
            <h1>bar {state.bar}</h1>
            <button onClick={_ => setState(s => extend(s)({ bar: s.bar + 1 }))}>+</button>
            <button onClick={_ => setState(s => extend(s)({ bra: 0 }))}>reset</button>
        </>
    )
}
