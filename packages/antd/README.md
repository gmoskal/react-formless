# uniforms-antd

> Ant Design render map for `@react-formless/core`.

Check custom renderers in [action](https://gmoskal.github.io/custom-renderers)

```typescript
import * as React from "react"

import { useFormHook, FormView, FormSchema } from "@react-formless/core"
import { antDesignRenderMap } from "@react-formless/antd"

export type Car = { make: string }

const carMakes: Array<[string, string]> = [
    ["Tesla", "tesla-id"],
    ["Honda", "honda-id"],
    ["BMW", "bmw-id"]
]

const schema: FormSchema<Car> = { make: { type: "select", values: carMakes } }

export const AntDesignForm: React.FC = () => {
    const { formViewProps } = useFormHook({ schema })
    return <FormView {...formViewProps} inputsRenderMap={antDesignRenderMap} />
}
```

Checkout [full example](https://github.com/gmoskal/react-formless/blob/master/packages/examples/src/custom-renderers/index.tsx)

## Install

Using npm:

```sh
npm i --save-dev @react-formless/antd
```

or using yarn:

```sh
yarn add @react-formless/antd --dev
```

For more in depth documentation see [@react-formless](https://github.com/gmoskal/react-formless).
