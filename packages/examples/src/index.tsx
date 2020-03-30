import * as React from "react"
import { render } from "react-dom"
import { Switch, Route, BrowserRouter, Link } from "react-router-dom"

import { mapOn } from "@react-formless/utils"

import { InputSelectForm } from "./select/InputSelect"
import { InputListForm } from "./list/InputList"
import { InputRadioForm } from "./radio/InputRadio"
import { InputCollectionForm } from "./collection/InputCollection"
import { InputsForms } from "./basic/Inputs"
import { CustomRenderersForm } from "./custom-renderers"
import { Validation } from "./validation/Validation"
import { LayoutForm } from "./layout/Layouts"

const paths = {
    "/basic-inputs": InputsForms,
    "/select": InputSelectForm,
    "/list": InputListForm,
    "/radio": InputRadioForm,
    "/collection": InputCollectionForm,
    "/layout": LayoutForm,
    "/custom-renderers": CustomRenderersForm,
    "/validation": Validation
}

const Main = () => (
    <>
        <h2>Select form type demo</h2>
        {mapOn(paths, path => (
            <Link key={path} to={path}>
                <h3>{path.replace("/", "").toUpperCase()}</h3>
            </Link>
        ))}
    </>
)

render(
    <BrowserRouter>
        <Switch>
            {mapOn(paths, (path, C) => (
                <Route key={path} path={path} component={C} />
            ))}
            <Route path="/" component={Main} />
        </Switch>
    </BrowserRouter>,
    document.getElementById("root")
)
