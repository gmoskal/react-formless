import * as React from "react"
import { getInputProps } from "../forms"
import { Button, Input, TextArea } from "@react95/core"
import { toMap } from "../utils/map"
import { callback } from "../utils"

export const react95Inputs: Partial<InputRenderMap> = {
    ...toMap<InputBoxType, InputBoxRenderFn>(
        ["text", "email", "password", "number", "customBox"],
        k => k,
        () => p => <Input {...getInputProps(p)} />
    ),
    textarea: p => <TextArea {...getInputProps(p)} />
}

export const react95Elements: Partial<ElementsRenderMap> = {
    Button: p => <Button onClick={callback(p.onClick)} value={p.children ? `${p.children}` : ""} />
}
