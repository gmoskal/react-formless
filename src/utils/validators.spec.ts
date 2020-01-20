import {
    Err,
    Ok,
    optional,
    runValidators,
    validateArray,
    errors,
    validStringDef,
    validString,
    validateString,
    validateNumber,
    isEmail,
    validateMinLength,
    validateAZ,
    validateUppercasePresent,
    validateLowercasePresent,
    validateNumberPresent,
    validateHexColor
} from "./validators"

describe("Validators", () => {
    const genericFalseValidator: Validator<any> = o => Err("Invalid", o)
    const genericTrueValidator: Validator<any> = o => Ok(o)

    describe("optional", () => {
        it("validates ok value when is defined", () => {
            const value = "something"
            const validators = [optional(genericTrueValidator)]
            const spy = jest.fn()
            runValidators(validators, value, spy)
            expect(spy).not.toBeCalled()
        })

        it("validates err value when is defined", () => {
            const value = "something"
            const validators = [optional(genericFalseValidator)]
            const spy = jest.fn()
            runValidators(validators, value, spy)
            expect(spy).toBeCalled()
        })

        it("skips validation when value is undefined and returns ok", () => {
            const validators = [optional(genericFalseValidator)]
            const spy = jest.fn()
            runValidators(validators, undefined, spy)
            expect(spy).not.toBeCalled()
        })
    })

    describe("validateArray", () => {
        it("validates ok values", () => {
            const values = ["a", "b"]
            const validators = [validateArray([genericTrueValidator])]
            const spy = jest.fn()
            runValidators(validators, values, spy)
            expect(spy).not.toBeCalled()
        })

        it("validates err values", () => {
            const values = ["a", "b"]
            const validators = [validateArray([genericFalseValidator])]
            const spy = jest.fn()
            runValidators(validators, values, spy)
            expect(spy.mock.calls[0][0].split(";").length).toEqual(2)
        })

        it("complains when object passed is not array", () => {
            const values = 5
            const validators = [validateArray([genericTrueValidator])]
            const spy = jest.fn()
            runValidators(validators, values, spy)
            expect(spy.mock.calls[0][0]).toEqual(errors.notArrayType)
        })
    })

    describe("run validators", () => {
        it("returns valid value", () => {
            const validators = validString
            const spy = jest.fn()
            const actual = runValidators(validators, "string", spy)
            expect(actual).toEqual("string")
            expect(spy).not.toBeCalled()
        })

        it("returns default value", () => {
            const validators = validStringDef
            const spy = jest.fn()
            const actual = runValidators(validators, undefined, spy)
            expect(actual).toEqual("")
            expect(spy).not.toBeCalled()
        })

        it("calls error callback when invalid value", () => {
            const validators = validString
            const spy = jest.fn()
            const actual = runValidators(validators, 5, spy)
            expect(actual).toEqual(5)
            expect(spy).toBeCalled()
        })

        it("calls error callback when invalid value after second validator", () => {
            const validators = [validateString, validateNumber]
            const spy = jest.fn()
            const actual = runValidators(validators, "string", spy)
            expect(actual).toEqual("string")
            expect(spy).toBeCalled()
        })
    })
    describe("basic validators", () => {
        it("dectcs valid emails", () => {
            expect(isEmail("foo@bar.co")).toBeTruthy()
            expect(isEmail("foo@bar.co.uk")).toBeTruthy()
            expect(isEmail("bar+foo@bar.co")).toBeTruthy()
        })

        it("dectcs invalid emails", () => {
            expect(isEmail("foo")).toBeFalsy()
            expect(isEmail("@bar.co.uk")).toBeFalsy()
            expect(isEmail("bar+foo@bar")).toBeFalsy()
        })
        it("checks min length", () => {
            const v = validateMinLength(5)
            expect(v("foo").type).toEqual("Err")
            expect(v("foobar").type).toEqual("Ok")
        })
        it("validates alphabethical caracters", () => {
            expect(validateAZ("asdf").type).toEqual("Ok")
            expect(validateAZ("as_df").type).toEqual("Ok")
            expect(validateAZ("as-df").type).toEqual("Ok")
            expect(validateAZ("asdf1").type).toEqual("Err")
            expect(validateAZ("@asdf").type).toEqual("Err")
        })
        it("validates uppercase present in word", () => {
            expect(validateUppercasePresent("asdf").type).toEqual("Err")
            expect(validateUppercasePresent("Asdf").type).toEqual("Ok")
            expect(validateUppercasePresent("aSDf").type).toEqual("Ok")
            expect(validateUppercasePresent("asdF").type).toEqual("Ok")
        })
        it("validates lowercase present in word", () => {
            expect(validateLowercasePresent("asdf").type).toEqual("Ok")
            expect(validateLowercasePresent("ASDF").type).toEqual("Err")
        })

        it("validates number present in word", () => {
            expect(validateNumberPresent("asdf").type).toEqual("Err")
            expect(validateNumberPresent("AS1F").type).toEqual("Ok")
            expect(validateNumberPresent("1ASdF").type).toEqual("Ok")
            expect(validateNumberPresent("ASdF1").type).toEqual("Ok")
        })

        it("validates hex color", () => {
            expect(validateHexColor("#ffg").type).toEqual("Err")
            expect(validateHexColor("#ff00gf").type).toEqual("Err")

            expect(validateHexColor("#ff").type).toEqual("Err")
            expect(validateHexColor("#ffee").type).toEqual("Err")
            expect(validateHexColor("#ffeee").type).toEqual("Err")
            expect(validateHexColor("#ff00ffg").type).toEqual("Err")

            expect(validateHexColor(" #ff00ffg").type).toEqual("Err")
            expect(validateHexColor("#ff00ffg ").type).toEqual("Err")

            expect(validateHexColor("#000").type).toEqual("Ok")
            expect(validateHexColor("#fff").type).toEqual("Ok")
            expect(validateHexColor("#aaffcc").type).toEqual("Ok")
        })
    })
})
