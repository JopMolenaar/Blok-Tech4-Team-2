const allButtons = document.querySelectorAll("#button")
const formButtons = document.querySelectorAll("#input[type=\"submit\"]")

allButtons.forEach((button) => {
	button.addEventListener("click", () => {
		this.classList.toggle("buttonPrimary:active")
	})
})

formButtons.forEach((formButton) => {
	formButton.addEventListener("click", () => {
		this.classList.toggle("submitButton:active")
	})
})
