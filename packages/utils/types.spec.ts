import { mkJust, mkNothing, equal, mkFetched, isFetched, mkNotFetched, mkFetching, mkFetchError } from "./types"

describe("Common types", () => {
    describe("Maybe<T>", () => {
        it("create Just value", () => expect(mkJust("foo")).toEqual({ type: "Just", value: "foo" }))
        it("create Nothing value", () => expect(mkNothing()).toEqual({ type: "Nothing" }))
        it("recognizes same objects", () => expect(equal(mkJust("foo"), mkJust("foo"))).toEqual(true))
        it("recognizes different objects", () => {
            expect(equal(mkJust("foo"), mkJust("bar"))).toEqual(false)
            expect(equal(mkJust("foo"), mkNothing())).toEqual(false)
        })
    })
    describe("Async<T>", () => {
        it("Creates Fetched", () => expect(mkFetched("foo")).toEqual({ type: "Fetched", value: "foo" }))
        it("Creates NotFetched", () => expect(mkNotFetched()).toEqual({ type: "NotFetched" }))
        it("Creates Fetching", () => expect(mkFetching()).toEqual({ type: "Fetching" }))
        it("Creates FetchingError", () => expect(mkFetchError("error")).toEqual({ type: "FetchError", value: "error" }))
    })
    describe("isFetched()", () => {
        it("returns false for NotFetched", () => expect(isFetched(mkNotFetched())).toBe(false))
        it("returns false for Fetching", () => expect(isFetched(mkFetching())).toBe(false))
        it("returns false for FetchError", () => expect(isFetched(mkFetchError("error"))).toBe(true))
        it("returns true for Fetched", () => expect(isFetched(mkFetched(null))).toBe(true))
    })
})
