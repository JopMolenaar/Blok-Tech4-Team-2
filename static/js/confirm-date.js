const getDateInput = document.querySelector("#date-input")

// Get the current date and add 1 for tomorrow
const day = new Date()
const tomorrow = new Date(day)
tomorrow.setDate(tomorrow.getDate() + 1)

// Get the min input date
const minDate = tomorrow.toISOString().split("T")[0]
getDateInput.min = minDate
getDateInput.value = minDate

// Calculate maxDate as the last weekday of the year
const maxDate = new Date(day.getFullYear(), 11, 31) // Set to last day of the current year

while (maxDate.getDay() === 0 || maxDate.getDay() === 6) {
    maxDate.setDate(maxDate.getDate() - 1)
}

const maxDateStr = maxDate.toISOString().split("T")[0]
getDateInput.max = maxDateStr
