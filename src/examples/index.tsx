import * as React from "react"
import { render } from "react-dom"
import { Switch, Route, BrowserRouter } from "react-router-dom"
import { LoginForm } from "./loginForm"
import { selectCreateDiv } from "./helpers"
import { _noop } from "../utils"
import { InfoForm } from "./infoForm"

render(
    <BrowserRouter>
        <Switch>
            <Route path="/" component={InfoForm} />
            <Route path="/" component={LoginForm} exact />
        </Switch>
    </BrowserRouter>,
    selectCreateDiv("app")
)
