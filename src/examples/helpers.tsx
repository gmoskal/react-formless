export const selectCreateDiv = (id: string) => {
    let d: any = document.getElementById(id)
    if (d) return d
    d = document.createElement("div")
    document.body.appendChild(d)
    d.setAttribute("id", id)
    return d
}
