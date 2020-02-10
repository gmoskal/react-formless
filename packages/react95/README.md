# @react-formless/react95

![tests status](https://github.com/gmoskal/react-formless/workflows/CI/badge.svg)

> Ant Design render map for `@react-formless/core`.

Check custom renderers in [action](https://gmoskal.github.io/react-formless/)

## install

first install core package and reac95 renderer (using yarn or npm)

```sh
yarn add @react-formless/core @react-formless/react95 --dev
```

then you may enjoy windows 95 experience within your forms ;)

```typescript
import * as React from "react"

import { useFormHook, FormView, FormSchema } from "@react-formless/core"
import { react95Elements, react95Inputs } from "@react-formless/react95"

export type Car = { make: string }

const carMakes: Array<[string, string]> = [
    ["Tesla", "tesla-id"],
    ["Honda", "honda-id"],
    ["BMW", "bmw-id"]
]

const schema: FormSchema<Car> = { make: { type: "select", values: carMakes } }

export const AntDesignForm: React.FC = () => {
    const { formViewProps } = useFormHook({ schema })
    return <FormView {...formViewProps} inputsRenderMap={react95Inputs} elementsRenderMap={react95Elements}/>
}
```

Checkout [full example](https://github.com/gmoskal/react-formless/blob/master/packages/examples/src/custom-renderers/index.tsx)

For more in depth documentation see [@react-formless](https://github.com/gmoskal/react-formless).
