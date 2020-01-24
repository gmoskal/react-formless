import * as React from "react"
import { render } from "react-dom"
import { Switch, Route, BrowserRouter, Link } from "react-router-dom"
import { InputSelectForm } from "./InputSelect"
import { InputRadioForm } from "./InputRadio"
import { InputsForms } from "./Inputs"
import { keys } from "../utils/map"

export const createDiv = (id: string) => {
    const d = document.createElement("div")
    document.body.appendChild(d)
    d.setAttribute("id", id)
    return d
}

const paths: Dict<string, React.FC> = {
    "/inputs": InputSelectForm,
    "/radio": InputRadioForm,
    "/select": InputsForms
}

const Main = () => (
    <>
        {keys(paths).map(path => (
            <p>
                <Link key={path} to={path}>
                    {path}
                </Link>
            </p>
        ))}
    </>
)

render(
    <BrowserRouter>
        <Switch>
            {keys(paths).map(path => (
                <Route key={path} path={path} component={paths[path]} />
            ))}
            <Route path="/" component={Main} exact />
        </Switch>
    </BrowserRouter>,
    createDiv("app")
)
