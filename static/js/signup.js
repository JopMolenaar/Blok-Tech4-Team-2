const populateForm = (e) => {
        document.querySelectorAll("#signupForm input").forEach((t) => {
            t.value = e[t.name] || ""
        })
    },
    storedFormData = localStorage.getItem("signupFormData")
if (storedFormData) {
    const c = JSON.parse(storedFormData)
    populateForm(c)
}
const form = document.getElementById("signupForm"),
    getFormData =
        (form.addEventListener("submit", (t) => {
            t.preventDefault(), (t = getFormData()), localStorage.setItem("signupFormData", JSON.stringify(t)), form.submit()
        }),
        () => {
            const e = {}
            return (
                document.querySelectorAll("#signupForm input").forEach((t) => {
                    e[t.name] = t.value
                }),
                e
            )
        })
