import { toFormState, toResult, validateForm, mkInputState, validate } from "./forms"
import { mkOk, mkErr } from "@react-formless/utils/validators"
import { FormSchema, FormState, Tuples, SimpleInputProps } from "../src"

type Tag = { name: string }
type Skill = { name: string; level: number }
type NestedSkill = Skill & { tags: Tag[] }
type NestedUser = { name: string; skills: NestedSkill[] }
type User = { name: string; skills: Skill[] }
type Bag = { items: string[] }

const genericErrorText = "generic_error"
const alwaysValid = <T>(v: T) => mkOk(v)
const alwaysInvalid = <T>(v: T) => mkErr(genericErrorText, v)
const getValidator = (valid: boolean) => [valid ? alwaysValid : alwaysInvalid]

const tagSchema = (valid = true): FormSchema<Tag> => ({
    name: { name: "Tag Name", type: "text", validators: getValidator(valid) }
})

const nestedSkillSchema = (valid = true): FormSchema<NestedSkill> => ({
    name: { name: "Skill Name", type: "text", validators: getValidator(valid) },
    level: { name: "Level", type: "number", validators: getValidator(valid) },
    tags: { name: "Tags", type: "collection", fields: tagSchema(valid) }
})

const nestedUserSchema = (valid = true): FormSchema<NestedUser> => ({
    name: { name: "Skill Name", type: "text", validators: getValidator(valid) },
    skills: { name: "Skills", type: "collection", fields: nestedSkillSchema(valid) }
})

const skillSchemaValidated = (valid = true): FormSchema<Skill> => ({
    name: { name: "Skill Name", type: "text", validators: getValidator(valid) },
    level: { name: "Level", type: "number", validators: getValidator(valid) }
})

const userSchemaValidated = (valid = true): FormSchema<User> => ({
    name: { name: "Skill Name", type: "text", validators: getValidator(valid) },
    skills: {
        name: "Skills",
        type: "collection",
        fields: skillSchemaValidated(valid)
    }
})

const bagChipsSchemaValidated = (valid = true): FormSchema<Bag> => ({
    items: {
        name: "Items",
        type: "chips",
        validators: getValidator(valid),
        field: { name: "Item", type: "text" }
    }
})

const bagListSchemaValidated = (valid = true): FormSchema<Bag> => ({
    items: {
        name: "Items",
        type: "list",
        field: { name: "Item", type: "text", validators: getValidator(valid) }
    }
})

