import * as React from "react"
import { Input, Radio } from "antd"
import { getInputProps } from "../../forms"
import "antd/lib/style/components.less"

const wrapperProps: React.HTMLAttributes<HTMLDivElement> = { style: { padding: "5px 0" }, className: "InputWrapper" }
export const AntDesignInputWrapper: React.FC = p => <div {...wrapperProps}>{p.children}</div>

const radioStyle: React.CSSProperties = {
    display: "block",
    height: "30px",
    lineHeight: "30px"
}

export const RadioInput: InputOptionRenderFn = p => {
    const inputProps = getInputProps(p)
    return (
        <>
            <Radio.Group value={inputProps.value} onChange={inputProps.onChange as any}>
                {p.schema.values.map(([name, value]) => (
                    <Radio style={radioStyle} key={value} value={value}>
                        {name}
                    </Radio>
                ))}
            </Radio.Group>
        </>
    )
}

export const antDesignRenderMap: Partial<InputRenderMap> = {
    text: p => <Input {...getInputProps(p)} value={p.state.value} />,
    password: p => <Input.Password {...getInputProps(p)} value={p.state.value} />,
    radio: RadioInput
}
