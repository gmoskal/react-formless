import * as React from "react"
import { render } from "react-dom"
import { Switch, Route, BrowserRouter as Router } from "react-router-dom"
import { LoginForm, LoginFormProps } from "./loginForm"
import { selectCreateDiv } from "./helpers"
import { _noop } from "../utils"

const loginFormProps: LoginFormProps = { initialValue: { email: "", password: "" }, onSubmit: _noop }

render(
    <Router>
        <Switch>
            <Route path="/" component={() => <LoginForm {...loginFormProps} />} exact />
        </Switch>
    </Router>,
    selectCreateDiv("app")
)
