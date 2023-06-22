// Populate form fields with data
const populateForm = (formData) => {
	const inputs = document.querySelectorAll("#adminForm input")
	inputs.forEach((input) => {
		input.value = formData[input.name] || ""
	})
}
  
// Retrieve form data from localStorage if available
const storedFormData = localStorage.getItem("adminFormData")
if (storedFormData) {
	const formData = JSON.parse(storedFormData)
	populateForm(formData)
}
  
// Add submit event listener to the form
const form = document.getElementById("adminForm")
form.addEventListener("submit", (e) => {
	e.preventDefault() // Prevent form submission
  
	// Get form data
	const formData = getFormData()
  
	// Store form data in localStorage
	localStorage.setItem("adminFormData", JSON.stringify(formData))
  
	// Submit the form
	form.submit()
})
  
// Get form data as an object
const getFormData = () => {
	const formData = {}
	const inputs = document.querySelectorAll("#adminForm input")
	inputs.forEach((input) => {
		formData[input.name] = input.value
	})
	return formData
}
  