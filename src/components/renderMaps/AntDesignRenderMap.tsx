import * as React from "react"
import { InputNumber, Input, Radio } from "antd"
import { getInputProps } from "../../forms"

import "antd/lib/style/components.less"

const wrapperProps: React.HTMLAttributes<HTMLDivElement> = { style: { padding: "5px 0" }, className: "InputWrapper" }
export const AntDesignInputWrapper: React.FC = p => <div {...wrapperProps}>{p.children}</div>

export const RadioInput: InputOptionRenderFn = p => {
    const inputProps = getInputProps(p)
    return (
        <Radio.Group value={inputProps.value} onChange={inputProps.onChange as any}>
            {p.schema.values.map(([name, value]) => (
                <Radio key={value} value={value}>
                    {name}
                </Radio>
            ))}
        </Radio.Group>
    )
}

const AntInputNumber: InputBoxRenderFn = p => {
    const { onChange, value, ...props } = getInputProps(p)
    const onChangeHandler = (v?: number) => {
        if (!onChange || v === undefined) return
        onChange({ target: { value: `${v}` } } as any)
    }
    const v = parseInt(`${value}`, 10) || undefined

    return <InputNumber {...props} onChange={onChangeHandler} value={v} />
}

export const antDesignRenderMap: Partial<InputRenderMap> = {
    text: p => <Input {...getInputProps(p)} />,
    password: p => <Input.Password {...getInputProps(p)} />,
    textarea: p => <Input.TextArea {...getInputProps(p)} />,
    number: AntInputNumber,
    radio: RadioInput
}
