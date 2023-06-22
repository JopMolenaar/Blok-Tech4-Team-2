const populateForm = (e) => {
        document.querySelectorAll("#adminForm input").forEach((t) => {
            t.value = e[t.name] || ""
        })
    },
    storedFormData = localStorage.getItem("adminFormData")
if (storedFormData) {
    const d = JSON.parse(storedFormData)
    populateForm(d)
}
const form = document.getElementById("adminForm"),
    getFormData =
        (form.addEventListener("submit", (t) => {
            t.preventDefault()
            t = getFormData()
            localStorage.setItem("adminFormData", JSON.stringify(t)), form.submit()
        }),
        () => {
            const e = {}
            return (
                document.querySelectorAll("#adminForm input").forEach((t) => {
                    e[t.name] = t.value
                }),
                e
            )
        })
