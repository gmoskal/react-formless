import { useFormHook, FormHookProps } from "./useFormHook"
import { renderHook, act } from "@testing-library/react-hooks"
import { factory } from "@formless/utils/map"
import { _noop } from "@formless/utils/misc"
import { validateAZ, validNumber, validateNotEmpty, mkOk } from "@formless/utils/validators"
import { InputState, FormSchema, FormState } from "."

describe("useFormHook()", () => {
    const getFormHook = <T>(p: FormHookProps<T>) => renderHook(() => useFormHook(p))
    type Skill = { name: string; level: number }
    const stringInputStateFixture = factory<InputState<string>>({ active: false, visited: false, value: "" })
    const numberInputStateFixture = factory<InputState<number>>({ active: false, visited: false, value: 0 })

    const initialValue: Skill = { name: "", level: 0 }
    const schema: FormSchema<Skill> = {
        name: { name: "Skill Name", type: "text", validators: [validateNotEmpty, validateAZ] },
        level: { name: "Level", type: "number", validators: validNumber, toValue: v => parseInt(v, 10) }
    }

    const schemaNoValidators: FormSchema<Skill> = {
        name: { name: "Skill Name", type: "text", validators: [] },
        level: { name: "Level", type: "number", validators: [], toValue: v => parseInt(v, 10) }
    }

    it("returns correct form state when initialized", () => {
        const expected: FormState<Skill> = { name: stringInputStateFixture(), level: numberInputStateFixture() }

        const { result } = getFormHook<Skill>({ schema, initialValue, onSubmit: _noop })
        expect(result.current.formViewProps.state).toEqual(expected)
    })

    it("returns correct result when no errors", () => {
        const { result } = getFormHook<Skill>({ schema: schemaNoValidators, initialValue, onSubmit: _noop })
        expect(result.current.result).toEqual(mkOk(initialValue))
    })

    it("returns initial values on submit without changes", () => {
        const resultSpy = jest.fn()
        const { result } = getFormHook({ schema: schemaNoValidators, initialValue, onSubmit: resultSpy })
        result.current.onSubmitClick()
        expect(resultSpy).toBeCalledWith(initialValue)
    })

    it("calls setState and returns ok validation", () => {
        const onSubmit = jest.fn()
        const { result } = getFormHook<Skill>({ schema, initialValue, onSubmit })
        const delta: FormState<Skill> = {
            name: stringInputStateFixture({ value: "a" }),
            level: numberInputStateFixture()
        }
        act(() => result.current.formViewProps.setState(delta))
        expect(result.current.formViewProps.state.name.value).toEqual("a")
        expect(onSubmit).toBeCalledTimes(0)
    })

    it("call setState and returns error when validation fails", () => {
        const onSubmit = jest.fn()
        const { result } = getFormHook<Skill>({ schema, initialValue, onSubmit })
        const delta: FormState<Skill> = {
            name: stringInputStateFixture({ value: "1" }),
            level: numberInputStateFixture()
        }

        act(() => result.current.formViewProps.setState(delta))
        act(() => result.current.onSubmitClick())

        expect(result.current.formViewProps.state.name.validationResult!.type).toEqual("Err")
        expect(onSubmit).toBeCalledTimes(0)
    })

    it("calls onSubmitClick when validation passed", () => {
        const onSubmit = jest.fn()
        const { result } = getFormHook<Skill>({ schema, initialValue, onSubmit })
        const delta: FormState<Skill> = {
            name: stringInputStateFixture({ value: "foo" }),
            level: numberInputStateFixture()
        }
        act(() => result.current.formViewProps.setState(delta))
        act(() => result.current.onSubmitClick())
        expect(onSubmit).toBeCalledTimes(1)
    })

    it("returns new props when setState prop is called", () => {
        const { result } = getFormHook<Skill>({ schema, initialValue, onSubmit: _noop })
        const value = "foo"
        const delta: FormState<Skill> = { name: stringInputStateFixture({ value }), level: numberInputStateFixture() }
        act(() => result.current.formViewProps.setState(delta))
        expect(result.current.formViewProps.state.name.value).toEqual(value)
    })
})
