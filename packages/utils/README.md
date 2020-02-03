# `@formless/utils`

This set of functions that I found very useful writing typescript (and react) applications.

## Usage

### extend: `<T>(o: T) => (delta: Partial<T>) => T`

`extend` is one of those simple functions that gives you type safety when manipulating state.

```typescript
import { extend } from "@react-formless/utils"

type T =  { foo: number, bar: number}
type ReduceFn = (state: T) => T
// there is no warning here
const reduce: ReduceFn = state => ({ ...state, bra: 1 })
// this one gives error: Argument of type '{ bra: number; }' is not assignable to parameter of type 'Partial<T>'.
const reduce: ReduceFn = state => extend(state)({bra: 1})
```

using of `extend function` together with `react.useState` gives us certainty that we did reduction step properly
consider `react world` example:

```typescript
import * as React from "react"

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
```

now consider same component with using `extend function`

```typescript
import * as React from "react"
import { extend } from "@react-formless/utils"

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
```

## TODO

describe everything else
