const populateForm = (o) => {
        document.querySelectorAll("#loginForm input").forEach((t) => {
            t.value = o[t.name] || ""
        })
    },
    storedFormData = localStorage.getItem("loginFormData")
if (storedFormData) {
    const c = JSON.parse(storedFormData)
    populateForm(c)
}
const form = document.getElementById("loginForm"),
    getFormData =
        (form.addEventListener("submit", (t) => {
            t.preventDefault(), (t = getFormData()), localStorage.setItem("loginFormData", JSON.stringify(t)), form.submit()
        }),
        () => {
            const o = {}
            return (
                document.querySelectorAll("#loginForm input").forEach((t) => {
                    o[t.name] = t.value
                }),
                o
            )
        })
