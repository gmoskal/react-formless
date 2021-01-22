## Version 1.1.14

1. `subtype` field introduced for `custom input`:
```ts
import { plainHtmlRenderMap, InputBoxRenderFn, FormView, useFormHook } from "@react-formless/core"

type Item = { date: string }

const schema: FormSchema<Item> = { date: { type: "customBox", subtype: "date" } }

const CustomBoxRenderer: InputBoxRenderFn = p => {
    if (p.schema.subtype === "date")
        return <DatePicker {...p} /> // some date picker comp.
	return <h1>Implement me</h1>
}

const Form = () =>  {
  const { formViewProps, handleSubmit } = useFormHook<Item>({ schema })
  return (
    <form>
	    <FormView
		    {...formViewProps}
		    inputsRenderMap={{...plainHtmlRenderMap, customBox: CustomBoxRenderer }}
	    />
      <button onClick={handleSubmit}>Save</button>
    </form>
  )
}
```

2. `creatable` field introduced for `multiselect`, check out [the example](packages/examples/src/multiselect/MultiselectForm.tsx)
