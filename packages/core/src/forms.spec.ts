import { toFormState, toResult, validateForm, mkInputState, validate, isFormActive } from "./forms"
import { mkOk, mkErr } from "@react-formless/utils/validators"
import { FormSchema, FormState, Tuples, SimpleInputProps } from "../src"

const genericErrorText = "generic_error"
const alwaysValid = <T>(v: T) => mkOk(v)
const alwaysInvalid = <T>(v: T) => mkErr(genericErrorText, v)
type Validity = "valid" | "invalid"
const getValidator = (validity: Validity) => [validity === "valid" ? alwaysValid : alwaysInvalid]

describe("text type", () => {
    type Text = { text: string }
    const state: FormState<Text> = { text: { visited: false, active: false, value: "foo" } }

    const mkSimpleTextSchema = (valid: Validity = "valid"): FormSchema<Text> => ({
        text: { name: "Name", type: "text", validators: getValidator(valid) }
    })

    test("toFormState()", () => {
        const expected: FormState<Text> = { text: { visited: false, active: false, value: "foo" } }
        expect(toFormState(mkSimpleTextSchema(), { text: "foo" })).toEqual(expected)
    })

    test("toResult() => ok", () => {
        const current = toResult(mkSimpleTextSchema(), state).value
        expect(current).toEqual({ text: "foo" })
    })

    test("toResult() => err", () => {
        const current = toResult(mkSimpleTextSchema("invalid"), state)
        expect(current).toEqual(mkErr({ text: genericErrorText }, { text: "foo" }))
    })

    test("validateForm()", () => {
        const expectedState: FormState<Text> = {
            text: { visited: true, active: false, value: "foo", validationResult: mkOk("foo") }
        }
        expect(validateForm(mkSimpleTextSchema(), state)).toEqual(expectedState)
    })

    it("isFormActive()", () => {
        const activeState: FormState<Text> = { text: { visited: false, active: true, value: "foo" } }
        const inactiveState: FormState<Text> = { text: { visited: false, active: false, value: "foo" } }
        expect(isFormActive(mkSimpleTextSchema(), activeState)).toEqual(true)
        expect(isFormActive(mkSimpleTextSchema(), inactiveState)).toEqual(false)
    })
})

describe("radio type", () => {
    test("toFormState()", () => {
        type T = { isActive: boolean }
        const values: Tuples<boolean> = [
            ["Active", true],
            ["Inactive", false]
        ]
        const schema: FormSchema<T> = {
            isActive: { name: "Name", type: "radio", values, validators: [] }
        }
        const expected: FormState<T> = { isActive: { visited: false, active: false, value: "false" as any } }
        expect(toFormState(schema, { isActive: false })).toEqual(expected)
    })
})

