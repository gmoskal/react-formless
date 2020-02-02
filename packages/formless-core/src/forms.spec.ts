import { toFormState, toResult, validateForm, mkInputState } from "./forms"
import { mkOk } from "@react-formless/utils/validators"
import { FormSchema, FormState, Tuples } from "."

type Tag2 = { name: string }
type Skill = { name: string; level: number }
type Skill2 = Skill & { tags: Tag2[] }
type User2 = { name: string; skills: Skill2[] }
type User = { name: string; skills: Skill[] }
type Bag = { items: string[] }

const tag2Schema: FormSchema<Tag2> = {
    name: { name: "Tag Name", type: "text", validators: [] }
}

const skillSchema2: FormSchema<Skill2> = {
    name: { name: "Skill Name", type: "text", validators: [] },
    level: { name: "Level", type: "number", validators: [] },
    tags: { name: "Tags", type: "collection", fields: tag2Schema, validators: [] }
}

const userSchema2: FormSchema<User2> = {
    name: { name: "Skill Name", type: "text", validators: [] },
    skills: { name: "Skills", type: "collection", validators: [], fields: skillSchema2 }
}

const skillSchema: FormSchema<Skill> = {
    name: { name: "Skill Name", type: "text", validators: [] },
    level: { name: "Level", type: "number", validators: [] }
}

const userSchema: FormSchema<User> = {
    name: { name: "Skill Name", type: "text", validators: [] },
    skills: { name: "Skills", type: "collection", validators: [], fields: skillSchema }
}

const bagChipsSchema: FormSchema<Bag> = {
    items: { name: "Items", type: "chips", field: { name: "Item", type: "text", validators: [] } }
}

const bagListSchema: FormSchema<Bag> = {
    items: { name: "Items", type: "list", field: { name: "Item", type: "text", validators: [] } }
}

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

            expect(toFormState(userSchema, user)).toEqual(expected)
        })

        it("gets state with chips array", () => {
            const bag: Bag = { items: ["item", "item2"] }

            const expected: FormState<Bag> = {
                items: { visited: false, active: false, value: ["item", "item2"] }
            }

            expect(toFormState(bagChipsSchema, bag)).toEqual(expected)
        })

        it("gets state with list array", () => {
            const bag: Bag = { items: ["item", "item2"] }

            const expected: FormState<Bag> = {
                items: [
                    { visited: false, active: false, value: "item" },
                    { visited: false, active: false, value: "item2" }
                ]
            }

            expect(toFormState(bagListSchema, bag)).toEqual(expected)
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

            expect(toFormState(userSchema, user)).toEqual(expected)
        })

        it("gets state with nested arrays", () => {
            const user: User2 = {
                name: "User",
                skills: [
                    { name: "datomic", level: 1, tags: [{ name: "db" }] },
                    { name: "react", level: 10, tags: [{ name: "tech" }, { name: "FE" }] }
                ]
            }

            const expected: FormState<User2> = {
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

            expect(toFormState(userSchema2, user)).toEqual(expected)
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

        it("restores state with collection", () => {
            const expected: User = {
                name: "User",
                skills: [
                    { name: "datomic", level: 1 },
                    { name: "react", level: 10 }
                ]
            }

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

            const current = (toResult(userSchema, state) as any).value
            expect(current.name).toEqual(expected.name)
            expect(current.skills).toEqual(expected.skills)
        })

        it("restores state with chips", () => {
            const expected: Bag = {
                items: ["item", "item2"]
            }

            const state: FormState<Bag> = {
                items: { visited: false, active: false, value: ["item", "item2"] }
            }
            const current = (toResult(bagChipsSchema, state) as any).value
            expect(current).toEqual(expected)
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

            const current = (toResult(bagListSchema, state) as any).value
            expect(current).toEqual(expected)
        })

        it("restores state with nested collection", () => {
            const expected: User2 = {
                name: "User",
                skills: [
                    { name: "datomic", level: 1, tags: [{ name: "db" }] },
                    { name: "react", level: 10, tags: [{ name: "tech" }, { name: "FE" }] }
                ]
            }

            const state: FormState<User2> = {
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

            const current: User2 = (toResult(userSchema2, state) as any).value

            expect(current.name).toEqual(expected.name)
            expect(current.skills).toEqual(expected.skills)
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
            expect(validateForm(bagChipsSchema, state)).toEqual(expectedState)
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
            expect(validateForm(bagListSchema, state)).toEqual(expectedState)
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
            expect(validateForm(userSchema, state)).toEqual(expectedState)
        })
    })
    // tslint:disable-next-line:max-file-line-count
})
