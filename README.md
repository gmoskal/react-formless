# Typed React Forms

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Data Driven react forms

The way you deal with forms depends on the way you think about the data.
This library employs advanced `typescript` types to automatically generate forms even
from quite complex data structures (defined by `type` and `schema`).
You can now focus on data structures only.

Checkout simple login form example

```typescript tsx
import * as React from "react"
import { FormView, useFormHook, toResult, FormSchema } from "@formless/core"

export type BasicInputs = { name: string; password: string; age: number; bio: string }

const schema: FormSchema<BasicInputs> = {
    name: { type: "text", placeholder: "Name" },
    password: { type: "password", placeholder: "Password" },
    age: { type: "number", placeholder: "Age" },
    bio: { type: "textarea", placeholder: "Bio" }
}

export const InputsForms: React.FC = () => {
    const { formViewProps: p } = useFormHook({ schema })
    return (
        <>
            <FormView {...p} />
            <pre>{JSON.stringify(toResult(p.schema, p.state), null, 2)}</pre>
            <h3>State</h3>
            <pre>{JSON.stringify(p.state, null, 2)}</pre>
        </>
    )
}

```

### Custom renderers

```typescript jsx

export const CustomLoginForm: React.FC<Props> = p => {
    const { formViewProps, onSubmitClick } = useFormHook({ ...p, schema })
    const customRenderMap: Partial<InputRenderMap> = {
        text: p => <h1>Readonly {p.state.value}</h1>,
        password: p => <h2>Readonly {p.state.value}</h2>
    }
    return (
        <>
            <FormView {...formViewProps} customRenderMap={customRenderMap} />
            <button onClick={onSubmitClick}>Login</button>
        </>
    )
}
```

### Custom validators

### Collections support

### Typings

### Simplicity
