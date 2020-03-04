# Formless

![tests status](https://github.com/gmoskal/react-formless/workflows/CI/badge.svg)

## Data-driven react forms library written in typescript

The way you deal with forms depends on the way you think about the data.
This library employs advanced `typescript` types to automatically generate forms even
from quite complex data structures (defined by `type` and `schema`).
You can now focus on data structures only.


## Install

```sh
npm i @react-formless/core
```

## Example

Check out simple form example below, more complex one may be found in [examples folder](packages/examples/src) (online version may be found on [https://gmoskal.github.io/react-formless](https://gmoskal.github.io/react-formless))

```typescript tsx
import * as React from "react"
import { FormView, useFormHook, toResult, FormSchema } from "@react-formless/core"

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

export const CustomInputsForms: React.FC = () => {
    const { formViewProps: p } = useFormHook({ schema })
    const customRenderMap: Partial<InputRenderMap> = {
        text: rp => <h1>Readonly text {rp.state.value}</h1>,
        password: rp => <h2>Readonly password {rp.state.value}</h2>
    }
    return  <FormView {...p} customRenderMap={customRenderMap} />
}
```

## More examples

To compile and run project's examples, clone this repo and type

```bash
yarn
yarn build
yarn workspace @react-formless/examples start
```

example project should be running on http://localhost:1234

You may check running online version [here](https://gmoskal.github.io/react-formless)

More documentation comming soon

### Custom validators

### Collections support

### Typings

### Simplicity