describe("collection type", () => {
    type Value = { name: string }
    type Collection = { values: Value[] }

    type NestedValue = Value & { values: Value[] }
    type NestedCollection = { nestedValues: NestedValue[] }

    const getValueSchema = (valid: Validity = "valid"): FormSchema<Value> => ({
        name: { name: "Name", type: "text", validators: getValidator(valid) }
    })

    const getCollectionSchema = (valid: Validity = "valid"): FormSchema<Collection> => ({
        values: { name: "Values", type: "collection", fields: getValueSchema(valid) }
    })

    const getNestedValueSchema = (valid: Validity = "valid"): FormSchema<NestedValue> => ({
        name: { name: "Name", type: "text", validators: getValidator(valid) },
        values: { name: "Values", type: "collection", fields: getValueSchema(valid) }
    })

    const getNestedCollectionSchema = (valid: Validity = "valid"): FormSchema<NestedCollection> => ({
        nestedValues: { name: "Nested values", type: "collection", fields: getNestedValueSchema(valid) }
    })

    const collection: Collection = {
        values: [{ name: "foo" }, { name: "bar" }]
    }

    const collectionState: FormState<Collection> = {
        values: [
            { name: { visited: false, active: false, value: "foo" } },
            { name: { visited: false, active: false, value: "bar" } }
        ]
    }

    const nestedCollection: NestedCollection = {
        nestedValues: [
            { name: "foo", values: [{ name: "baz" }] },
            { name: "bar", values: [{ name: "qux" }, { name: "quz" }] }
        ]
    }

    const nestedCollectionState: FormState<NestedCollection> = {
        nestedValues: [
            {
                name: { visited: false, active: false, value: "foo" },
                values: [{ name: { visited: false, active: false, value: "baz" } }]
            },
            {
                name: { visited: false, active: false, value: "bar" },
                values: [
                    { name: { visited: false, active: false, value: "qux" } },
                    { name: { visited: false, active: false, value: "quz" } }
                ]
            }
        ]
    }
    test("toFormState()", () => expect(toFormState(getCollectionSchema(), collection)).toEqual(collectionState))
    test("nested toFormState()", () =>
        expect(toFormState(getNestedCollectionSchema(), nestedCollection)).toEqual(nestedCollectionState))

    test("toResult() => ok", () => {
        const current = (toResult(getCollectionSchema(), collectionState) as any).value
        expect(current.values).toEqual(collection.values)
    })

    test("toResult() => err", () => {
        const current = toResult(getCollectionSchema("invalid"), collectionState)
        expect(current).toEqual(mkErr({ values: genericErrorText }, collection))
    })

    test("nested toResult() => ok", () => {
        const current: NestedCollection = (toResult(getNestedCollectionSchema(), nestedCollectionState) as any).value
        expect(current.nestedValues).toEqual(nestedCollection.nestedValues)
    })

    test("nested toResult() => err", () => {
        const current = toResult(getNestedCollectionSchema("invalid"), nestedCollectionState)
        expect(current).toEqual(mkErr({ nestedValues: genericErrorText }, nestedCollection))
    })

    test("validateForm()", () => {
        const validatedState: FormState<Collection> = {
            values: [
                { name: { visited: true, active: false, value: "foo", validationResult: mkOk("foo") } },
                { name: { visited: true, active: false, value: "bar", validationResult: mkOk("bar") } }
            ]
        }
        expect(validateForm(getCollectionSchema(), collectionState)).toEqual(validatedState)
    })

    it("nested isFormActive()", () => {
        const activeState: FormState<NestedCollection> = {
            nestedValues: [
                {
                    name: { visited: false, active: false, value: "foo" },
                    values: [{ name: { visited: false, active: false, value: "baz" } }]
                },
                {
                    name: { visited: false, active: false, value: "bar" },
                    values: [
                        { name: { visited: false, active: true, value: "qux" } },
                        { name: { visited: false, active: false, value: "quz" } }
                    ]
                }
            ]
        }

        const inactiveState: FormState<NestedCollection> = {
            nestedValues: [
                {
                    name: { visited: false, active: false, value: "foo" },
                    values: [{ name: { visited: false, active: false, value: "baz" } }]
                },
                {
                    name: { visited: false, active: false, value: "bar" },
                    values: [
                        { name: { visited: false, active: false, value: "qux" } },
                        { name: { visited: false, active: false, value: "quz" } }
                    ]
                }
            ]
        }
        expect(isFormActive(getNestedCollectionSchema(), activeState)).toEqual(true)
        expect(isFormActive(getNestedCollectionSchema(), inactiveState)).toEqual(false)
    })
})

describe("list type", () => {
    type List = { items: string[] }

    const getListSchema = (valid: Validity = "valid"): FormSchema<List> => ({
        items: {
            name: "Items",
            type: "list",
            field: { name: "Item", type: "text", validators: getValidator(valid) }
        }
    })

    const list: List = { items: ["item", "item2"] }

    const listState: FormState<List> = {
        items: [
            { visited: false, active: false, value: "item" },
            { visited: false, active: false, value: "item2" }
        ]
    }

    test("toFormState()", () => {
        expect(toFormState(getListSchema(), list)).toEqual(listState)
    })

    test("toResult() => ok", () => {
        const current = (toResult(getListSchema(), listState) as any).value
        expect(current).toEqual(list)
    })

    test("toResult() => err", () => {
        const current = toResult(getListSchema("invalid"), listState)
        expect(current).toEqual(mkErr({ items: genericErrorText }, list))
    })

    it("validateForm", () => {
        const validatedState: FormState<List> = {
            items: [
                {
                    visited: true,
                    active: false,
                    value: "item",
                    validationResult: mkOk("item")
                },
                {
                    visited: true,
                    active: false,
                    value: "item2",
                    validationResult: mkOk("item2")
                }
            ]
        }
        expect(validateForm(getListSchema(), listState)).toEqual(validatedState)
    })

    test("isFormActive()", () => {
        const activeState: FormState<List> = {
            items: [
                { visited: false, active: true, value: "item" },
                { visited: false, active: false, value: "item2" }
            ]
        }
        const inactiveState: FormState<List> = {
            items: [
                { visited: false, active: false, value: "item" },
                { visited: false, active: false, value: "item2" }
            ]
        }
        expect(isFormActive(getListSchema(), activeState)).toEqual(true)
        expect(isFormActive(getListSchema(), inactiveState)).toEqual(false)
    })
})

