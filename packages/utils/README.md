# `@react-formless/utils`
The set of functions that I found very useful for writing an application using react and typescript

## extend()

### Signature

```typescript
type extendFunction = <T>(object: T) => (delta: Partial<T>) => T
```

### Description

It takes any object and returns function that takes any part of that object and returns this object and part combained.
Tip: _When used together with `react.useState` it gives certainty that the reduction step was done in a proper way._

### Example

```typescript
import { extend } from "@react-formless/utils"

type T = { foo: number, bar: number}
type ReduceFn = (state: T) => T

// there is no warning here
const reduce: ReduceFn = state => ({ ...state, bra: 1 })

// this one gives error: Argument of type '{ bra: number; }' 
// is not assignable to parameter of type 'Partial<T>'.
const reduce: ReduceFn = state => extend(state)({bra: 1})
```

Consider a `react world` example

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

Same component with `extend()` use

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

[Check it out your self](https://stackblitz.com/edit/react-ts-n3sg2e?embed=1&file=index.tsx&hideExplorer=1)

## TODO

describe everything else
