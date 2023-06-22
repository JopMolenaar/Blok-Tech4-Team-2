const getDateInput = document.querySelector("#date-input"),
    day = new Date(),
    tomorrow = new Date(day),
    minDate = (tomorrow.setDate(tomorrow.getDate() + 1), tomorrow.toISOString().split("T")[0]),
    maxDate = ((getDateInput.min = minDate), (getDateInput.value = minDate), new Date(day.getFullYear(), 11, 31))
for (; 0 === maxDate.getDay() || 6 === maxDate.getDay(); ) maxDate.setDate(maxDate.getDate() - 1)
const maxDateStr = maxDate.toISOString().split("T")[0]
getDateInput.max = maxDateStr
