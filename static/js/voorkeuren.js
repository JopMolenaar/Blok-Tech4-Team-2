const energielevel = document.getElementById("energielevel")
const leefstijl = document.getElementById("leefstijl")
const grootte = document.getElementById("grootte")
const slaapritme = document.getElementById("slaapritme")
const nextButton = document.getElementById("nextButton")

const dropdowns = document.querySelectorAll("select")
let allDropdownsSelected = false // Variabele om bij te houden of alle dropdowns zijn geselecteerd

const updateButton = () => {
	allDropdownsSelected = true

	dropdowns.forEach((dropdown) => {
		if (dropdown.value === "--") {
			allDropdownsSelected = false
		}
	})

	nextButton.classList.toggle("selected", allDropdownsSelected)
}

dropdowns.forEach((dropdown) => {
	dropdown.addEventListener("change", updateButton) // Luistert naar wijzigingen in de dropdowns en roept de updateButton-functie aan
})

nextButton.addEventListener("click", (event) => {
	if (!allDropdownsSelected) {
		event.preventDefault()
		alert("Niet alle onderdelen zijn geselecteerd.")
	}
})

const updateText = () => {
	const styleText1 = document.getElementById("styleText1")
	const styleText2 = document.getElementById("styleText2")
	const styleText3 = document.getElementById("styleText3")
	const styleText4 = document.getElementById("styleText4")

	styleText1.innerHTML = energielevel.value !== "--" ? "checked" : ""
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
	const enhancement = document.getElementById("enhancement")
	enhancement.style.display = "none"
})