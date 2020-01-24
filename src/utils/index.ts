export const _noop = (): any => undefined
export const _anything: any = {}
export const createDiv = (id: string) => {
    const d = document.createElement("div")
    document.body.appendChild(d)
    d.setAttribute("id", id)
    return d
}
