# Typed React Forms

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

The way you deal with forms depends on the way you think about the data. If you focus on the data structure
(defined by `type` and `schema`) you may expect the form to generated automaticly. It should work no matter how complex your data structure is.
This library solves that problem using advanced `typesctipt` types, so you may focus on data structure only.

Example

```typescript jsx
import * as React from "react"
import { validators, useFormHook, FormView } from "typed-react-forms"

type Credentials = { email: string; password: string }

const schema: FormSchema<Credentials> = {
    email: { name: "Email address", type: "text", validators: validators.validEmail },
    password: { name: "Password", type: "password", validators: validators.validString }
}

export const LoginForm: React.FC = () => {
    const { formViewProps, onSubmitClick } = useFormHook({
        schema,
        initialValue: { email: "", password: "" },
        onSubmit: console.log
    })

    return (
        <>
            <FormView {...formViewProps} />
            <button onClick={onSubmitClick}>Login</button>
        </>
    )
}
```