describe("inputstate", () => {
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

    describe("toFormState()", () => {
        it("gets state with one string object", () => {
            type T = { name: string }
            const schema: FormSchema<T> = { name: { name: "Skill Name", type: "text", validators: [] } }
            const expected: FormState<T> = { name: { visited: false, active: false, value: "foo" } }

            expect(toFormState(schema, { name: "foo" })).toEqual(expected)
        })

        it("gets state with one boolean object", () => {
            type T = { isActive: boolean }
            const values: Tuples<boolean> = [
                ["Active", true],
                ["Inactive", false]
            ]
            const schema: FormSchema<T> = {
                isActive: { name: "Is it Active", type: "radio", values, validators: [] }
            }
            const expected: FormState<T> = { isActive: { visited: false, active: false, value: "false" as any } }
            expect(toFormState(schema, { isActive: false })).toEqual(expected)
        })

        it("gets state with one string object and array with one item", () => {
            const user: User = { name: "User", skills: [{ name: "datomic", level: 1 }] }

            const expected: FormState<User> = {
                name: { visited: false, active: false, value: "User" },
                skills: [
                    {
                        name: { visited: false, active: false, value: "datomic" },
                        level: { visited: false, active: false, value: 1 }
                    }
                ]
            }

            expect(toFormState(userSchemaValidated(true), user)).toEqual(expected)
        })

        it("gets state with chips array", () => {
            const bag: Bag = { items: ["item", "item2"] }

            const expected: FormState<Bag> = {
                items: { visited: false, active: false, value: ["item", "item2"] }
            }

            expect(toFormState(bagChipsSchemaValidated(), bag)).toEqual(expected)
        })

        it("gets state with list array", () => {
            const bag: Bag = { items: ["item", "item2"] }

            const expected: FormState<Bag> = {
                items: [
                    { visited: false, active: false, value: "item" },
                    { visited: false, active: false, value: "item2" }
                ]
            }

            expect(toFormState(bagListSchemaValidated(), bag)).toEqual(expected)
        })

        it("gets state with one string object and array with two items", () => {
            const user: User = {
                name: "User",
                skills: [
                    { name: "datomic", level: 1 },
                    { name: "react", level: 10 }
                ]
            }

            const expected: FormState<User> = {
                name: { visited: false, active: false, value: "User" },
                skills: [
                    {
                        name: { visited: false, active: false, value: "datomic" },
                        level: { visited: false, active: false, value: 1 }
                    },
                    {
                        name: { visited: false, active: false, value: "react" },
                        level: { visited: false, active: false, value: 10 }
                    }
                ]
            }

            expect(toFormState(userSchemaValidated(true), user)).toEqual(expected)
        })

        it("gets state with nested arrays", () => {
            const user: NestedUser = {
                name: "User",
                skills: [
                    { name: "datomic", level: 1, tags: [{ name: "db" }] },
                    { name: "react", level: 10, tags: [{ name: "tech" }, { name: "FE" }] }
                ]
            }

            const expected: FormState<NestedUser> = {
                name: { visited: false, active: false, value: "User" },
                skills: [
                    {
                        name: { visited: false, active: false, value: "datomic" },
                        level: { visited: false, active: false, value: 1 },
                        tags: [{ name: { visited: false, active: false, value: "db" } }]
                    },
                    {
                        name: { visited: false, active: false, value: "react" },
                        level: { visited: false, active: false, value: 10 },
                        tags: [
                            { name: { visited: false, active: false, value: "tech" } },
                            { name: { visited: false, active: false, value: "FE" } }
                        ]
                    }
                ]
            }

            expect(toFormState(nestedUserSchema(), user)).toEqual(expected)
        })
    })

    describe("toResult()", () => {
        it("restores flat form state", () => {
            type T = { name: string }
            const schema: FormSchema<T> = { name: { name: "Skill Name", type: "text", validators: [] } }
            const state: FormState<T> = { name: { visited: false, active: false, value: "foo" } }
            const current = (toResult(schema, state) as any).value
            expect(current).toEqual({ name: "foo" })
        })

        it("creates errors map from flat form state", () => {
            type T = { name: string }
            const schema: FormSchema<T> = {
                name: { name: "Skill Name", type: "text", validators: [alwaysInvalid] }
            }
            const state: FormState<T> = {
                name: { visited: false, active: false, value: "" }
            }
            const current = toResult(schema, state)
            expect(current).toEqual(mkErr({ name: genericErrorText }, { name: "" }))
        })

        it("restores state with chips", () => {
            const expected: Bag = {
                items: ["item", "item2"]
            }

            const state: FormState<Bag> = {
                items: { visited: false, active: false, value: ["item", "item2"] }
            }
            const current = (toResult(bagChipsSchemaValidated(), state) as any).value
            expect(current).toEqual(expected)
        })

        it("creates errors map for chips state", () => {
            const state: FormState<Bag> = {
                items: { visited: false, active: false, value: ["item", "item2"] }
            }
            const current = toResult(bagChipsSchemaValidated(false), state)
            expect(current).toEqual(
                mkErr(
                    { items: genericErrorText },
                    {
                        items: ["item", "item2"]
                    }
                )
            )
        })

        it("restores state with list", () => {
            const expected: Bag = {
                items: ["item", "item2"]
            }

            const state: FormState<Bag> = {
                items: [
                    { visited: false, active: false, value: "item" },
                    { visited: false, active: false, value: "item2" }
                ]
            }

            const current = (toResult(bagListSchemaValidated(), state) as any).value
            expect(current).toEqual(expected)
        })

        it("creates errors map for list state", () => {
            const state: FormState<Bag> = {
                items: [
                    { visited: false, active: false, value: "item" },
                    { visited: false, active: false, value: "item2" }
                ]
            }
            const current = toResult(bagListSchemaValidated(false), state)
            expect(current).toEqual(
                mkErr(
                    { items: genericErrorText },
                    {
                        items: ["item", "item2"]
                    }
                )
            )
        })

        const userState: FormState<User> = {
            name: { visited: false, active: false, value: "User" },
            skills: [
                {
                    name: { visited: false, active: false, value: "datomic" },
                    level: { visited: false, active: false, value: 1 }
                },
                {
                    name: { visited: false, active: false, value: "react" },
                    level: { visited: false, active: false, value: 10 }
                }
            ]
        }
        it("restores state with collection", () => {
            const expected: User = {
                name: "User",
                skills: [
                    { name: "datomic", level: 1 },
                    { name: "react", level: 10 }
                ]
            }

            const current = (toResult(userSchemaValidated(true), userState) as any).value
            expect(current.name).toEqual(expected.name)
            expect(current.skills).toEqual(expected.skills)
        })

        it("creates errors map from collection form state", () => {
            const current = toResult(userSchemaValidated(false), userState)
            expect(current).toEqual(
                mkErr(
                    { name: genericErrorText, skills: genericErrorText },
                    {
                        name: "User",
                        skills: [
                            { name: "datomic", level: 1 },
                            { name: "react", level: 10 }
                        ]
                    }
                )
            )
        })

        const nestedUserState: FormState<NestedUser> = {
            name: { visited: false, active: false, value: "User" },
            skills: [
                {
                    name: { visited: false, active: false, value: "datomic" },
                    level: { visited: false, active: false, value: 1 },
                    tags: [{ name: { visited: false, active: false, value: "db" } }]
                },
                {
                    name: { visited: false, active: false, value: "react" },
                    level: { visited: false, active: false, value: 10 },
                    tags: [
                        { name: { visited: false, active: false, value: "tech" } },
                        { name: { visited: false, active: false, value: "FE" } }
                    ]
                }
            ]
        }

        it("restores state with nested collection", () => {
            const expected: NestedUser = {
                name: "User",
                skills: [
                    { name: "datomic", level: 1, tags: [{ name: "db" }] },
                    { name: "react", level: 10, tags: [{ name: "tech" }, { name: "FE" }] }
                ]
            }

            const current: NestedUser = (toResult(nestedUserSchema(), nestedUserState) as any).value

            expect(current.name).toEqual(expected.name)
            expect(current.skills).toEqual(expected.skills)
        })

        it("creates error map for nested collection state", () => {
            const current = toResult(nestedUserSchema(false), nestedUserState)
            expect(current).toEqual(
                mkErr(
                    { name: genericErrorText, skills: genericErrorText },
                    {
                        name: "User",
                        skills: [
                            { name: "datomic", level: 1, tags: [{ name: "db" }] },
                            { name: "react", level: 10, tags: [{ name: "tech" }, { name: "FE" }] }
                        ]
                    }
                )
            )
        })
    })
    describe("validateForm()", () => {
        it("touches all on flat form", () => {
            type N = { n: string }
            const schema: FormSchema<N> = { n: { name: "Skill Name", type: "text", validators: [] } }
            const state: FormState<N> = { n: { visited: false, active: false, value: "User" } }
            const expectedState: FormState<N> = {
                n: { visited: true, active: false, value: "User", validationResult: mkOk("User") }
            }
            expect(validateForm(schema, state)).toEqual(expectedState)
        })

        it("touches all on chips form", () => {
            const state: FormState<Bag> = {
                items: { visited: false, active: false, value: ["item", "item2"] }
            }
            const expectedState: FormState<Bag> = {
                items: {
                    visited: true,
                    active: false,
                    value: ["item", "item2"],
                    validationResult: mkOk(["item", "item2"])
                }
            }
            expect(validateForm(bagChipsSchemaValidated(), state)).toEqual(expectedState)
        })

        it("touches all on list form", () => {
            const state: FormState<Bag> = {
                items: [
                    { visited: false, active: false, value: "item" },
                    { visited: false, active: false, value: "item2" }
                ]
            }
            const expectedState: FormState<Bag> = {
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
            expect(validateForm(bagListSchemaValidated(), state)).toEqual(expectedState)
        })

        it("touches all on nasted form", () => {
            const state: FormState<User> = {
                name: { visited: false, active: false, value: "User" },
                skills: [
                    {
                        name: { visited: false, active: false, value: "datomic" },
                        level: { visited: false, active: false, value: 1 }
                    },
                    {
                        name: { visited: false, active: false, value: "react" },
                        level: { visited: false, active: false, value: 10 }
                    }
                ]
            }

            const expectedState: FormState<User> = {
                name: { visited: true, active: false, value: "User", validationResult: mkOk("User") },
                skills: [
                    {
                        name: { visited: true, active: false, value: "datomic", validationResult: mkOk("datomic") },
                        level: { visited: true, active: false, value: 1, validationResult: mkOk(1) }
                    },
                    {
                        name: { visited: true, active: false, value: "react", validationResult: mkOk("react") },
                        level: { visited: true, active: false, value: 10, validationResult: mkOk(10) }
                    }
                ]
            }
            expect(validateForm(userSchemaValidated(true), state)).toEqual(expectedState)
        })
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
    // tslint:disable-next-line:max-file-line-count
})
