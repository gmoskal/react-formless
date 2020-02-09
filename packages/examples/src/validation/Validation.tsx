import * as React from "react"
import { FormView, useFormHook, FormSchema } from "@react-formless/core"
import {
    validateNotEmpty,
    validateNumberPresent,
    validateLowercasePresent,
    validateUppercasePresent,
    validateMinLength
} from "@react-formless/utils/validators"

type Credentials = { usernamename: string; password: string }

const schema: FormSchema<Credentials> = {
    usernamename: { type: "text", placeholder: "Username", validators: [validateNotEmpty] },
    password: {
        type: "password",
        placeholder: "Password",
        validators: [
            validateNotEmpty,
            validateNumberPresent,
            validateUppercasePresent,
            validateLowercasePresent,
            validateMinLength(8)
        ]
    }
}

export const Validation: React.FC = () => {
    const onSubmit = React.useCallback((result: Credentials) => {
        alert(JSON.stringify(result, null, 2))
    }, [])

    const { formViewProps, handleSubmit } = useFormHook({ schema, onSubmit })

    return (
        <form onSubmit={handleSubmit} noValidate>
            <FormView {...formViewProps} />
            <button type="submit">Submit</button>
        </form>
    )
}
