import * as React from "react"
import { Input } from "antd"
import { InputRenderMap } from "../FormView"
import { getInputProps } from "../../forms"
import "antd/lib/style/components.less"

const wrapperProps: React.HTMLAttributes<HTMLDivElement> = { style: { padding: "5px 0" }, className: "InputWrapper" }
export const AntDesignInputWrapper: React.FC = p => <div {...wrapperProps}>{p.children}</div>
export const antDesignRenderMap: Partial<InputRenderMap> = {
    text: p => <Input {...getInputProps(p)} value={p.state.value} />,
    password: p => <Input.Password {...getInputProps(p)} value={p.state.value} />
}
