import * as React from "react"
import { InputNumber, Input, Radio, Select, Button } from "antd"
import {
    getInputProps,
    ElementsRenderMap,
    InputOptionRenderFn,
    InputBoxRenderFn,
    InputRenderMap
} from "@react-formless/core"

import "antd/lib/style/components.less"

const wrapperProps: React.HTMLAttributes<HTMLDivElement> = { style: { padding: "5px 0" }, className: "InputWrapper" }

const ItemWrapper: React.FC = ({ children, ...p }) => (
    <div {...wrapperProps} {...p}>
        {children}
    </div>
)

export const antDesignElementRenderMap: Partial<ElementsRenderMap> = {
    ItemWrapper,
    Button: Button as any,
    ItemChildrenWrapper: React.Fragment,
    DefaultFormItem: () => <h1>Not supported</h1>
}

export const RadioInput: InputOptionRenderFn = p => {
    const { value, onChange } = getInputProps<HTMLSelectElement>(p)
    return (
        <Radio.Group value={value} onChange={onChange as any}>
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
const AntSelect: InputOptionRenderFn = p => {
    const { onChange, value, ...props } = getInputProps(p)
    const handleChange = (v: any) => {
        if (!onChange || v === undefined) return
        onChange({ target: { value: `${v}` } } as any)
    }
    return (
        <Select value={value} onChange={handleChange} style={{ width: 120 }}>
            {p.schema.values.map(([name, value]) => (
                <Select.Option key={value} value={value}>
                    {name}
                </Select.Option>
            ))}
        </Select>
    )
}
export const antDesignRenderMap: Partial<InputRenderMap> = {
    text: p => <Input {...getInputProps(p)} />,
    password: p => <Input.Password {...getInputProps(p)} />,
    textarea: p => <Input.TextArea {...getInputProps(p)} />,
    number: AntInputNumber,
    radio: RadioInput,
    select: AntSelect
}
