const energielevel = document.getElementById("energielevel")
const leefstijl = document.getElementById("leefstijl")
const grootte = document.getElementById("grootte")
const slaapritme = document.getElementById("slaapritme")
const nextButton = document.getElementById("nextButton")

const dropdowns = document.querySelectorAll("select") // Selectie van alle dropdown-elementen
let allDropdownsSelected = false // Variabele om bij te houden of alle dropdowns zijn geselecteerd

const updateButton = () => {
    allDropdownsSelected = true // Stel de variabele allDropdownsSelected in op true

    dropdowns.forEach((dropdown) => {
        if (dropdown.value === "--") {
            allDropdownsSelected = false // Als een dropdown de waarde "--" heeft, stel allDropdownsSelected in op false
        }
    })

    nextButton.classList.toggle("selected", allDropdownsSelected) // Achtergrondkleur wordt gewijzigd op basis van de selectiestatus
}

dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("change", updateButton) // Luistert naar wijzigingen in de dropdowns en roept de updateButton-functie aan
})

nextButton.addEventListener("click", (event) => {
    if (!allDropdownsSelected) {
        event.preventDefault() // zodat het formulier niet wordt verzonden wanneer niet alles geselecteerd is
        alert("Niet alle onderdelen zijn geselecteerd.") // Geeft een waarschuwing weer aan de gebruiker
    }
})

const updateText = () => {
    const styleText1 = document.getElementById("styleText1")
    const styleText2 = document.getElementById("styleText2")
    const styleText3 = document.getElementById("styleText3")
    const styleText4 = document.getElementById("styleText4")

    styleText1.innerHTML = energielevel.value !== "--" ? "checked" : "" // Bijwerken van de innerHTML van styleText1 op basis van de geselecteerde waarde in energielevel
    styleText2.innerHTML = leefstijl.value !== "--" ? "checked" : ""
    styleText3.innerHTML = grootte.value !== "--" ? "checked" : ""
    styleText4.innerHTML = slaapritme.value !== "--" ? "checked" : ""
}
energielevel.addEventListener("change", updateText) // Luistert naar wijzigingen in energielevel en roept de updateText-functie aan
leefstijl.addEventListener("change", updateText)
grootte.addEventListener("change", updateText)
slaapritme.addEventListener("change", updateText)

// Controleer of JavaScript is ingeschakeld
document.addEventListener("DOMContentLoaded", () => {
    const enhancement = document.getElementById("enhancement") // Verwijzing naar het enhancement-element
    enhancement.style.display = "none" // Verbergt het enhancement-element
})
