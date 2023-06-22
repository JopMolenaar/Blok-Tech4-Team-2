//this function checkes the already active options for the product when an admin wants to change something.

const adminAanpassen = document.querySelector("#admin-aanpassen")
const allPs = adminAanpassen.querySelectorAll("section p.visually-hidden")

allPs.forEach((p) => {
	console.log(p.textContent)
	p = p.textContent.replace("It is ", "").toLowerCase()
	const checkThisOne = adminAanpassen.querySelector(`fieldset input[value=${p}]`)
	if (checkThisOne) checkThisOne.checked = true
})
