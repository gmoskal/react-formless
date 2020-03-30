# Formless

![tests status](https://github.com/gmoskal/react-formless/workflows/CI/badge.svg)
[![npm version](https://badge.fury.io/js/%40react-formless%2Fcore.svg)](https://badge.fury.io/js/%40react-formless%2Fcore)

## Data-driven react forms library written in typescript

The way you deal with forms depends on the way you think about the data.
This library employs advanced `typescript` types to automatically generate forms even
from quite complex data structures (defined by `type` and `schema`).
You can now focus on data structures only.

## Install

```sh
npm i @react-formless/core
``

## Example

Check out simple form example below, more complex one may be found in [examples folder](packages/examples/src) (online version may be found on [https://gmoskal.github.io/react-formless](https://gmoskal.github.io/react-formless))

```typescript tsx
import * as React from "react"
import { FormView, useFormHook, toResult, FormSchema } from "@react-formless/core"

export type BasicInputs = { name: string; password: string; age: number; bio: string }

const schema: FormSchema<BasicInputs> = {
    name: { type: "text", placeholder: "Name", name: "Your name", id: "name" },
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

it renders to

![tests status](packages/examples/assets/basic.png)

## Styled renderers

Whenever cusotm `shape` of the form is needed, extended version of `<FormView>` component may be used. `<StyledFormView>` allows us to control presentation layer of the form.
Checkout the example:

```typescript tsx
import * as React from "react"
import { useFormHook, FormSchema, StyledFormSchema, StyledFormView } from "@react-formless/core"

type Address = { name: string; street: string; postal: string; city: string }
type User = Address & { login: string; email: string; password: string; bio: string }

const schema: FormSchema<User> = {
    login: { name: "Login", type: "text", id: "name" },
    email: { name: "Email", type: "text", readOnly: true },
    password: { name: "Password", type: "password" },
    name: { name: "Name", type: "text" },
    street: { name: "Street", type: "text" },
    city: { name: "Street", type: "text" },
    postal: { name: "Postal", type: "text" },
    bio: { name: "Bio", type: "textarea", placeholder: "Bio" }
}

export const styledSchema: StyledFormSchema<User> = [
    { type: "Title", text: "Basic info" },
    { type: "Row", fields: ["login", "email", "password"] },

    { type: "Title", text: "Address" },
    { type: "Row", fields: ["name", "street", "postal", "city"] },

    { type: "Title", text: "Additional" },
    "bio"
]

export const LayoutForm: React.FC = () => {
    const { formViewProps: p } = useFormHook({ schema })
    return <StyledFormView {...p} styledSchema={styledSchema} />
}
```

it renders to

![tests status](packages/examples/assets/layout.png)

## Custom renderers

```typescript tsx

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