describe("multiselect type", () => {
    type Multiselect = { values: string[] }

    const getMultiselectSchema = (valid: Validity = "valid"): FormSchema<Multiselect> => ({
        values: {
            name: "Values",
            type: "multiselect",
            subtype: "multiselect",
            values: [
                ["label1", "foo"],
                ["label2", "bar"]
            ],
            validators: getValidator(valid)
        }
    })

    const emptyMultiselect: Multiselect = {} as any
    const emptyMultiselectState: FormState<Multiselect> = { values: { visited: false, active: false, value: [] } }

    const multiselect: Multiselect = { values: ["foo", "bar"] }

    const multiselectState: FormState<Multiselect> = {
        values: { visited: false, active: false, value: ["foo", "bar"] }
    }

    test("toFormState()", () => {
        expect(toFormState(getMultiselectSchema(), emptyMultiselect)).toEqual(emptyMultiselectState)
        expect(toFormState(getMultiselectSchema(), multiselect)).toEqual(multiselectState)
    })

    test("toResult() => ok", () => {
        const current = (toResult(getMultiselectSchema(), multiselectState) as any).value
        expect(current).toEqual(multiselect)
    })

    test("toResult() => err", () => {
        const current = toResult(getMultiselectSchema("invalid"), multiselectState)
        expect(current).toEqual(mkErr({ values: genericErrorText }, multiselect))
    })

    it("validateForm", () => {
        const validatedState: FormState<Multiselect> = {
            values: {
                visited: true,
                active: false,
                value: ["foo", "bar"],
                validationResult: mkOk(["foo", "bar"])
            }
        }
        expect(validateForm(getMultiselectSchema(), multiselectState)).toEqual(validatedState)
    })

    test("isFormActive()", () => {
        const activeState: FormState<Multiselect> = {
            values: { visited: false, active: true, value: ["foo", "bar"] }
        }
        const inactiveState: FormState<Multiselect> = {
            values: { visited: false, active: false, value: ["foo", "bar"] }
        }
        expect(isFormActive(getMultiselectSchema(), activeState)).toEqual(true)
        expect(isFormActive(getMultiselectSchema(), inactiveState)).toEqual(false)
    })
})

describe("InputState()", () => {
    it("constructs state with correct value", () =>
        expect(mkInputState("", "foo")).toEqual({
            visited: false,
            active: false,
            value: "foo"
        }))
    it("constructs state with def value when value is empty", () =>
        expect(mkInputState("def", "")).toEqual({
            visited: false,
            active: false,
            value: "def"
        }))
    it("constructs state with def value when value is undefined", () =>
        expect(mkInputState("def", undefined)).toEqual({
            visited: false,
            active: false,
            value: "def"
        }))
    it("constructs state with active param ", () =>
        expect(mkInputState("", "foo", true)).toEqual({
            visited: false,
            active: true,
            value: "foo"
        }))
    it("constructs state with visited param ", () =>
        expect(mkInputState("", "foo", false, true)).toEqual({
            visited: true,
            active: false,
            value: "foo"
        }))
})

describe("validate()", () => {
    type N = { foo: number }
    const state: N = { foo: 1 }
    const input: SimpleInputProps = { state, schema: { type: "number" }, setDelta: jest.fn() }
    const value = { foo: 2 }

    beforeEach(() => input.setDelta.mockReset())

    it("sets state, value and validation result with setDelta", () => {
        validate<N>(input, value)
        const expected = { ...input.state, value, validationResult: mkOk(value) }
        expect(input.setDelta).toBeCalledWith(expected)
    })

    it("returns validation result", () => {
        const current = validate<N>(input, value)
        expect(current).toEqual(mkOk(value))
    })

    it("should should transform value with given function", () => {
        const result = { foo: "1" }
        const toValue = jest.fn().mockReturnValue(result)
        validate<N>({ ...input, schema: { ...input.schema, toValue } }, value)

        expect(toValue).toBeCalledWith(value)
        expect(input.setDelta.mock.calls[0][0].value).toEqual(result)
    })
})
