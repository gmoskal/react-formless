import * as React from "react"
import { render } from "react-dom"
import { Switch, Route, BrowserRouter } from "react-router-dom"
import { LoginForm } from "./loginForm"
import { selectCreateDiv } from "./helpers"
import { _noop } from "../utils"
import { RadioForm } from "./Radio"
import { BasicInputsForms } from "./BasicInputs"

render(
    <BrowserRouter>
        <Switch>
            <Route path="/radio" component={RadioForm} />
            <Route path="/basic-inputs" component={BasicInputsForms} />
            <Route path="/" component={LoginForm} exact />
        </Switch>
    </BrowserRouter>,
    selectCreateDiv("app")
)
