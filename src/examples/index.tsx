import * as React from "react"
import { render } from "react-dom"
import { Switch, Route, BrowserRouter } from "react-router-dom"
import { InputSelectForm } from "./InputSelect"
import { InputRadioForm } from "./InputRadio"
import { InputsForms } from "./Inputs"

export const createDiv = (id: string) => {
    const d = document.createElement("div")
    document.body.appendChild(d)
    d.setAttribute("id", id)
    return d
}

render(
    <BrowserRouter>
        <Switch>
            <Route path="/select" component={InputSelectForm} />
            <Route path="/radio" component={InputRadioForm} />
            <Route path="/inputs" component={InputsForms} />
            <Route path="/" component={InputsForms} exact />
        </Switch>
    </BrowserRouter>,
    createDiv("app")
)
