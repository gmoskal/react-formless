import {
    keys,
    iterateMap,
    copyDefinedFields,
    toMap,
    values,
    remap,
    toArray,
    filterObject,
    mapObject,
    joinArrays,
    flatten,
    isKeyOf,
    replace,
    arrify,
    matchOnValue,
    pickObject,
    omitObject,
    relativeComplement
} from "./map"

describe("Map utils", () => {
    describe("mapObject()", () => {
        it("gives empty object if no object is given", () => {
            expect(mapObject(null, p => p)).toEqual({})
            expect(mapObject({}, p => p)).toEqual({})
        })

        it("gives same object when p => p is given as cb ", () =>
            expect(mapObject({ foo: "foo" }, p => p)).toEqual({ foo: "foo" }))

        it("gives maped object when p => 1  is given as cb ", () =>
            expect(mapObject({ foo: "foo" }, () => 1)).toEqual({ foo: 1 }))

        it("gives maped object ", () =>
            expect(mapObject({ foo: "foo", bar: "bar" }, key => (key === "foo" ? 1 : 0))).toEqual({ foo: 1, bar: 0 }))
    })

    describe("keys()", () => {
        it("gives empty array if no object is given", () => {
            expect(keys(null)).toEqual([])
            expect(keys({})).toEqual([])
            expect(keys(1)).toEqual([])
        })

        it("gives array of keys", () => {
            expect(keys({ a: "foo" })).toEqual(["a"])
            expect(keys({ a: "foo", b: 1 })).toEqual(["a", "b"])
        })
    })

    describe("values()", () => {
        it("gives empty array if no object is given", () => {
            expect(values(null as any)).toEqual([])
            expect(values({})).toEqual([])
            expect(values(1 as any)).toEqual([])
        })

        it("gives array of values", () => {
            expect(values({ a: "foo" })).toEqual(["foo"])
            expect(values({ a: "foo", b: 1 })).toEqual(["foo", 1])
        })
    })

    describe("iterateMap()", () => {
        it("iterates nothing when empty object is given", () => {
            const result: string[] = []
            iterateMap(null as any, (key: string) => result.push(key))
            expect(result).toEqual([])
            iterateMap({}, key => result.push(key))
            expect(result).toEqual([])
        })
        it("iterates all keys and values", () => {
            const abc = { a: 1, b: "2", c: true }
            const result: any = {} as any
            iterateMap(abc, (key, value) => (result[key] = value))
            expect(result).toEqual(abc)
        })
    })

    describe("filterObject()", () => {
        it("filters object", () => {
            expect(filterObject({ a: "A", b: "B" }, k => k !== "a")).toEqual({ b: "B" })
            expect(filterObject({ a: "A", b: "B" }, k => k !== "b")).toEqual({ a: "A" })
            expect(filterObject({ a: "A", b: "B" }, k => k !== "c")).toEqual({ a: "A", b: "B" })
        })
    })

    describe("copyDefinedFields()", () => {
        it("gives empty object if keys object is empty", () => expect(copyDefinedFields({}, { a: 1 })).toEqual({}))
        it("gives object with one src value if keys object has only one key", () =>
            expect(copyDefinedFields({ a: 1 }, { a: "1", b: "2" })).toEqual({ a: "1" }))
        it("uses delta ", () =>
            expect(copyDefinedFields({ a: 1, b: 1 }, { a: "1", b: "2" }, { b: "3" })).toEqual({ a: "1", b: "3" }))
    })

    describe("remap()", () => {
        it("remaps empty object", () =>
            expect(
                remap(
                    { a: 1, b: 2 },
                    k => k,
                    v => v.toString()
                )
            ).toEqual({ a: "1", b: "2" }))
        it("remaps empty object", () =>
            expect(
                remap(
                    { a: 1, b: 2 },
                    k => k,
                    (_, k) => k
                )
            ).toEqual({ a: "a", b: "b" }))
        it("remaps empty object and keeps null values by default", () =>
            expect(
                remap(
                    { a: 1, b: 2 },
                    k => k,
                    (_, k) => (k === "b" ? null : k)
                )
            ).toEqual({ a: "a", b: null }))
        it("remaps empty object and skips null", () =>
            expect(
                remap(
                    { a: 1, b: 2 },
                    k => k,
                    (_, k) => (k === "b" ? null : k),
                    true
                )
            ).toEqual({ a: "a" }))
    })

    describe("toMap()", () => {
        it("returns empty map when empty array is given", () =>
            expect(
                toMap(
                    [],
                    _ => "foo",
                    v => v
                )
            ).toEqual({}))

        it("returns valid map for array with one element", () =>
            expect(
                toMap(
                    [{ a: "foo" }],
                    _ => _.a,
                    v => v
                )
            ).toEqual({ foo: { a: "foo" } }))

        it("returns valid map for array with two elements", () =>
            expect(
                toMap(
                    [{ a: "foo" }, { a: "bar" }],
                    _ => _.a,
                    v => v.a
                )
            ).toEqual({ foo: "foo", bar: "bar" }))

        it("skips null keys if options is present", () =>
            expect(
                toMap(
                    [{ a: "foo" }, { a: "bar" }],
                    k => (k.a === "foo" ? null : k.a),
                    v => v.a,
                    { skipNullKeys: true }
                )
            ).toEqual({
                bar: "bar"
            }))

        it("skips null values if options is present", () =>
            expect(
                toMap(
                    [{ a: "foo" }, { a: "bar" }],
                    k => k.a,
                    v => (v.a === "foo" ? null : v.a),
                    {
                        skipNullValues: true
                    }
                )
            ).toEqual({
                bar: "bar"
            }))
    })
    describe("toArray()", () => {
        it("returns empty array when empty object is given", () => expect(toArray({}, _ => "foo")).toEqual([]))

        it("returns valid array for an object with one element", () =>
            expect(toArray({ a: "foo", b: "bar" }, v => v)).toEqual(["foo", "bar"]))
    })

    describe("arrays joinArrays()", () => {
        it("success when two arrays are equals", () => {
            expect(joinArrays([1], [2], (a, b) => a === b)).toEqual([1, 2])
            expect(joinArrays([1, 2], [2], (a, b) => a === b)).toEqual([1, 2])
            expect(joinArrays([1], [1, 2], (a, b) => a === b)).toEqual([1, 2])
            expect(joinArrays([1], [], (a, b) => a === b)).toEqual([1])
            expect(joinArrays([], [1], (a, b) => a === b)).toEqual([1])
            expect(joinArrays([1, 2], [2, 3], (a, b) => a === b)).toEqual([1, 2, 3])
        })
    })

    describe("flatten()", () => {
        it("keeps flat array flatten", () => expect(flatten([1, 2])).toEqual([1, 2]))
        it("flats nested array", () => expect(flatten([1, [2]])).toEqual([1, 2]))
        it("flats nested array of nested arrays", () => expect(flatten([1, [2, [3]]], 2)).toEqual([1, 2, 3]))
        it("keeps flat array flatten with filter", () => expect(flatten([1, 2, 3], 1, v => v !== 1)).toEqual([2, 3]))
        it("flats nested array with filter", () => expect(flatten([1, [2], 3], 2, v => v !== 2)).toEqual([1, 3]))
    })

    describe("isKeyof", () => {
        it("detects valid keys", () => {
            expect(isKeyOf("foo", { foo: 1 })).toBeTruthy()
            expect(isKeyOf("bar", { foo: 1, bar: 2 })).toBeTruthy()
        })

        it("detects invalid keys", () => {
            expect(isKeyOf("foo", { bar: 1 })).toBeFalsy()
            expect(isKeyOf("bar", {})).toBeFalsy()
        })
    })

    describe("pickObject()", () => {
        const o = { foo: "bar", baz: "qux" }
        it("returns empty object when passed empty array", () => expect(pickObject(o, [])).toEqual({}))
        it("returns cut object with keys passed as an argument", () =>
            expect(pickObject(o, ["foo"])).toEqual({ foo: "bar" }))
        it("returns copied object with keys equal to object keys", () =>
            expect(pickObject(o, ["foo", "baz"])).toEqual(o))
    })

    describe("omitObject()", () => {
        const o = { foo: "bar", baz: "qux" }
        it("returns full object when passed empty array", () => expect(omitObject(o, [])).toEqual(o))
        it("returns cut object without keys passed as an argument", () =>
            expect(omitObject(o, ["foo"])).toEqual({ baz: "qux" }))
        it("returns empty object when all keys passed in argument", () =>
            expect(omitObject(o, ["foo", "baz"])).toEqual({}))
    })

    describe("replace()", () => {
        it("gives same array for invalid index", () => {
            expect(replace([], 0, 1)).toEqual([])
            expect(replace([], -1, 1)).toEqual([])
            expect(replace([1], 1, 1)).toEqual([1])
        })

        it("replaces first element", () => {
            expect(replace([1], 0, 3)).toEqual([3])
            expect(replace([1, 2], 0, 3)).toEqual([3, 2])
            expect(replace([1, 2, 3], 0, 3)).toEqual([3, 2, 3])
        })
        it("replaces last element", () => {
            expect(replace([1, 2], 1, 3)).toEqual([1, 3])
            expect(replace([1, 2, 3], 2, 4)).toEqual([1, 2, 4])
        })

        it("replaces middle element", () => expect(replace([1, 2, 3], 1, 4)).toEqual([1, 4, 3]))
    })

    describe("arrify()", () => {
        it("arrifies an element when was not arrified yet", () => expect(arrify(1)).toEqual([1]))
        it("keeps array not changed if was already arrified", () => expect(arrify([1])).toEqual([1]))
    })

    describe("matchOnValue()", () => {
        it("gets element if is present in colleciton", () =>
            expect(matchOnValue("a")({ "1st": { a: "foo" }, "2nd": { a: "bar" } }, "bar")).toEqual({ a: "bar" }))

        it("gets null if element is not present in colleciton", () =>
            expect(matchOnValue("a")({ "1st": { a: "foo" }, "2nd": { a: "bar" } }, "x")).toEqual(null))
    })
    describe("relativeComplement()", () => {
        it("returns empty list if A=B", () => expect(relativeComplement([1, 2, 3], [1, 2, 3])).toEqual([]))
        it("returns empty list if B includes A", () => expect(relativeComplement([1, 2, 3], [1, 2, 3, 4])).toEqual([]))
        it("returns only elements missing from A", () => expect(relativeComplement([1, 2, 3], [1, 2])).toEqual([3]))
    })
})
