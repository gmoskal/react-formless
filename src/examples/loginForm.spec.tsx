import { mount } from "enzyme"
import * as React from "react"
import { Credentials, LoginForm } from "./loginForm"

const initialValue: Credentials = { email: "em@a.il", password: "foo" }
describe("<LoginForm>", () => {
    it.skip("renders two inputs with inital values", () => {
        const inputs = mount(<LoginForm onSubmit={jest.fn} initialValue={initialValue} />).find("input")

        const emailProps = inputs.at(0).props()
        expect(emailProps.placeholder).toEqual("Email")
        expect(emailProps.value).toEqual(initialValue.email)

        const passwordProps = inputs.at(1).props()
        expect(passwordProps.placeholder).toEqual("Secret")
        expect(passwordProps.value).toEqual(initialValue.password)
    })
})

// describe("<LoginFormCustom>", () => {
//     it("renders two inputs with inital values", () => {
//         const wrapper = mount(<LoginFormCustom onSubmit={jest.fn} initialValue={initialValue} />)
//         expect(wrapper.find("h1").text()).toEqual(`Readonly ${initialValue.email}`)
//         expect(wrapper.find("h2").text()).toEqual(`Readonly ${initialValue.password}`)
//     })
// })
