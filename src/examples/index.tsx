import * as React from "react"
import { render } from "react-dom"
import { Switch, Route, BrowserRouter as Router } from "react-router-dom"
import { LoginForm } from "./loginForm"

const selectCreateDiv = (id: string) => {
    let d: any = document.getElementById(id)
    if (d) return d
    d = document.createElement("div")
    document.body.appendChild(d)
    d.setAttribute("id", id)
    return d
}

render(
    <Router>
        <Switch>
            <Route
                path="/"
                component={() => <LoginForm initialValue={{ password: "", email: "" }} onSubmit={console.log} />}
                exact
            />
        </Switch>
    </Router>,
    selectCreateDiv("app")
)
