import * as React from "react"
import { render } from "react-dom"
import { Switch, Route, BrowserRouter, Link } from "react-router-dom"

import { mapOn } from "../utils/map"
import { createDiv } from "../utils"
import { InputSelectForm } from "./InputSelect"
import { InputRadioForm } from "./InputRadio"
import { InputsForms } from "./Inputs"
import { InputCollectionForm } from "./InputCollection"

const paths = {
    "/inputs": InputsForms,
    "/radio": InputRadioForm,
    "/select": InputSelectForm,
    "/collection": InputCollectionForm
}

const Main = () => (
    <>
        <h2>Select form demo</h2>
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
            <Route path="/" component={Main} exact />
            {mapOn(paths, (path, C) => (
                <Route key={path} path={path} component={C} exact />
            ))}
        </Switch>
    </BrowserRouter>,
    createDiv("app")
)
