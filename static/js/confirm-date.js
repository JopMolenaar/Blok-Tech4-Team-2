const getDateInput = document.querySelector("#date-input")

// Get the current date and add 1 for tomorrow
const day = new Date()
const tomorrow = new Date(day)
tomorrow.setDate(tomorrow.getDate() + 1)

// Get the min input date
const minDate = tomorrow.toISOString().split("T")[0]
getDateInput.min = minDate
getDateInput.value = minDate
