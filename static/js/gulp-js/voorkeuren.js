const energielevel = document.getElementById("energielevel"),
    leefstijl = document.getElementById("leefstijl"),
    grootte = document.getElementById("grootte"),
    slaapritme = document.getElementById("slaapritme"),
    nextButton = document.getElementById("nextButton"),
    dropdowns = document.querySelectorAll("select")
let allDropdownsSelected = !1
function updateButton() {
    ;(allDropdownsSelected = !0),
        dropdowns.forEach((e) => {
            "--" === e.value && (allDropdownsSelected = !1)
        }),
        nextButton.classList.toggle("selected", allDropdownsSelected)
}
function updateText() {
    var e = document.getElementById("styleText1"),
        t = document.getElementById("styleText2"),
        n = document.getElementById("styleText3"),
        l = document.getElementById("styleText4")
    ;(e.innerHTML = "--" !== energielevel.value ? "checked" : ""),
        (t.innerHTML = "--" !== leefstijl.value ? "checked" : ""),
        (n.innerHTML = "--" !== grootte.value ? "checked" : ""),
        (l.innerHTML = "--" !== slaapritme.value ? "checked" : "")
}
dropdowns.forEach((e) => {
    e.addEventListener("change", updateButton)
}),
    nextButton.addEventListener("click", (e) => {
        allDropdownsSelected || (e.preventDefault(), alert("Niet alle onderdelen zijn geselecteerd."))
    }),
    energielevel.addEventListener("change", updateText),
    leefstijl.addEventListener("change", updateText),
    grootte.addEventListener("change", updateText),
    slaapritme.addEventListener("change", updateText),
    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("enhancement").style.display = "none"
    })
const energielevel = document.getElementById("energielevel"),
    leefstijl = document.getElementById("leefstijl"),
    grootte = document.getElementById("grootte"),
    slaapritme = document.getElementById("slaapritme"),
    nextButton = document.getElementById("nextButton"),
    dropdowns = document.querySelectorAll("select")
let allDropdownsSelected = !1
const updateButton = () => {
        ;(allDropdownsSelected = !0),
            dropdowns.forEach((e) => {
                "--" === e.value && (allDropdownsSelected = !1)
            }),
            nextButton.classList.toggle("selected", allDropdownsSelected)
    },
    updateText =
        (dropdowns.forEach((e) => {
            e.addEventListener("change", updateButton)
        }),
        nextButton.addEventListener("click", (e) => {
            allDropdownsSelected || (e.preventDefault(), alert("Niet alle onderdelen zijn geselecteerd."))
        }),
        () => {
            var e = document.getElementById("styleText1"),
                t = document.getElementById("styleText2"),
                n = document.getElementById("styleText3"),
                l = document.getElementById("styleText4")
            ;(e.innerHTML = "--" !== energielevel.value ? "checked" : ""),
                (t.innerHTML = "--" !== leefstijl.value ? "checked" : ""),
                (n.innerHTML = "--" !== grootte.value ? "checked" : ""),
                (l.innerHTML = "--" !== slaapritme.value ? "checked" : "")
        })
energielevel.addEventListener("change", updateText),
    leefstijl.addEventListener("change", updateText),
    grootte.addEventListener("change", updateText),
    slaapritme.addEventListener("change", updateText),
    document.addEventListener("DOMContentLoaded", () => {
        document.getElementById("enhancement").style.display = "none"
    })
