const adminAanpassen = document.querySelector("#admin-aanpassen"),
    allPs = adminAanpassen.querySelectorAll("section p.visually-hidden")
allPs.forEach((e) => {
    console.log(e.textContent),
        (e = e.textContent.replace("It is ", "").toLowerCase()),
        (e = adminAanpassen.querySelector(`fieldset input[value=${e}]`)) && (e.checked = !0)
})
